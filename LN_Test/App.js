import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Auth/Login';
import Landing from './src/Home/Landing';
import ListPlace from './src/Home/ListPlace';
import PlaceInfo from './src/Home/PlaceInfo';

function HomeScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Home Screen</Text>
		</View>
	);
}

const Stack = createNativeStackNavigator();

function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name='Login' component={Login} />
				<Stack.Screen name='Landing' component={Landing} />
				<Stack.Screen name='ListPlace' component={ListPlace} />
				<Stack.Screen name='PlaceInfo' component={PlaceInfo} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
