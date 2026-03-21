import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../context/authContext";
import { perfilService } from "../api/apiService";

const HomeScreen = ({ navigation }) => {
    const { logout, userToken } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            cargarPerfil();
        }, [userToken])
    );

    const cargarPerfil = async () => {
        try {
            const data = await perfilService.getPerfil(userToken);
            setUser(data);
        } catch (error) {
            console.log("Error perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitulo}>Inicio - ADSO</Text>
                <Text style={styles.headerSub}>Bienvenido de nuevo 👋</Text>
            </View>

            {/* PERFIL */}
            <View style={styles.card}>
                <Image
                    source={{
                        uri: user?.foto && user?.foto !== "sin foto"
                            ? user?.foto
                            : "https://via.placeholder.com/100"
                    }}
                    style={styles.avatar}
                />
                <View style={styles.perfilInfo}>
                    <Text style={styles.cardTitulo}>
                        {user?.nombre || user?.email || "Usuario"}
                    </Text>
                    <Text style={styles.cardEstado}>
                        {(user?.rol || "aprendiz").toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* MENU */}
            <Text style={styles.titulo}>Accesos rápidos</Text>

            <TouchableOpacity
                style={styles.menuCard}
                onPress={() => navigation.navigate('Tasks')}
            >
                <Text style={styles.menuIcon}>📋</Text>
                <View>
                    <Text style={styles.cardTitulo}>Mis Tareas</Text>
                    <Text style={styles.cardDesc}>Ver y gestionar tus tareas</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuCard}
                onPress={() => navigation.navigate('CambiarFoto')}
            >
                <Text style={styles.menuIcon}>📷</Text>
                <View>
                    <Text style={styles.cardTitulo}>Cambiar Foto</Text>
                    <Text style={styles.cardDesc}>Actualiza tu foto de perfil</Text>
                </View>
            </TouchableOpacity>

            {/* LOGOUT */}
            <TouchableOpacity style={styles.botonLogout} onPress={logout}>
                <Text style={styles.botonLogoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#6B7280' },

    // Header
    header: {
        backgroundColor: '#4F46E5',
        padding: 24,
        paddingTop: 50,
        marginBottom: 20
    },
    headerTitulo: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    headerSub: { fontSize: 13, color: '#C7D2FE', marginTop: 4 },

    // Perfil card
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2
    },
    avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
    perfilInfo: { flex: 1 },

    // Textos reutilizables (igual que TasksScreen)
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#1F2937', paddingHorizontal: 20 },
    cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    cardEstado: { marginTop: 4, fontSize: 11, color: '#4F46E5', fontWeight: 'bold' },

    // Menu cards
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2
    },
    menuIcon: { fontSize: 28, marginRight: 16 },

    // Logout
    botonLogout: {
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#FEE2E2',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center'
    },
    botonLogoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 }
});

export default HomeScreen;