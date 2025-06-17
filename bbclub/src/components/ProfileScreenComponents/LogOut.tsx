import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {clearUser} from '../../redux/slice/UsernameSlice';
import auth from '@react-native-firebase/auth';

const LogOut = () => {
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await auth().signOut();

      dispatch(clearUser());
    } catch (error) {
      console.error('Çıkış yaparken bir hata oluştu: ', error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogOut}>
      <MaterialCommunityIcons name="logout" size={30} color="#d9534f" />
      <Text style={styles.buttonText}>Çıkış Yap</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fdfaf1',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    marginLeft: 10,
  },
});

export default LogOut;
