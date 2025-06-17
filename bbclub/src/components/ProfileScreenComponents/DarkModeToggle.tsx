import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {useDarkMode} from './DarkModeContext';

const DarkModeToggle: React.FC = () => {
  const {isDarkMode, toggleDarkMode} = useDarkMode();

  return (
    <View style={styles.settingItem}>
      <Text style={styles.settingText}>Koyu Mod</Text>
      <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
  },
});

export default DarkModeToggle;
