import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

const HelpAnimation: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        style={styles.animation}
        source={require('../../assets/Animations/eller.json')}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default HelpAnimation;
