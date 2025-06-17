import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AuthTitle from '../../components/AuthScreenComponents/AuthTitle';
import {useNavigation} from '@react-navigation/native';
import {useDarkMode} from '../../components/ProfileScreenComponents/DarkModeContext';
import LoginArea from '../../components/AuthScreenComponents/LoginArea';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const {isDarkMode} = useDarkMode();

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onLogin = () => {
    if (!email || !password) {
      setError('Lütfen e-posta ve şifre girin.');
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setError('');
      })
      .catch(err => {
        setError('Giriş başarısız: ' + err.message);
      });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <AuthTitle title="Kapı Komşum" />
      <LoginArea
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        error={error}
        onLogin={onLogin}
      />
      <View style={styles.textcontainer}>
        <Text style={[styles.text, textStyle]}>Hesabın yok mu? </Text>
        <Text
          style={[styles.text, textStyle]}
          onPress={() => navigation.navigate('Register')}>
          Kayıt Ol
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

export default LoginScreen;
