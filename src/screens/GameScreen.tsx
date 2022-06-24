import * as React from 'react';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { detectPose } from '../PoseFrameProcessor';
import TestCanvas from '../components/TestCanvas';

const IS_FRONT_CAMERA = true;

const GameScreen = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const leftAnkle = useSharedValue({ x: 0, y: 0 });
  const frameValue = useSharedValue({ height: 1, width: 1 });
  const dims = useWindowDimensions();
  const [isLeft, setIsLeft] = React.useState(true);
  const [isIn, setIsIn] = React.useState(false);

  const devices = useCameraDevices();
  const device = IS_FRONT_CAMERA ? devices.front : devices.back;

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const detectedPoses = detectPose(frame);
    if (detectedPoses?.[0]) {
      const _pose = detectedPoses[0];
      leftAnkle.value = IS_FRONT_CAMERA ? _pose.rightAnkle : _pose.leftAnkle;
      frameValue.value = { height: frame.height, width: frame.width };

      const ankle = IS_FRONT_CAMERA ? _pose.rightAnkle : _pose.leftAnkle;

      if (ankle.x > 0 && frame.width > 0) {
        const _isOnTheLeft = frame.width / ankle.x > 2;
        runOnJS(setIsIn)(_isOnTheLeft);
      }
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const leftAnkleX = interpolate(
      leftAnkle.value.x,
      [0, frameValue.value.width],
      [0, dims.width],
    );
    const leftAnkleY = interpolate(
      leftAnkle.value.y,
      [0, frameValue.value.height],
      [0, dims.height],
    );
    return {
      position: 'absolute',
      backgroundColor: 'pink',
      height: 10,
      width: 10,
      transform: [{ translateY: leftAnkleY }, { translateX: leftAnkleX }],
    };
  }, [dims]);

  return device != null && hasPermission ? (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <Animated.View style={animatedStyle} />
      <TestCanvas isLeft={isLeft} isIn={isIn} />
    </>
  ) : null;
};

export default GameScreen;
