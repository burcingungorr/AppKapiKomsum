import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import UserAvatar from '../components/ProfileScreenComponents/UserAvatar';
import UserInfo from '../components/ProfileScreenComponents/UserInfo';
import Settings from '../components/ProfileScreenComponents/Settings';
import LogOut from '../components/ProfileScreenComponents/LogOut';
import {useDarkMode} from '../components/ProfileScreenComponents/DarkModeContext';
import EditProfile from '../components/ProfileScreenComponents/EditProfile';

const ProfileScreen = () => {
  const {isDarkMode} = useDarkMode();

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  return (
    <View style={[styles.container, containerStyle]}>
      <UserAvatar />
      <UserInfo />
      <EditProfile />
      <Settings />
      <LogOut />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  lightContainer: {
    backgroundColor: '#faf2dc',
  },
  darkContainer: {
    backgroundColor: '#181638',
  },
});

export default ProfileScreen;
