import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../redux/store';
import {fetchUserInfo} from '../redux/slice/UsernameSlice';
import {useDarkMode} from '../components/ProfileScreenComponents/DarkModeContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SurveyScreen from '../screens/SurveyScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddHelperScreen from '../screens/AddHelperScreen';
import SupportScreen from '../screens/SupportScreen';
import OldChatScreen from '../screens/OldChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const {isDarkMode} = useDarkMode();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name === 'Home') iconName = 'home-group';
          else if (route.name === 'Survey')
            iconName = 'file-document-edit-outline';
          else if (route.name === 'Chat') iconName = 'chat';
          else if (route.name === 'Profile') iconName = 'account';

          return (
            <MaterialCommunityIcons name={iconName} color={color} size={30} />
          );
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#181638' : '#fdfaf1',
        },
        tabBarActiveTintColor: isDarkMode ? '#EF7613' : '#66914c',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Survey" component={SurveyScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      if (initializing) setInitializing(false);

      if (firebaseUser) {
        setUser(firebaseUser);
        await dispatch(fetchUserInfo());
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="AddHelper" component={AddHelperScreen} />
            <Stack.Screen name="Support" component={SupportScreen} />
            <Stack.Screen name="OldChat" component={OldChatScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
