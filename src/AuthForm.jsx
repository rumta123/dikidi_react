import React, { useState } from "react";

function AuthForm({ isLoginMode, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      onSubmit(email, password);
    } else {
      onSubmit(email, password, { name, phone, role });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
      <h2 className="mb-4">{isLoginMode ? "Вход" : "Регистрация"}</h2>

      {!isLoginMode && (
        <>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Имя
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLoginMode}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Телефон
            </label>
            <input
              type="text"
              id="phone"
              className="form-control"
              placeholder="Введите ваш телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required={!isLoginMode}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Роль
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Админимтратор</option>
              <option value="admin">Менеджер</option>
            </select>
          </div>
        </>
      )}

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="form-control"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Пароль
        </label>
        <input
          type="password"
          id="password"
          className="form-control"
          placeholder="Введите ваш пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        {isLoginMode ? "Войти" : "Зарегистрироваться"}
      </button>
    </form>
  );
}



export default AuthForm;
