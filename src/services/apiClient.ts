import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.aiphotoeditor.internal/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // Inject mock authorization header
  config.headers.Authorization = `Bearer mock_jwt_token_2026_photo_ai`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Error Interceptor:', error?.message || error);
    return Promise.reject(error);
  }
);
