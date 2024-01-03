import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import LogadoTabs from './screens/Logado';
import Player from './screens/player';
import { RootStack } from './src/types/stackParam';
import SignScreen from './screens/SignScreen';
import { SafeAreaView, View } from 'react-native';

const Stack = createNativeStackNavigator<RootStack>();

const App = () => {
  return (
    
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Sign" component={SignScreen} />
        <Stack.Screen name="Logado" component={LogadoTabs} />
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default App;
