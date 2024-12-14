import React, { useState, useEffect } from "react";
import {
  fetchServices,
  fetchMastersForService,
  fetchSlotsForMaster,
} from "../../services/apiService";
import ServiceList from "../Bron/ServiceList";
import MasterList from "../Bron/MasterList";
import SlotList from "../Bron/SlotList";
import { Button } from "react-bootstrap";
import BookingModal from "../Bron/BookingModal"; // Импортируем ваш компонент BookingModal
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const ServiceClientForm = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [masters, setMasters] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для открытия/закрытия модалки
  const [selectedDate, setSelectedDate] = useState(null); // Состояние для выбранной даты
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    selectedSlot: null,
    duration: 0, // Добавляем поле для длительности
    estimatedTime: null, // Добавляем поле для estimatedTime
    slotId: null, // Добавляем поле для ID слота
  });

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
    setLoading(true);
    fetchMastersForService(service.id)
      .then(setMasters)
      .finally(() => setLoading(false));
  };

  const handleMasterSelect = (master) => {
    setSelectedMaster({
      id: master.master.id,
      name: master.master.name,
      estimatedTime: master.estimatedTime, // Сохраняем время выполнения
    });
    // Обновляем список слотов, фильтруем по выбранной дате
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
  const parseDuration = (duration) => {
    const regex = /^PT(\d+H)?(\d+M)?$/;
    const matches = duration.match(regex);

    if (!matches) return 0;

    const hours = matches[1] ? parseInt(matches[1].replace("H", ""), 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2].replace("M", ""), 10) : 0;

    return (hours * 60 + minutes) * 60 * 1000; // Возвращаем в миллисекундах
  };


  const handleSlotSelect = (slot) => {
    console.log("Raw slot startTime:", slot.startTime);
    console.log("Raw slot endTime:", slot.endTime);
  
    // Разделяем время на часы и минуты, если это строка в формате HH:mm
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);
  
    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
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
    console.log('requiredTime', requiredTime);
  
    let availableSlots = [];
    let totalBookedTime = 0;
    let currentCalculatedEndTimeInMinutes = startTimeInMinutes + requiredTime / 60000; // Расчетное время окончания
  
    let startIndex = slots.findIndex(s => s.id === slot.id); // Индекс выбранного слота
  
    // Итерируем по слотам, начиная с выбранного
    for (let i = startIndex; i < slots.length; i++) {
      const currentSlot = slots[i];
      const currentSlotStartInMinutes = timeToMinutes(...currentSlot.startTime.split(':').map(Number));
      const currentSlotEndInMinutes = timeToMinutes(...currentSlot.endTime.split(':').map(Number));
  
      console.log(`Checking slot: ${currentSlot.id}, Start Time: ${currentSlot.startTime}, End Time: ${currentSlot.endTime}`);
  
      // Проверяем, если слот пересекается с расчетным временем услуги
      if (currentSlotStartInMinutes < currentCalculatedEndTimeInMinutes && currentSlotEndInMinutes > startTimeInMinutes) {
        console.log(`Found available slot with ID: ${currentSlot.id}, Start Time: ${currentSlot.startTime}, End Time: ${currentSlot.endTime}`);
        availableSlots.push(currentSlot);
  
        totalBookedTime += (currentSlotEndInMinutes - currentSlotStartInMinutes) * 60 * 1000; // Время на основе длительности слота
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Логика отправки формы, например, через API
    console.log("Форма отправлена", formData);
    setIsModalOpen(false); // Закрываем модальное окно после отправки
  };


const filterAvailableSlots = (slots, serviceDurationInMinutes) => {
    let availableSlots = [];
    let totalDuration = 0;
    let lastEndTime = 0; // Храним время окончания последнего выбранного слота
  
    for (let i = 0; i < slots.length; i++) {
      const currentSlot = slots[i];
  
      // Проверяем, что слот свободен
      if (currentSlot.status !== "свободно") continue;
  
      const [startHour, startMinute] = currentSlot.startTime.split(':').map(Number);
      const [endHour, endMinute] = currentSlot.endTime.split(':').map(Number);
  
      // Преобразуем время в минуты
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      const slotDuration = endTimeInMinutes - startTimeInMinutes;
  
      // Если первый слот подходит, начинаем собирать
      if (totalDuration === 0) {
        availableSlots.push(currentSlot);
        lastEndTime = endTimeInMinutes;
        totalDuration += slotDuration;
        continue; // Переходим к следующему слоту
      }
  
      // Если между текущим и предыдущим слотом есть разрыв, проверяем на достаточность времени
      if (startTimeInMinutes > lastEndTime) {
        // Если время достаточное для услуги, выходим
        if (totalDuration >= serviceDurationInMinutes) {
          break;
        } else {
          // Если разрыв слишком большой, сбрасываем накопленные слоты
          availableSlots = [];
          totalDuration = 0;
        }
      }
  
      // Если текущий слот стыкуется с последним, добавляем его
      if (startTimeInMinutes === lastEndTime) {
        availableSlots.push(currentSlot);
        totalDuration += slotDuration;
        lastEndTime = endTimeInMinutes;
      }
  
      // Проверяем, если общая длительность достаточно для услуги
      if (totalDuration >= serviceDurationInMinutes) {
        break;
      }
    }
  
    // Проверяем, если мы накопили достаточно времени для услуги
    return totalDuration >= serviceDurationInMinutes ? availableSlots : [];
  };
  
  return (
    <div>
      <h3>Выберите дату</h3>
      <div style={{ display: 'flex', gap:'10px' }}>
         <Button onClick={handleBack}>Назад</Button>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={new Date()}
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
    </div>
  );
};

export default ServiceClientForm;
