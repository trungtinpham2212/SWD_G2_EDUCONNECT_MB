import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.0.2.2:7045'  
});


instance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default instance;