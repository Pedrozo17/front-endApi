import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    FlatList, StyleSheet, KeyboardAvoidingView,
    Platform, SafeAreaView, ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/authContext';
import { getChatHistoryService  } from '../api/apiService';

const WS_URL = 'ws://192.168.0.104:8000/ws/chat/';

const ChatScreen = () => {
    const { userToken, userUid } = useContext(AuthContext);
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(true);
    const [conectado, setConectado] = useState(false);
    const ws = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        cargarHistorial();
        conectarWebSocket();
        return () => ws.current?.close();
    }, []);

    const cargarHistorial = async () => {
        try {
            const data = await getChatHistoryService(userToken);
            setMensajes(data);
        } catch (error) {
            console.log('Error historial:', error);
        } finally {
            setLoading(false);
        }
    };

    const conectarWebSocket = () => {
        ws.current = new WebSocket(WS_URL);

        ws.current.onopen = () => {
            console.log('✅ WebSocket conectado');
            setConectado(true);
        };

        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const nuevoMensaje = {
                id: Date.now().toString(),
                mensaje: data.mensaje,
                usuario: data.usuario,
            };
            setMensajes(prev => [...prev, nuevoMensaje]);
        };

        ws.current.onclose = () => {
            console.log('❌ WebSocket desconectado');
            setConectado(false);
        };

        ws.current.onerror = (e) => {
            console.log('Error WebSocket:', e.message);
        };
    };

    const enviarMensaje = () => {
        if (!texto.trim() || !conectado) return;

        ws.current.send(JSON.stringify({
            mensaje: texto.trim(),
            uid_usuario: userUid,
        }));

        setTexto('');
    };

    const renderMensaje = ({ item }) => {
        const esMio = item.usuario === userUid;
        return (
            <View style={[styles.bubbleContainer, esMio ? styles.bubbleDerecha : styles.bubbleIzquierda]}>
                {!esMio && (
                    <Text style={styles.bubbleUsuario}>
                        {item.usuario?.substring(0, 6)}...
                    </Text>
                )}
                <View style={[styles.bubble, esMio ? styles.bubbleMio : styles.bubbleOtro]}>
                    <Text style={[styles.bubbleTexto, esMio && styles.bubbleTextoMio]}>
                        {item.mensaje}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerTitulo}>💬 Chat ADSO</Text>
                    <View style={[styles.dot, { backgroundColor: conectado ? '#4ADE80' : '#EF4444' }]} />
                </View>

                {/* MENSAJES */}
                {loading ? (
                    <ActivityIndicator size="large" color="#4F46E5" style={{ flex: 1 }} />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={mensajes}
                        keyExtractor={(item) => item.id?.toString()}
                        renderItem={renderMensaje}
                        contentContainerStyle={styles.lista}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                )}

                {/* INPUT */}
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe un mensaje..."
                        value={texto}
                        onChangeText={setTexto}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.botonEnviar, !conectado && styles.botonDeshabilitado]}
                        onPress={enviarMensaje}
                        disabled={!conectado}
                    >
                        <Text style={styles.botonEnviarText}>➤</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#4F46E5' },
    container: { flex: 1, backgroundColor: '#F9FAFB' },

    // Header
    header: {
        backgroundColor: '#4F46E5', padding: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    dot: { width: 10, height: 10, borderRadius: 5 },

    // Lista
    lista: { padding: 16, paddingBottom: 8 },

    // Burbujas
    bubbleContainer: { marginBottom: 10, maxWidth: '80%' },
    bubbleDerecha: { alignSelf: 'flex-end', alignItems: 'flex-end' },
    bubbleIzquierda: { alignSelf: 'flex-start', alignItems: 'flex-start' },
    bubbleUsuario: { fontSize: 10, color: '#9CA3AF', marginBottom: 2, marginLeft: 8 },
    bubble: { borderRadius: 16, padding: 10, paddingHorizontal: 14 },
    bubbleMio: { backgroundColor: '#4F46E5', borderBottomRightRadius: 4 },
    bubbleOtro: { backgroundColor: '#fff', borderBottomLeftRadius: 4, elevation: 1 },
    bubbleTexto: { fontSize: 14, color: '#1F2937' },
    bubbleTextoMio: { color: '#fff' },

    // Input
    inputRow: {
        flexDirection: 'row', padding: 12,
        backgroundColor: '#fff', alignItems: 'center',
        borderTopWidth: 1, borderTopColor: '#E5E7EB'
    },
    input: {
        flex: 1, borderWidth: 1, borderColor: '#E5E7EB',
        borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10,
        fontSize: 14, maxHeight: 100, marginRight: 10
    },
    botonEnviar: {
        backgroundColor: '#4F46E5', width: 44, height: 44,
        borderRadius: 22, justifyContent: 'center', alignItems: 'center'
    },
    botonDeshabilitado: { backgroundColor: '#A5B4FC' },
    botonEnviarText: { color: '#fff', fontSize: 18 },
});

export default ChatScreen;