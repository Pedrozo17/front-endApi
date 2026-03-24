import React, { useContext, useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    TextInput, StyleSheet, ActivityIndicator, Alert, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // 👈 agrega
import { AuthContext } from '../context/authContext';
import { tareasService } from '../api/apiService';


const TasksScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [creando, setCreando] = useState(false);

    // Estado para el modal de edición
    const [modalVisible, setModalVisible] = useState(false);
    const [tareaEditando, setTareaEditando] = useState(null);
    const [editTitulo, setEditTitulo] = useState('');
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editEstado, setEditEstado] = useState('');

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        try {
            setLoading(true);
            const data = await tareasService.getTareas(userToken);
            setTareas(data.datos);
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
            cargarTareas();
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setCreando(false);
        }
    };

    const abrirEditar = (tarea) => {
        setTareaEditando(tarea);
        setEditTitulo(tarea.titulo);
        setEditDescripcion(tarea.descripcion || '');
        setEditEstado(tarea.estado || 'pendiente');
        setModalVisible(true);
    };

    const handleEditar = async () => {
        if (!editTitulo.trim()) return Alert.alert('Campo requerido', 'Escribe un título');
        try {
            await tareasService.editarTarea(
                userToken, tareaEditando.id,
                editTitulo, editDescripcion, editEstado
            );
            setModalVisible(false);
            cargarTareas();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleEliminar = (tarea) => {
        Alert.alert(
            'Eliminar tarea',
            `¿Seguro que quieres eliminar "${tarea.titulo}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar', style: 'destructive',
                    onPress: async () => {
                        try {
                            await tareasService.eliminarTarea(userToken, tarea.id);
                            cargarTareas();
                        } catch (error) {
                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    const renderTarea = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardBody}>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                {item.descripcion ? (
                    <Text style={styles.cardDesc}>{item.descripcion}</Text>
                ) : null}
                <Text style={styles.cardEstado}>
                    {(item.estado || 'PENDIENTE').toUpperCase()}
                </Text>
            </View>
            <View style={styles.cardAcciones}>
                <TouchableOpacity
                    style={styles.btnEditar}
                    onPress={() => abrirEditar(item)}
                >
                    <Text style={styles.btnEditarText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnEliminar}
                    onPress={() => handleEliminar(item)}
                >
                    <Text style={styles.btnEliminarText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
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

            {/* MODAL EDITAR */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.titulo}>Editar Tarea</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Título"
                            value={editTitulo}
                            onChangeText={setEditTitulo}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Descripción"
                            value={editDescripcion}
                            onChangeText={setEditDescripcion}
                        />

                        {/* SELECTOR DE ESTADO */}
                        <Text style={styles.labelEstado}>Estado:</Text>
                        <View style={styles.estadoRow}>
                            {['pendiente', 'en progreso', 'completada'].map((e) => (
                                <TouchableOpacity
                                    key={e}
                                    style={[
                                        styles.estadoBtn,
                                        editEstado === e && styles.estadoBtnActivo
                                    ]}
                                    onPress={() => setEditEstado(e)}
                                >
                                    <Text style={[
                                        styles.estadoBtnText,
                                        editEstado === e && styles.estadoBtnTextActivo
                                    ]}>
                                        {e}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.boton} onPress={handleEditar}>
                            <Text style={styles.botonText}>Guardar cambios</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botonCancelar}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.botonCancelarText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#4F46E5' }, // 👈 color del safe area arriba
    container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1F2937' },
    form: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 14 },
    boton: { backgroundColor: '#4F46E5', padding: 12, borderRadius: 8, alignItems: 'center' },
    botonText: { color: '#fff', fontWeight: 'bold' },
    botonCancelar: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    botonCancelarText: { color: '#6B7280', fontWeight: 'bold' },

    // Card tarea
    card: {
        backgroundColor: '#fff', borderRadius: 12, padding: 16,
        marginBottom: 12, elevation: 2,
        flexDirection: 'row', alignItems: 'center'
    },
    cardBody: { flex: 1 },
    cardTitulo: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 4 },
    cardEstado: { marginTop: 8, fontSize: 11, color: '#4F46E5', fontWeight: 'bold' },
    cardAcciones: { flexDirection: 'row', gap: 8 },
    btnEditar: { backgroundColor: '#EEF2FF', padding: 8, borderRadius: 8 },
    btnEditarText: { fontSize: 16 },
    btnEliminar: { backgroundColor: '#FEE2E2', padding: 8, borderRadius: 8 },
    btnEliminarText: { fontSize: 16 },

    // Modal
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end'
    },
    modalCard: {
        backgroundColor: '#fff', borderTopLeftRadius: 20,
        borderTopRightRadius: 20, padding: 24
    },

    // Estado selector
    labelEstado: { fontSize: 13, color: '#6B7280', marginBottom: 8, fontWeight: 'bold' },
    estadoRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    estadoBtn: {
        flex: 1, padding: 8, borderRadius: 8,
        borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center'
    },
    estadoBtnActivo: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
    estadoBtnText: { fontSize: 11, color: '#6B7280', fontWeight: 'bold' },
    estadoBtnTextActivo: { color: '#fff' },

    vacio: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});

export default TasksScreen;