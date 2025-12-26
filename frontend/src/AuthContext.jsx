// src/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (tk) => {
    localStorage.setItem("token", tk);
    setToken(tk);             // re-renders whole app
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);           // re-renders whole app
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
