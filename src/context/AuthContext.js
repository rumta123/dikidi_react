import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Создаем контекст
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Проверяем наличие данных в cookies при загрузке страницы
    const storedIsLoggedIn = Cookies.get("isLoggedIn") === "true";
    const storedUserName = Cookies.get("userName");

    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const login = (name) => {
    setIsLoggedIn(true);
    setUserName(name);

    // Сохраняем данные в cookies
    Cookies.set("isLoggedIn", "true", { expires: 365 }); // Срок действия cookies 1 год
    Cookies.set("userName", name, { expires: 365 });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");

    // Удаляем данные из cookies
    Cookies.remove("isLoggedIn");
    Cookies.remove("userName");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
