import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const AuthButton: React.FC<AuthButtonProps> = ({button, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{button}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#66914c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthButton;
