import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {TitleProps} from '../../types/home';
import {useDarkMode} from '../ProfileScreenComponents/DarkModeContext';
import Logo from './Logo';

const AuthTitle: React.FC<TitleProps> = ({title}) => {
  const {isDarkMode} = useDarkMode();

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 150,
  },
  text: {
    fontSize: 24,
    color: '#EF7613',
  },
});

export default AuthTitle;
