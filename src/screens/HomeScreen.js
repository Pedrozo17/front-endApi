import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useFocusEffect } from '@react-navigation/native'; // 👈 agrega este import
import { useCallback } from 'react'; // 👈 y este
import { AuthContext } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { perfilService } from "../api/apiService";


const HomeScreen = ({ navigation }) => {
    const { logout, userToken } = useContext(AuthContext); // 👈 agrega userToken
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
    useCallback(() => {
        cargarPerfil();
    }, [userToken])
);

   const cargarPerfil = async () => {
        try {
            // ✅ usa el token del contexto, no AsyncStorage
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
                <ActivityIndicator size="large" />
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.welcome}>Inicio - ADSO</Text>
            </View>

            {/* PERFIL */}
            <View style={styles.profileCard}>
                <Image
                    source={{
                        uri:user?.foto && user?.foto !== "sin foto"
                            ? user?.foto
                            : "https://via.placeholder.com/100"
                    }}
                    style={styles.avatar}
                />

                <View>
                    <Text style={styles.name}>
                        {user?.nombre || user?.email || "Usuario"}
                    </Text>
                    <Text style={styles.role}>
                        {(user?.rol || "aprendiz").toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* OPCIONES */}
            <View style={styles.menuGrid}>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Tasks')}
                >
                    <Text style={styles.cardIcon}>📋</Text>
                    <Text style={styles.cardText}>Mis Tareas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('CambiarFoto')}
                >
                    <Text style={styles.cardIcon}>📷</Text>
                    <Text style={styles.cardText}>Cambiar Foto</Text>
                </TouchableOpacity>

            </View>

            {/* LOGOUT */}
            <TouchableOpacity onPress={logout}>
                <Text style={styles.logout}>Cerrar Sesión</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        backgroundColor: 'green',
        padding: 20,
        marginBottom: 10
    },
    welcome: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    profileCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 20,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 4
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    role: {
        color: 'green',
        fontWeight: 'bold'
    },
    menuGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    card: {
        backgroundColor: '#fff',
        width: 140,
        height: 120,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4
    },
    cardIcon: {
        fontSize: 30,
        marginBottom: 10
    },
    cardText: {
        fontWeight: 'bold',
        color: '#333'
    },
    logout: {
        textAlign: 'center',
        marginTop: 40,
        color: 'red',
        fontWeight: 'bold'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default HomeScreen;