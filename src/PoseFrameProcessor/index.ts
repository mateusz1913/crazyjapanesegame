import type { Frame } from 'react-native-vision-camera';

export type Pose = {
  leftAnkle: Position;
  rightAnkle: Position;
  leftKnee: Position;
  rightKnee: Position;
  leftHip: Position;
  rightHip: Position;
  leftWrist: Position;
  rightWrist: Position;
  leftElbow: Position;
  rightElbow: Position;
  leftShoulder: Position;
  rightShoulder: Position;
  leftEye: Position;
  rightEye: Position;
};

export type Position = {
  x: number;
  y: number;
  z: number;
};

export function detectPose(frame: Frame): Pose[] {
  'worklet';
  // @ts-ignore
  return __detectPose(frame);
}
