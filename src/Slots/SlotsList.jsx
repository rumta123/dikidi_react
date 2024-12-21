import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SlotList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [masterId, setMasterId] = useState(""); // ID мастера для фильтрации
  const [masters, setMasters] = useState([]); // Список мастеров
  const [slots, setSlots] = useState([]); // Слоты для отображения

  // Загружаем список мастеров
  useEffect(() => {
    fetch("http://localhost:8081/masters")  // Этот endpoint должен вернуть список мастеров
      .then((response) => response.json())
      .then((data) => setMasters(data))
      .catch((error) => {
        console.error("Ошибка при загрузке мастеров:", error);
      });
  }, []);

  // Загружаем слоты для всех мастеров на выбранную дату
  const fetchSlots = useCallback(() => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Преобразуем дату в формат yyyy-MM-dd
    const url = `http://localhost:8081/workhours/date/${formattedDate}/slots`; // Получаем все слоты на выбранную дату
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSlots(data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке слотов:", error);
      });
  }, [selectedDate]);

  // Загружаем слоты при изменении даты
  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Фильтруем слоты по выбранному мастеру
  const filteredSlots = masterId
    ? slots.filter((slot) => slot.master && slot.master.id === parseInt(masterId))
    : slots;

  // Фильтруем мастеров по наличию слотов на выбранную дату
  const filteredMasters = masters.filter((master) => {
    const masterSlots = filteredSlots.filter((slot) => slot.master.id === master.id);
    return masterSlots.length > 0; // Показываем только тех мастеров, у которых есть слоты
  });
console.log('slots', slots)
  return (
    <div style={{ padding: "20px" }}>
      <h1>Расписание слотов</h1>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Выберите дату:{" "}
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </label>
        <label style={{ marginLeft: "20px" }}>
          Выберите мастера:{" "}
          <select
            value={masterId}
            onChange={(e) => setMasterId(e.target.value)}
          >
            <option value="">Все мастера</option>
            {masters.map((master) => (
              <option key={master.id} value={master.id}>
                {master.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Отображаем только мастеров с слотами */}
      {filteredMasters.length > 0 ? (
        filteredMasters.map((master) => {
          const masterSlots = filteredSlots.filter((slot) => slot.master.id === master.id);

          return (
            <div key={master.id} style={{ marginBottom: "40px" }}>
              <h2>{master.name}</h2>
              <table border="1" style={{ width: "100%", textAlign: "center" }}>
                <thead>
                  <tr>
                    {/* <th>ID</th> */}
                    <th>Начало</th>
                    <th>Конец</th>
                    <th>Клиент</th>
                    <th>Услуга</th>
                    <th>Цена</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {masterSlots.length > 0 ? (
                    masterSlots.map((slot,index) => (
                      <tr key={slot.id}>
                        {/* <td>{index+ 1}</td> */}
                        <td>{slot.startTime}</td>
                        <td>{slot.endTime}</td>
                        <td>{slot.clients && slot.clients.name ? slot.clients.name : "Нет данных"}</td>
                        <td>{slot.service && slot.service.name ? slot.service.name : "Нет данных"}</td>
                        <td>{slot.price ? slot.price : "Нет данных"}</td>
                        <td>{slot.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Слоты не найдены</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })
      ) : (
        <div>Мастера с доступными слотами не найдены</div>
      )}
    </div>
  );
};

export default SlotList;
