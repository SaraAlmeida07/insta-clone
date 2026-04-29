import axios from 'axios';
import router from '../router';


const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    //Busca o token que está salvo no navegador (localStorage)
    const token = localStorage.getItem('instaclone.token');

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
        const isAuthRequest = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');

        // Erro 401: Tenta fazer login de novo (apenas se não for uma tentativa de login/cadastro)
        if (status === 401 && !isAuthRequest) {
            alert('Sua sessão expirou. Faça login novamente.');
            localStorage.removeItem('instaclone.token'); // Tira o token quebrado
            localStorage.removeItem('instaclone.user');  // Tira o usuário
            router.push('/'); // Joga ele pra tela de login
        }

        return Promise.reject(error);
    }
);


export default api;