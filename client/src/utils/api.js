import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Habit API calls
export const habitAPI = {
  getHabits: async () => {
    const response = await api.get("/habits");
    return response.data;
  },

  createHabit: async (habitData) => {
    const response = await api.post("/habits", habitData);
    return response.data;
  },

  updateHabit: async (id, habitData) => {
    const response = await api.put(`/habits/${id}`, habitData);
    return response.data;
  },

  deleteHabit: async (id) => {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },

  completeHabit: async (id) => {
    const response = await api.post(`/habits/${id}/complete`);
    return response.data;
  },

  uncompleteHabit: async (id) => {
    const response = await api.post(`/habits/${id}/uncomplete`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/habits/stats");
    return response.data;
  },
};

export default api;
