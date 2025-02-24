import axios from 'axios';

console.log(process.env.REACT_APP_API_URL)
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL + 'api' || 'http://localhost:8080/api', 
    timeout: 10000,                   
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
