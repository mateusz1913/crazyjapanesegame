import * as React from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { detectPose } from './PoseFrameProcessor';

const IS_FRONT_CAMERA = true;

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const leftAnkle = useSharedValue({ x: 0, y: 0 });
  const frameValue = useSharedValue({ height: 1, width: 1 });
  const dims = useWindowDimensions();

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
      const pose = detectedPoses[0];
      leftAnkle.value = IS_FRONT_CAMERA ? pose.rightAnkle : pose.leftAnkle;
      frameValue.value = { height: frame.height, width: frame.width };
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
    </>
  ) : null;
}
