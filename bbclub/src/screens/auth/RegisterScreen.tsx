import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AuthTitle from '../../components/AuthScreenComponents/AuthTitle';
import RegisterArea from '../../components/AuthScreenComponents/RegisterArea';
import {useNavigation} from '@react-navigation/native';
import {useDarkMode} from '../../components/ProfileScreenComponents/DarkModeContext';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();

  const {isDarkMode} = useDarkMode();
  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.container, containerStyle]}>
      <AuthTitle title="Kapı Komşum" />
      <RegisterArea />
      <View style={styles.textcontainer}>
        <Text style={[styles.text, textStyle]}>Hesabın var mı? </Text>
        <Text
          style={[styles.text, textStyle]}
          onPress={() => navigation.navigate('Login')}>
          Giriş Yap
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  textcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 15,
  },
  lightContainer: {
    backgroundColor: '#faf2dc',
  },
  darkContainer: {
    backgroundColor: '#181638',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
});

export default RegisterScreen;
