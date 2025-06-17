import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const LocationSelector: React.FC<LocationSelectorProps> = ({
  label,
  onPress,
  error,
  disabled,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.selector,
          disabled && styles.disabled,
          error && styles.errorBorder,
        ]}>
        <Text style={[styles.text, disabled && styles.disabledText]}>
          {label}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fdfaf1',
  },
  text: {
    fontSize: 16,
  },
  disabled: {
    backgroundColor: '#fdfaf1',
  },
  disabledText: {
    color: '#999',
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default LocationSelector;
