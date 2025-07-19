import { useState, useEffect, createContext, useContext } from "react";
import apiService from "../services/apiService";

// Créer le contexte d'authentification
const AuthContext = createContext({});

// Provider pour envelopper l'application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (apiService.auth.isAuthenticated()) {
        // Récupérer l'utilisateur depuis le localStorage
        const savedUser = apiService.auth.getUser();
        if (savedUser) {
          setUser(savedUser);
        } else {
          // Si pas d'utilisateur en local, le récupérer depuis l'API
          const userData = await apiService.auth.getCurrentUser();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // En cas d'erreur (token invalide), déconnecter
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await apiService.auth.login(credentials);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await apiService.auth.register(userData);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    apiService.auth.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook pour utiliser l'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
