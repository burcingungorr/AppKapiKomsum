import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface SupportFormButtonProps {
  onPress: () => void;
}

const SupportFormButton: React.FC<SupportFormButtonProps> = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Gönder</Text>
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
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default SupportFormButton;
