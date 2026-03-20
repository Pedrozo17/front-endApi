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

    if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
    }

    return data;
};

// 📋 TAREAS
export const taskApiService = {
    getAll: (token) => fetch(`${BASE_URL}tareas/`, {
        headers: {
            'Authorization': `Bearer ${token}` // ✅ CORREGIDO
        }
    }).then(res => res.json()),
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
            throw new Error("Error al obtener perfil");
        }

        return data;
    }
};


