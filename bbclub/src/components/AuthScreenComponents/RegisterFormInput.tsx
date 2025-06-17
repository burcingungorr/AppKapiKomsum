import React from 'react';
import {TextInput, Text, StyleSheet, View} from 'react-native';

const FormInput: React.FC<FormInputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  icon,
}) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="grey"
          style={styles.input}
          secureTextEntry={secureTextEntry}
        />
        {icon}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fdfaf1',
    paddingHorizontal: 8,
    height: 60,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default FormInput;
