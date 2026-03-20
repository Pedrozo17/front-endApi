import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.40.38/api/"; 

export const loginService = async (email, password) => {
    try {
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

        return data; // debe traer { token: "..." }
    } catch (error) {
        throw error;
    }
};


// 📋 OBTENER TAREAS
export const taskApiService = {
    getAll: (token) => fetch(`${BASE_URL}/tareas/`,{
        headers:{
            'Authorization' : `Bearer${token}`
        }
    }).then(res => res.json()),

    create: (token, data) => fetch(`${BASE_URL}/tareas/`,{
        headers:{
            'Authorization' : `Bearer${token}`,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    update: (token, id, data) => fetch(`${BASE_URL}/tareas/${id}`,{
        method : 'PUT',
        headers:{
            'Authorization' : `Bearer${token}`,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    delete:(token, id) => fetch(`${BASE_URL}/tareas/${id}`,{
        method : 'DELETE',
        headers:{
            'Authorization' : `Bearer${token}`,
        },
    })
};


