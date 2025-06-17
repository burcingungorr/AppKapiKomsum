import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

const ChatAnimation: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        style={styles.animation}
        source={require('../../assets/Animations/chat.json')}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 300,
    height: 300,
  },
});

export default ChatAnimation;
