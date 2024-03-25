
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/serchroutes/routes/StackNavigator';

export default function App() {
 
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}


