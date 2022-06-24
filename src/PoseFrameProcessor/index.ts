import type { Frame } from 'react-native-vision-camera';

export function detectPose(frame: Frame): string[] {
  'worklet';
  return __detectPose(frame);
}
