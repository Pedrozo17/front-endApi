import React, { useState, useContext } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, Alert, StyleSheet
} from "react-native";
import { AuthContext } from "../context/authContext";
import { loginService } from "../api/apiService";
const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

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
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerIcon}>📋</Text>
                <Text style={styles.headerTitulo}>ADSO</Text>
                <Text style={styles.headerSub}>Gestor de Tareas</Text>
            </View>

            {/* FORMULARIO */}
            <View style={styles.card}>
                <Text style={styles.titulo}>Iniciar Sesión</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 8 }} />
                ) : (
                    <TouchableOpacity style={styles.boton} onPress={handleLogin}>
                        <Text style={styles.botonText}>Ingresar</Text>
                    </TouchableOpacity>
                )}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        padding: 20
    },

    // Header
    header: { alignItems: 'center', marginBottom: 32 },
    headerIcon: { fontSize: 48, marginBottom: 8 },
    headerTitulo: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
    headerSub: { fontSize: 14, color: '#6B7280', marginTop: 4 },

    // Card formulario
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        elevation: 2
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 20
    },

    // Inputs
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 14,
        fontSize: 14,
        color: '#1F2937'
    },

    // Botón
    boton: {
        backgroundColor: '#4F46E5',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 4
    },
    botonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default LoginScreen;