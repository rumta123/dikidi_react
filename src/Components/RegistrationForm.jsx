import React, { useState } from "react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formWithRole = { ...formData, role: "USER" }; // Добавляем роль "USER"
    const formDataEncoded = new URLSearchParams(formWithRole).toString(); // Кодируем данные в формат x-www-form-urlencoded
  
    try {
      const response = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Указываем формат x-www-form-urlencoded
        },
        body: formDataEncoded, // Передаем закодированные данные
      });
  
      console.log("formWithRole (encoded)", formDataEncoded);
  
      // Проверяем, успешен ли ответ
      if (!response.ok) {
        const errorText = await response.text(); // Получаем текст ошибки
        console.log("Error response text:", errorText); // Логируем текст ошибки
        throw new Error(errorText); // Выбрасываем ошибку с текстом
      }
  
      // Ожидаем строковый ответ от сервера
      const responseText = await response.text(); // Получаем текстовый ответ от сервера
      alert(responseText); // Показываем текстовое сообщение от сервера
      console.log("Response message:", responseText); // Логируем успешный ответ
  
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
      console.error("Ошибка:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Регистрация</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="text"
        name="name"
        placeholder="Имя"
        value={formData.name}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="text"
        name="phone"
        placeholder="Телефон"
        value={formData.phone}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Зарегистрироваться
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "300px",
    marginLeft: "20%",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
};

export default RegistrationForm;
