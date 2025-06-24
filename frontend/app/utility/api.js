import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    headers: {
        'content-type': 'application/json',
    },
});

// Registration
export const register = async (formData) => {
    const { data } = await API.post('/register', formData);
    return data;
}

// Login
export const login = async (formData) => {
    const { data } = await API.post('/login', formData);
    return data;
}
