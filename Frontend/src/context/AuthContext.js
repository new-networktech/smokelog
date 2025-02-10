// Path: Frontend/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        username,
        email,
        password,
      }
    );
    const { token } = response.data;
    localStorage.setItem("token", token);
    await fetchUserProfile(token);
  };

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    await fetchUserProfile(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
