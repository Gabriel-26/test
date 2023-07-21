import axios from 'axios';

//for adding doctors
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers:{
'X-Requested-With' : 'XTMLHttpRequest' , 'Content-Type':'application/json',
  }, // Replace with your Laravel API URL
  withCredentials: true, // Enable CORS credentials to include cookies
});

export default axiosInstance;           