import React, { useContext, useState } from 'react';
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/authContext';
import { fotoService } from '../api/apiService';

const CambiarFotoScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [imageUri, setImageUri] = useState(null);
    const [subiendo, setSubiendo] = useState(false);

    const seleccionarFoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            return Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería');
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],  // cuadrada como avatar
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSubir = async () => {
        if (!imageUri) return Alert.alert('Sin imagen', 'Selecciona una foto primero');
        try {
            setSubiendo(true);
            await fotoService.cambiarFoto(userToken, imageUri);
            Alert.alert('✅ Listo', 'Foto actualizada correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>📷 Cambiar Foto</Text>

            <TouchableOpacity style={styles.preview} onPress={seleccionarFoto}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.imagen} />
                ) : (
                    <Text style={styles.placeholder}>Toca para seleccionar foto</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.boton, !imageUri && styles.botonDeshabilitado]}
                onPress={handleSubir}
                disabled={!imageUri || subiendo}
            >
                {subiendo
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.botonText}>Subir Foto</Text>
                }
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: 30, backgroundColor: '#F9FAFB' },
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, color: '#1F2937' },
    preview: {
        width: 180, height: 180, borderRadius: 90,
        backgroundColor: '#E5E7EB', justifyContent: 'center',
        alignItems: 'center', marginBottom: 30, overflow: 'hidden'
    },
    imagen: { width: '100%', height: '100%' },
    placeholder: { color: '#9CA3AF', textAlign: 'center', padding: 10 },
    boton: { backgroundColor: '#4F46E5', padding: 14, borderRadius: 10, width: '100%', alignItems: 'center' },
    botonDeshabilitado: { backgroundColor: '#A5B4FC' },
    botonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CambiarFotoScreen;