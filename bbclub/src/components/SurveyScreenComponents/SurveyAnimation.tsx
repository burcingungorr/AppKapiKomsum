import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

const SurveyAnimation: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        style={styles.animation}
        source={require('../../assets/Animations/anket.json')}
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
    marginTop: 180,
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default SurveyAnimation;
