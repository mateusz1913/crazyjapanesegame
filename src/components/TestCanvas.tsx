import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Pose } from '../PoseFrameProcessor';
import Animated, { useAnimatedReaction } from 'react-native-reanimated';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

type TPoint = {
  y: number;
  x: number;
};

type Props = {
  isLeft: boolean;
  isIn: boolean;
};

const TestCanvas = ({ isLeft, isIn }: Props) => {
  return (
    <View style={styles.container}>
      <View style={isLeft ? styles.halfMaskLeft : styles.halfMaskRight} />
      <View
        style={[
          styles.inOut,
          {
            backgroundColor: isIn ? 'red' : 'green',
          },
        ]}>
        <Text>{isIn ? 'IN' : 'OUT'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'absolute',
  },
  halfMaskLeft: {
    height: HEIGHT,
    width: WIDTH / 2,
    top: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'red',
    opacity: 0.5,
  },
  halfMaskRight: {
    height: HEIGHT,
    width: WIDTH / 2,
    top: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'red',
  },
  inOut: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 40,
    width: 100,
    height: 100,
    zIndex: 100,
    padding: 12,
  },
});

export default TestCanvas;
