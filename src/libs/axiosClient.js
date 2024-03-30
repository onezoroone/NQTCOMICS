import axios from "axios"

const axiosClient = axios.create({
    withCredentials: true,
});
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config;
})

axiosClient.interceptors.request.use((response) => {
    return response;
}, (error) => {
    const {response} = error;
    if(response.status === 401){
        localStorage.removeItem('token');
    }

    throw error;
})

export default axiosClient;