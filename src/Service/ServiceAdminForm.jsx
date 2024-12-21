import React, { useState, useEffect } from "react";
import {
  fetchServices,
  fetchMastersForService,
  fetchSlotsForMaster,
  parseDuration,
} from "../../services/apiService";
import ServiceList from "../Bron/ServiceList";
import MasterList from "../Bron/MasterList";
import SlotList from "../Bron/SlotList";
import { Button } from "react-bootstrap";
import BookingModal from "../Bron/BookingModal"; // Импортируем ваш компонент BookingModal
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SlotListAdmin from "../Bron/SlotListAdmin";
const ServiceAdminForm = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [masters, setMasters] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для открытия/закрытия модалки
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Состояние для выбранной даты
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    selectedSlot: null,
    duration: 0, // Добавляем поле для длительности
    estimatedTime: null, // Добавляем поле для estimatedTime
    slotId: null, // Добавляем поле для ID слота
    serviceId: "", // Название услуги
    priceM: "", // Цена услуги
  });

  useEffect(() => {
    // Фильтруем занятые слоты
    const booked = slots.filter((slot) => slot.status === "забронировано");
    console.log("booked", booked);
    setBookedSlots(booked);
  }, [slots]);

  useEffect(() => {
    fetchServices()
      .then((data) => {
        setServices(data);
        setFilteredServices(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  useEffect(() => {
    if (selectedDate && selectedMaster) {
      fetchSlotsForMaster(selectedMaster.id, selectedDate).then(setSlots);
    }
  }, [selectedDate, selectedMaster]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFormData((prevData) => ({
      ...prevData,
      serviceId: service.id,
      priceM: service.price,

      // servicePrice: service.price, // Сохраняем цену услуги
    }));
    setLoading(true);
    fetchMastersForService(service.id)
      .then(setMasters)
      .finally(() => setLoading(false));
  };
  const handleMasterSelect = (master) => {
    setSelectedMaster({
      id: master.master.id,
      name: master.master.name,
      priceM: master.price,
      estimatedTime: master.estimatedTime, // Сохраняем время выполнения
    });

    setFormData((prevData) => ({
      ...prevData,
      priceM: master.price, // Сохраняем цену мастера в formData
    }));

    // Обновляем список слотов
    if (selectedDate) {
      fetchSlotsForMaster(master.master.id, selectedDate).then(setSlots);
    }
  };

  const handleBack = () => {
    setSelectedService(null);
    setSelectedMaster(null);
    setSlots([]);
  };

  // Функция для парсинга строки вида PT3H10M и получения времени в миллисекундах
  const handleCancelBooking = async (slotId, clientId) => {
    try {
      // Отправляем запрос на сервер
      const response = await fetch(
        `http://localhost:8081/slots/cancel/${slotId}/${clientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка при отмене записи: ${response.statusText}`);
      }

      // Успешное уведомление об отмене
      alert(`Запись успешно отменена для слота ${slotId}`);
      // Обновляем список забронированных слотов
      if (selectedDate && selectedMaster) {
        const updatedSlots = await fetchSlotsForMaster(
          selectedMaster.id,
          selectedDate
        );
        setSlots(updatedSlots); // Обновляем слоты
      }
      setBookedSlots((prevSlots) =>
        prevSlots.filter((slot) => slot.id !== slotId)
      );
    } catch (err) {
      // Обработка ошибок
      alert(`Произошла ошибка при отмене записи: ${err.message}`);

      console.error(err.message);
    }
  };
  const handleSlotSelect = (slot) => {
    console.log("Raw slot startTime:", slot.startTime);
    console.log("Raw slot endTime:", slot.endTime);

    // Разделяем время на часы и минуты, если это строка в формате HH:mm
    const [startHour, startMinute] = slot.startTime.split(":").map(Number);
    const [endHour, endMinute] = slot.endTime.split(":").map(Number);

    if (
      isNaN(startHour) ||
      isNaN(startMinute) ||
      isNaN(endHour) ||
      isNaN(endMinute)
    ) {
      console.error("Invalid time format:", slot.startTime, slot.endTime);
      alert("Некорректное время в одном из слотов.");
      return;
    }

    const timeToMinutes = (hour, minute) => {
      return hour * 60 + minute;
    };

    // Получаем время в минутах для startTime и endTime
    const startTimeInMinutes = timeToMinutes(startHour, startMinute);
    const endTimeInMinutes = timeToMinutes(endHour, endMinute);

    console.log("Start Time in Minutes:", startTimeInMinutes);
    console.log("End Time in Minutes:", endTimeInMinutes);

    const requiredTime = parseDuration(selectedMaster.estimatedTime); // Время выполнения услуги в миллисекундах
    console.log("requiredTime", requiredTime);

    let availableSlots = [];
    let totalBookedTime = 0;
    let currentCalculatedEndTimeInMinutes =
      startTimeInMinutes + requiredTime / 60000; // Расчетное время окончания

    let startIndex = slots.findIndex((s) => s.id === slot.id); // Индекс выбранного слота

    // Итерируем по слотам, начиная с выбранного
    for (let i = startIndex; i < slots.length; i++) {
      const currentSlot = slots[i];
      const currentSlotStartInMinutes = timeToMinutes(
        ...currentSlot.startTime.split(":").map(Number)
      );
      const currentSlotEndInMinutes = timeToMinutes(
        ...currentSlot.endTime.split(":").map(Number)
      );

      console.log(
        `Checking slot: ${currentSlot.id}, Start Time: ${currentSlot.startTime}, End Time: ${currentSlot.endTime}`
      );

      // Проверяем, если слот пересекается с расчетным временем услуги
      if (
        currentSlotStartInMinutes < currentCalculatedEndTimeInMinutes &&
        currentSlotEndInMinutes > startTimeInMinutes
      ) {
        console.log(
          `Found available slot with ID: ${currentSlot.id}, Start Time: ${currentSlot.startTime}, End Time: ${currentSlot.endTime}`
        );
        availableSlots.push(currentSlot);

        totalBookedTime +=
          (currentSlotEndInMinutes - currentSlotStartInMinutes) * 60 * 1000; // Время на основе длительности слота
        currentCalculatedEndTimeInMinutes = currentSlotEndInMinutes + 30; // Переход к следующему времени

        // Если время накапливается до нужного, можно завершить
        if (totalBookedTime >= requiredTime) {
          console.log("Sufficient time booked.");
          break;
        }
      }
    }

    // Обновляем состояние с найденными слотами
    if (availableSlots.length > 0 && totalBookedTime >= requiredTime) {
      console.log("Successfully booked slots:", availableSlots);
      setFormData({
        ...formData,
        selectedSlot: availableSlots,
        estimatedTime: selectedMaster.estimatedTime,
        slotId: availableSlots.map((s) => s.id),
      });
      setIsModalOpen(true); // Открываем модальное окно для подтверждения
    } else {
      alert("Не удалось найти подходящие слоты для выбранной услуги.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Закрываем модальное окно
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Останавливаем стандартное поведение формы

    // Проверяем, что formData содержит выбранные слоты
    if (!formData.selectedSlot || formData.selectedSlot.length === 0) {
      alert("Нет выбранных слотов для записи.");
      return;
    }

    // Убедитесь, что formData содержит все поля:
    console.log("formData", formData);

    // Преобразуем массив слотов в массив ID
    const slotIds = formData.selectedSlot.map((slot) => slot.id);
    const slotIds1 = slotIds.join(",");

    try {
      // Отправляем запрос с данными
      const response = await fetch(
        `http://localhost:8081/slots/book/${slotIds1}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientName: formData.name || "Jane Doe", // Если имя пустое, использовать значение по умолчанию
            clientPhone: formData.phone || "+1234567890", // Если телефон пустой, использовать значение по умолчанию
            clientEmail: formData.email || "jane.doe@example.com", // Если email пустой, использовать значение по умолчанию
            serviceId: formData.serviceId,
            price: formData.priceM,
          }), // Преобразуем объект в JSON-строку
        }
      );

      // Проверка на успешный ответ от сервера
      if (!response.ok) {
        throw new Error(`Ошибка при записи: ${response.statusText}`);
      }

      // Уведомление об успешной записи
      alert(`Запись успешно создана`);
      handleCloseModal(); // Закрываем модальное окно
      // Обновляем таблицу слотов
      if (selectedDate && selectedMaster) {
        const updatedSlots = await fetchSlotsForMaster(
          selectedMaster.id,
          selectedDate
        );
        setSlots(updatedSlots); // Перезагружаем данные
      }
    } catch (err) {
      // Обработка ошибки при отправке запроса
      alert(`Произошла ошибка: ${err.message}`);
      console.log(`Произошла ошибка: ${err.message}`);
    }
  };

  const handleDateChange = (date) => {
    // Преобразуем в UTC и обновляем состояние
    const utcDate = new Date(date); // Просто используйте date, без дополнительного смещения
    setSelectedDate(utcDate);
    console.log("utcDate", utcDate.toISOString());
  };

  const filterAvailableSlots = (slots, serviceDurationInMinutes) => {
    let availableSlots = [];
    let totalDuration = 0;
    let lastEndTime = 0;

    for (let i = 0; i < slots.length; i++) {
      const currentSlot = slots[i];

      // Проверяем, что слот свободен
      if (currentSlot.status !== "свободно") continue;

      const [startHour, startMinute] = currentSlot.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = currentSlot.endTime.split(":").map(Number);

      // Преобразуем время в минуты
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      const slotDuration = endTimeInMinutes - startTimeInMinutes;

      // Добавляем слоты, которые идут подряд, и вычисляем общую длительность
      if (totalDuration === 0 || startTimeInMinutes === lastEndTime) {
        availableSlots.push(currentSlot);
        totalDuration += slotDuration;
        lastEndTime = endTimeInMinutes;
      } else if (startTimeInMinutes >= lastEndTime) {
        // Если между слотами есть разрыв, проверяем на наличие достаточного времени для услуги
        if (totalDuration >= serviceDurationInMinutes) {
          break;
        } else {
          availableSlots = [];
          totalDuration = 0;
          lastEndTime = 0;
        }
      }
    }

    // Проверяем, если мы накопили достаточно времени для услуги
    // return availableSlots; // Возвращаем все найденные свободные слоты
    return totalDuration >= serviceDurationInMinutes ? availableSlots : [];
  };

  return (
    <div>
      <h3>Выберите дату</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        <Button onClick={handleBack}>Назад</Button>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy/MM/dd"
        />
      </div>

      {selectedDate ? (
        selectedService ? (
          <>
            <h3>Мастера для услуги: {selectedService.name}</h3>
            <MasterList
              masters={masters}
              selectedMaster={selectedMaster}
              onSelect={handleMasterSelect}
              loading={loading}
            />
            {selectedMaster && (
              <SlotList
                slots={filterAvailableSlots(
                  slots, // Слоты для фильтрации
                  parseDuration(selectedMaster.estimatedTime) / 60000 // Длительность услуги в минутах
                )}
                onBook={handleSlotSelect}
              />
            )}
          </>
        ) : (
          <ServiceList
            services={filteredServices}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelect={handleServiceSelect}
          />
        )
      ) : (
        <p>Пожалуйста, выберите дату, чтобы продолжить.</p>
      )}

      {/* Модальное окно для бронирования */}
      <BookingModal
        show={isModalOpen}
        onHide={handleCloseModal}
        formData={formData} // Передаём все данные, включая slotId
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
      />
      <h2>Записи</h2>
      <SlotListAdmin
        slots={bookedSlots}
        onSlotCancel={(slotId, clientId) =>
          handleCancelBooking(slotId, clientId)
        }
      />
    </div>
  );
};

export default ServiceAdminForm;
