import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useDarkMode} from '../ProfileScreenComponents/DarkModeContext';

const SupportForm: React.FC<SupportFormProps> = ({
  topic,
  description,
  setTopic,
  setDescription,
  error,
}) => {
  const {isDarkMode} = useDarkMode();
  const labelStyle = isDarkMode ? styles.darkLabel : styles.lightLabel;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>Konu</Text>
      <TextInput
        style={styles.input}
        value={topic}
        onChangeText={setTopic}
        placeholder="Konu girin"
      />

      <Text style={[styles.label, labelStyle]}>Açıklama</Text>
      <TextInput
        style={[styles.input, {height: 100}]}
        value={description}
        onChangeText={setDescription}
        placeholder="Açıklama girin"
        multiline
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 18,
    marginTop: 80,
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
  },
  lightLabel: {
    color: '#000',
  },
  darkLabel: {
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 45,
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    marginBottom: 16,
    backgroundColor: '#fdfaf1',
    fontSize: 20,
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
});

export default SupportForm;
