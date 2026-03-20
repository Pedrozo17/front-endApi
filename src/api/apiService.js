import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.40.38:8000/api/";

// 🔐 LOGIN
export const loginService = async (email, password) => {
    const response = await fetch(`${BASE_URL}auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
    }); 

    const data = await response.json();

    console.log("STATUS:", response.status); // 👈
    console.log("DATA:", data); // 👈
    console.log("URL:", `${BASE_URL}perfil/`);

    if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
    }

    return data;
};

// 📋 TAREAS
export const tareasService = {
    getTareas: async (token) => {
        const response = await fetch(`${BASE_URL}tareas/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.detail || 'Error al obtener tareas');
        return data;
    },

    crearTarea: async (token, titulo, descripcion) => {
        const response = await fetch(`${BASE_URL}tareas/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, descripcion })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.detail || 'Error al crear tarea');
        return data;
    }
};


// 👤 PERFIL (NUEVO)
export const perfilService = {
getPerfil: async (token) => {
    const response = await fetch(`${BASE_URL}perfil/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Error perfil detalle:', data); // 👈 agrega esto
        throw new Error(data?.detail || data?.mensaje || "Error al obtener perfil");
    }

    return data;
}
};


