import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import {useDarkMode} from '../ProfileScreenComponents/DarkModeContext';
import AuthButton from './AuthButton';

type LoginAreaProps = {
  email: string;
  password: string;
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
  error?: string;
  onLogin: () => void;
};

const LoginArea: React.FC<LoginAreaProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  error,
  onLogin,
}) => {
  const {isDarkMode} = useDarkMode();

  const handlePasswordReset = () => {
    if (!email) {
      Alert.alert('Uyarı', 'Lütfen önce e-posta adresinizi girin.');
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() =>
        Alert.alert(
          'Başarılı',
          'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
        ),
      )
      .catch(error => Alert.alert('Hata', error.message || 'Bir hata oluştu.'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş</Text>

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="grey"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Şifre"
          placeholderTextColor="grey"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <MaterialCommunityIcons
          name="key"
          color="grey"
          size={24}
          style={styles.icon}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable onPress={handlePasswordReset}>
        <Text
          style={[
            styles.passwordtext,
            {color: isDarkMode ? 'white' : 'black'},
          ]}>
          Şifremi Unuttum
        </Text>
      </Pressable>

      <AuthButton button="Giriş Yap" onPress={onLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginVertical: 8,
    color: '#525252',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#fdfaf1',
    height: 60,
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fdfaf1',
    paddingHorizontal: 8,
    height: 60,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
  passwordtext: {
    position: 'absolute',
    right: 5,
    top: 15,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  errorText: {
    marginTop: 8,
    marginBottom: 8,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default LoginArea;
