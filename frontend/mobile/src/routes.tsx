// aula 04 46:00
import React from 'react';

import { NavigationContainer } from "@react-navigation/native";
// // aula 04 47:50 navegacao em stack
import { createStackNavigator } from "@react-navigation/stack";

import Home from './pages/Home';
import Details from './pages/Details';
import Points from './pages/Points';


// https://reactnavigation.org/docs/hello-react-navigation
const AppStack = createStackNavigator();

const Routes = () => {
    return (
        // aula 04 49:00
        <NavigationContainer>
            <AppStack.Navigator headerMode="none" screenOptions={{ cardStyle: { backgroundColor: '#f0f0f5' } }}>
                <AppStack.Screen name="Home" component={Home} />
                <AppStack.Screen name="Details" component={Details} />
                <AppStack.Screen name="Points" component={Points} />
            </AppStack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;
// agora importe esse componente dentro de App.tsx