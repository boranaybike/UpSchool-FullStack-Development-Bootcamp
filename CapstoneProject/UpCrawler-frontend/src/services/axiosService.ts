import axios from "axios";
import { useNavigate  } from 'react-router-dom';
import tokenService from "./tokenService";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL:BASE_URL
});

api.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = `Bearer ${tokenService.getToken()}`;
      config.headers['Content-Type'] = 'application/json';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => { 
      const originalRequest = error.config;

      if (
        error.response.status === 401 &&
        originalRequest.url !== `${BASE_URL}/login`
      ) {        
        const navigate  = useNavigate ();
        navigate('/login');
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

export default api;