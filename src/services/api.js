import axios from 'axios';
import router from '../router';


const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    //Busca o token que está salvo no navegador (localStorage)
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    // Caso ocorra algum erro antes mesmo do envio
    return Promise.reject(error);
});

api.interceptors.response.use(
    // Se a resposta vier de boa (2xx), segue o fluxo normal
    (response) => response,

    // Se vier erro (4xx, 5xx)
    (error) => {
        const status = error.response?.status;

        // Erro 401: Tenta fazer login de novo!
        if (status === 401) {
            alert('Sua sessão expirou. Faça login novamente.');
            localStorage.removeItem('token'); // Tira o token quebrado
            localStorage.removeItem('user');  // Tira o usuário
            router.push('/login'); // Joga ele pra tela de login
        }

        return Promise.reject(error);
    }
);


export default api;