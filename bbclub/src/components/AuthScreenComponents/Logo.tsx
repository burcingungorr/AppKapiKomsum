import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Logo = () => {
  const logo = require('../../assets/logo/logo.png');

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  logo: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
  },
});
