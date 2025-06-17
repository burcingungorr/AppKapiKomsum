import React from 'react';
import {View, StyleSheet} from 'react-native';
import Title from '../components/Title';
import AddSurvey from '../components/SurveyScreenComponents/AddSurvey';
import Surveys from '../components/SurveyScreenComponents/Surveys';
import {useDarkMode} from '../components/ProfileScreenComponents/DarkModeContext';

const SurveyScreen = () => {
  const {isDarkMode} = useDarkMode();
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  return (
    <View style={[styles.container, containerStyle]}>
      <Title title="Anketler" />
      <AddSurvey />
      <Surveys />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  lightContainer: {
    backgroundColor: '#faf2dc',
  },
  darkContainer: {
    backgroundColor: '#181638',
  },
});

export default SurveyScreen;
