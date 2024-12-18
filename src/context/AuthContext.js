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
  const [role, setRole] = useState(""); // Добавляем состояние для роли

  useEffect(() => {
    // Проверяем наличие данных в cookies при загрузке страницы
    const storedIsLoggedIn = Cookies.get("isLoggedIn") === "true";
    const storedUserName = Cookies.get("userName");
    const storedRole = Cookies.get("role"); // Получаем роль из cookies

    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      setRole(storedRole); // Устанавливаем роль
    }
  }, []);

  const login = (name, userRole) => { // Добавляем параметр для роли
    setIsLoggedIn(true);
    setUserName(name);
    setRole(userRole); // Устанавливаем роль

    // Сохраняем данные в cookies
    Cookies.set("isLoggedIn", "true", { expires: 365 }); // Срок действия cookies 1 год
    Cookies.set("userName", name, { expires: 365 });
    Cookies.set("role", userRole, { expires: 365 }); // Сохраняем роль
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setRole(""); // Очищаем роль

    // Удаляем данные из cookies
    Cookies.remove("isLoggedIn");
    Cookies.remove("userName");
    Cookies.remove("role"); // Удаляем роль
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
