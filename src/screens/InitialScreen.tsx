import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'GameScreen'>;

const InitialScreen = ({ navigation: { navigate } }: Props) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigate('GameScreen')} style={styles.button}>
        <Text style={styles.text}>Start the game</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 20,
    backgroundColor: 'red',
    borderRadius: 20,
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
});

export default InitialScreen;
