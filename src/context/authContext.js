import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userUid, setUserUid] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 👈 faltaba

    const login = async (token, uid) => {
        setUserToken(token);
        setUserUid(uid);
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userUid', uid);
    };

    const logout = async () => { // 👈 faltaba
        setUserToken(null);
        setUserUid(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userUid');
    };

    const isLoggedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const uid = await AsyncStorage.getItem('userUid');
            setUserToken(token);
            setUserUid(uid);
        } catch (e) {
            console.log('error en persistencia: ', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn(); // 👈 faltaba llamarlo
    }, []);

    return ( // 👈 faltaba el return
        <AuthContext.Provider value={{ login, logout, userToken, userUid, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};