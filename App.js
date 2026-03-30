import React, {useContext} from "react";
import {ActivityIndicator, View} from "react-native";

import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {AuthProvider, AuthContext} from "./src/context/authContext";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TasksScreen from "./src/screens/TasksScreen";         // 👈 nuevo
import CambiarFotoScreen from "./src/screens/CambiarFotoScreen"; // 👈 nuevo
import ChatScreen from "./src/screens/ChatScreen";

const Stack = createNativeStackNavigator();

const AppNav = () => {
    const {userToken, isLoading} = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large" color="green"/>
            </View>
        );
    }

    return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {userToken ? (
                // ✅ Stack.Group sí está permitido como hijo directo
                <Stack.Group>
                    <Stack.Screen name="HomeScreen" component={HomeScreen}/>
                    <Stack.Screen name="Tasks" component={TasksScreen}/>
                    <Stack.Screen name="CambiarFoto" component={CambiarFotoScreen}/>
                    <Stack.Screen name="Chat" component={ChatScreen}/>
                </Stack.Group>
            ) : (
                <Stack.Screen name="Login" component={LoginScreen}/>
                
            )}
        </Stack.Navigator>
    </NavigationContainer>
);
};

export default function App() {
    return (
        <AuthProvider>
            <AppNav/>
        </AuthProvider>
    );
}