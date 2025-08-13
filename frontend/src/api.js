import axios from 'axios';

// Use Vite's environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

console.log("API Base URL:", apiBaseUrl); // Debugging

const api = axios.create({
  baseURL: apiBaseUrl,
});

export default api;