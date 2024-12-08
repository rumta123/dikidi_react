import React, { useState, useEffect } from "react";

const BookingComponent = () => {
  const [masters, setMasters] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  // Fetch masters and services on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mastersResponse = await fetch("http://localhost:8081/masters");
        const mastersData = await mastersResponse.json();
        setMasters(mastersData);

        const servicesResponse = await fetch("http://localhost:8081/services");
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch available slots when master and service are selected
  useEffect(() => {
    if (selectedMaster && selectedService) {
      const fetchSlots = async () => {
        try {
          const response = await fetch(
            `http://localhost:8081/slots?masterId=${selectedMaster}&serviceId=${selectedService}`
          );
          const data = await response.json();
          setSlots(data);
        } catch (error) {
          console.error("Ошибка при загрузке слотов:", error);
        }
      };
      fetchSlots();
    }
  }, [selectedMaster, selectedService]);

  const handleBooking = async () => {
    if (!selectedSlot || !name || !phoneNumber || !email) {
      alert("Заполните все поля!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/appointments/book/${selectedSlot.slotId}/${selectedMaster}/${selectedSlot.qualificationId}/${selectedService}/${selectedSlot.masterQualificationServiceId}?name=${encodeURIComponent(
          name
        )}&phoneNumber=${encodeURIComponent(
          phoneNumber
        )}&email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("Бронирование успешно!");
      } else {
        const errorText = await response.text();
        alert(`Ошибка бронирования: ${errorText}`);
      }
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
      alert("Не удалось выполнить бронирование.");
    }
  };

  return (
    <div>
      <h1>Бронирование</h1>
      <div>
        <label>Выберите мастера:</label>
        <select onChange={(e) => setSelectedMaster(e.target.value)}>
          <option value="">-- Выберите мастера --</option>
          {masters.map((master) => (
            <option key={master.id} value={master.id}>
              {master.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Выберите услугу:</label>
        <select onChange={(e) => setSelectedService(e.target.value)}>
          <option value="">-- Выберите услугу --</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Доступные слоты:</label>
        <select onChange={(e) => setSelectedSlot(JSON.parse(e.target.value))}>
          <option value="">-- Выберите слот --</option>
          {slots.map((slot) => (
            <option
              key={slot.slotId}
              value={JSON.stringify(slot)}
            >{`${slot.date} ${slot.startTime} - ${slot.endTime}`}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Ваше имя:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Ваш номер телефона:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Ваш email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleBooking}>Забронировать</button>
    </div>
  );
};

export default BookingComponent;
