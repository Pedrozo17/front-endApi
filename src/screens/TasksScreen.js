import React, { useContext, useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    TextInput, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { AuthContext } from '../context/authContext';
import { tareasService } from '../api/apiService';

const TasksScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [creando, setCreando] = useState(false);

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        try {
            setLoading(true);
            const data = await tareasService.getTareas(userToken);
            setTareas(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCrear = async () => {
        if (!titulo.trim()) return Alert.alert('Campo requerido', 'Escribe un título');
        try {
            setCreando(true);
            await tareasService.crearTarea(userToken, titulo, descripcion);
            setTitulo('');
            setDescripcion('');
            cargarTareas(); // recargar lista
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setCreando(false);
        }
    };

    const renderTarea = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            {item.descripcion ? (
                <Text style={styles.cardDesc}>{item.descripcion}</Text>
            ) : null}
            <Text style={styles.cardEstado}>
                {item.estado?.toUpperCase() || 'PENDIENTE'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>📋 Mis Tareas</Text>

            {/* FORMULARIO NUEVA TAREA */}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Título de la tarea"
                    value={titulo}
                    onChangeText={setTitulo}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descripción (opcional)"
                    value={descripcion}
                    onChangeText={setDescripcion}
                />
                <TouchableOpacity
                    style={styles.boton}
                    onPress={handleCrear}
                    disabled={creando}
                >
                    <Text style={styles.botonText}>
                        {creando ? 'Creando...' : '+ Nueva Tarea'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* LISTA */}
            {loading ? (
                <ActivityIndicator size="large" color="#4F46E5" />
            ) : (
                <FlatList
                    data={tareas}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderTarea}
                    ListEmptyComponent={
                        <Text style={styles.vacio}>No tienes tareas aún</Text>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1F2937' },
    form: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 14 },
    boton: { backgroundColor: '#4F46E5', padding: 12, borderRadius: 8, alignItems: 'center' },
    botonText: { color: '#fff', fontWeight: 'bold' },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
    cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 4 },
    cardEstado: { marginTop: 8, fontSize: 11, color: '#4F46E5', fontWeight: 'bold' },
    vacio: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});

export default TasksScreen;