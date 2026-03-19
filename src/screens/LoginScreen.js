import React, {useState, useContext} from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
    Alert,
    StyleSheet
} from "react-native";

import {AuthContext} from "../context/authContext";
import {loginService} from "../api/apiService";
const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const {login} = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("Error", "Completa todos los campos");
        }

        setLoading(true);
        try {
            const data = await loginService(email, password);
            await login(data.token);
        } catch (e) {
            Alert.alert("Error de login", e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={style.container}>
            <Text style={style.tittle}>
                Adso gestor de tareas
            </Text>

            <TextInput
                style={style.input}
                placeholder="correo electronico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={style.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="green"/>
            ) : (
                <Button title="Ingresar" onPress={handleLogin} color="green"/>
            )}
        </View>
    );
};
const style = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', padding:20},
    tittle: {fontSize: 20, fontWeight: "bold", textAlign: 'center', marginBottom: 30, color:'green'},
    input: {borderBottomWidth: 1, borderColor: "gray", marginBottom: 20, padding:10 }
});
export default LoginScreen;