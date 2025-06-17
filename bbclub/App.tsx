import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import {store} from './src/redux/store';
import {DarkModeProvider} from './src/components/ProfileScreenComponents/DarkModeContext';

const App = () => {
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={undefined}>
      <DarkModeProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </DarkModeProvider>
    </KeyboardAvoidingView>
  );
};

export default App;
