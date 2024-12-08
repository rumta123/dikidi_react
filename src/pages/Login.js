import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Импортируем хук контекста
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate
import AuthForm from '../Components/AuthForm'; // Путь зависит от структуры вашего проекта

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login, isLoggedIn } = useAuth(); // Получаем функцию login из контекста
  const navigate = useNavigate(); // Хук для навигации

  useEffect(() => {
    if (isLoggedIn) {
      // Если пользователь авторизован, переходим на страницу Dashboard
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]); // Эффект срабатывает при изменении isLoggedIn

  const handleAuth = async (email, password) => {
    const endpoint = isLoginMode
      ? "http://localhost:8081/auth/login"
      : "http://localhost:8081/auth/register";
  
    const loginData = {
      email: email,
      password: password,
    };
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(loginData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      if (isLoginMode) {
        const { name } = await response.json(); // Получаем имя пользователя из ответа сервера
        login(name); // Сохраняем имя пользователя в cookies
        navigate("/dashboard");
      } else {
        alert("Регистрация успешна. Теперь вы можете войти.");
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error.message);
      alert("Ошибка авторизации: " + error.message);
    }
  };
  
  

  return (
    <div style={styles.wrapper}>
      <AuthForm isLoginMode={isLoginMode} onSubmit={handleAuth} />
      <button
        onClick={() => setIsLoginMode(!isLoginMode)}
        style={{ ...styles.switchButton }}
      >
        {isLoginMode ? "Перейти к Регистрации" : "Перейти к Входу"}
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: 0,
    backgroundColor: "#f9f9f9",
  },
  switchButton: {
    marginTop: 10,
    padding: "10px",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "300px",
    textAlign: "center",
  },
};

export default Login;
