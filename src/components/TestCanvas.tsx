import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

type TPoint = {
  y: number;
  x: number;
};

const POINTS: TPoint[] = [
  {
    y: 100,
    x: 100,
  },
  {
    y: 150,
    x: 250,
  },
  {
    y: 400,
    x: 150,
  },
  {
    y: 300,
    x: 50,
  },
  {
    y: 500,
    x: 300,
  },
  {
    y: 500,
    x: 3,
  },
];

const TestCanvas = () => {
  const [points, setPoints] = useState<TPoint[]>(POINTS);
  const [isLeft, setIsLeft] = useState(true);

  const getSmallestX = (pts: TPoint[]) => {
    return Math.min(...pts.map(p => p.x));
  };

  const getLargestX = (pts: TPoint[]) => {
    return Math.max(...pts.map(p => p.x));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLeft(!isLeft);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLeft]);

  return (
    <View style={styles.container}>
      <View style={isLeft ? styles.halfMaskLeft : styles.halfMaskRight} />
      {/* {isLeft ? (
        <View style={styles.halfMaskLeft} />
      ) : (
        <View style={styles.halfMaskRight} />
      )} */}
      {points.map(pt => (
        <View
          style={[
            styles.point,
            {
              top: pt.y,
              left: pt.x,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  halfMaskLeft: {
    height: HEIGHT,
    width: WIDTH / 2,
    top: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'red',
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
  point: {
    backgroundColor: 'blue',
    position: 'absolute',
    zIndex: 100,
    width: 5,
    height: 5,
    borderRadius: 5,
  },
});

export default TestCanvas;
