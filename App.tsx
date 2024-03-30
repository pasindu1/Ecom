import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AppNavigator from './src/navigation/appNavigator';

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;
