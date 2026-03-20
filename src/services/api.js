const BASE_URL = "http://192.168.40.38/api";

export const getPerfil = async (token) => {
  const res = await fetch(`${BASE_URL}/perfils/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener perfil");

  return await res.json();
};