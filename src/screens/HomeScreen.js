import React, {useContext} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { AuthContext } from "../context/authContext";

const HomeScreen = ({navigation}) => {
    const {logout} = useContext(AuthContext);
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>
                    Hola desarrolador
                </Text>

                <Text style={styles.menuGrid}>
                    Bienvenido al panel principal
                </Text>
            </View>

            <View style={styles.menuGrid}>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Tasks')}>
                    <Text style={styles.cardIcon}>📋</Text>
                    <Text style={styles.cardText}>Gestionar Tareas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={logout}>
                    <Text style={styles.cardIcon}>🚪</Text>
                    <Text style={styles.cardText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1,backgroundColor: '#f0f2f5', padding:20},
    header: {marginTop: 60, marginBottom:30},
    welcome:{fontSize:20, fontWeight: 'bold', color:'green'},
    sub: {fontSize: 16, color: "#666" },
    menuGrid: {flexDirection: 'row', justifyContent: 'space-between'},
    card: {backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 15, elevation: 4},
    cardIcon: {fontSize: 40, marginBottom: 10},
    cardText: {fontWeight: 'bold', color: '#333'}
});
export default HomeScreen;
