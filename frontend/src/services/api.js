import axios from 'axios';
import { Platform } from 'react-native';

// For Android Emulator, localhost is 10.0.2.2
// For iOS and Web, it's localhost
const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3001/api' 
  : Platform.OS === 'web' 
    ? (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:3001/api')
    : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1, color, size) => {
  const response = await api.post('/cart', { productId, quantity, color, size });
  return response.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await api.patch(`/cart/${cartItemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (cartItemId) => {
  const response = await api.delete(`/cart/${cartItemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

export default api;
