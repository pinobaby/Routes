import 'react-native-gesture-handler';
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomePageScreen from '../screens/home/HomePageScreen';

const StackNavigator = () => {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={
        {
          headerShown: false,
        }
      }
    >
      <Stack.Screen name="home" component={HomePageScreen} />
    </Stack.Navigator>
  )
}

export default StackNavigator