import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {TitleProps} from '../types/home';
import {useDarkMode} from './ProfileScreenComponents/DarkModeContext';

const Title: React.FC<TitleProps> = ({title}) => {
  const {isDarkMode} = useDarkMode();
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  lightText: {
    color: 'black',
  },
  darkText: {
    color: '#fdfaf1',
  },
});

export default Title;
