import React, { useState, useEffect, useCallback } from "react";
import { Card, Form, Spinner, Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ServiceClientForm = () => {
  const [services, setServices] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [masters, setMasters] = useState([]); // Для хранения мастеров
  const [loading, setLoading] = useState(false); // Для отображения загрузки
  const [selectedService, setSelectedService] = useState(null); // Для хранения выбранной услуги
  const [selectedMaster, setSelectedMaster] = useState(null); // Выбранный мастер
  const [selectedDate, setSelectedDate] = useState(new Date()); // Выбранная дата
  const [slots, setSlots] = useState([]); // Слоты мастера
  const [selectedMasterName, setSelectedMasterName] = useState(null);
  const [selectedMasterTime, setSelectedMasterTime] = useState(null);
  const [serviceDuration, setServiceDuration] = useState({
    hours: 0,
    minutes: 0,
  }); // Длительность услуги

  const [showModal, setShowModal] = useState(false); // Для управления состоянием модального окна
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" }); // Для данных формы

  const cardHoverStyle = {
    backgroundColor: "#f8f9fa",
    borderColor: "#007bff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  };
  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #dee2e6",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
    cursor: "pointer",
  };

  const activeCardStyle = {
    border: "2px solid #007bff",
    backgroundColor: "#e7f3ff",
  };

  const parseTime = (timeString) => {
    if (!timeString) return "—";
    const regex = /PT(\d+H)?(\d+M)?/;
    const match = timeString.match(regex);
    if (!match) return "—";

    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;

    let result = "";
    hours > 0 && (result += `${hours} ч. `);
    minutes > 0 && (result += `${minutes} мин`);
    return result.trim();
  };

  useEffect(() => {
    fetch("http://localhost:8081/services")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
        setFilteredServices(data);
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  useEffect(() => {
    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  const handleMouseEnter = (id) => setHoveredCard(id);
  const handleMouseLeave = () => setHoveredCard(null);

  const handleCardClick = (serviceId, serviceName, duration) => {
    setSelectedService(serviceName); // Обновляем выбранную услугу
    setLoading(true); // Начинаем загрузку
    setServiceDuration(duration); // Сохраняем длительность услуги
    fetch(
      `http://localhost:8081/master-qualification-services/${serviceId}/masters`
    )
      .then((response) => response.json())
      .then((data) => {
        setMasters(data); // Обновляем мастеров
        console.log("data", data);
        setLoading(false); // Останавливаем загрузку
      })
      .catch((error) => {
        console.error("Error fetching masters:", error);
        setLoading(false); // Останавливаем загрузку в случае ошибки
      });
  };

  const fetchSlots = useCallback(() => {
    if (!selectedMaster) return;

    const formattedDate = selectedDate.toISOString().split("T")[0];
    fetch(
      `http://localhost:8081/workhours/date/${formattedDate}/slots/master/${selectedMaster}`
    )
      .then((response) => response.json())

      .then((data) => {
        setSlots(data); // Устанавливаем слоты мастера
        console.log(data)
      })
      .catch((error) => console.error("Ошибка при загрузке слотов:", error));
  }, [selectedDate, selectedMaster]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleBackClick = () => {
    setSelectedService(null); // Сбрасываем выбранную услугу
    setMasters([]); // Очищаем список мастеров
    setSelectedMaster(null); // Сбрасываем мастера
    setSlots([]); // Сбрасываем слоты
  };
  // Функции для управления модальным окном
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Логируем все данные, включая ID слота и время выполнения услуги
    console.log("Данные записи:", {
      ...formData,
      selectedSlot: {
        ...formData.selectedSlot,
        id: formData.selectedSlot.id, // ID слота
        duration: formData.selectedSlot.basicTime, // Длительность услуги
      },
    });

    handleCloseModal(); // Закрыть модальное окно после отправки данных
  };

  const handleSlotBooking = (slotStartTime, masterName, id) => {
    setShowModal(true); // Сначала показываем модальное окно
  
    const startTime = new Date(slotStartTime);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + serviceDuration.hours);
    endTime.setMinutes(startTime.getMinutes() + serviceDuration.minutes);
  
    // Обновляем слоты с новыми статусами
    const updatedSlots = slots.map((slot) => {
      const slotEndTime = new Date(slot.end);
      if (
        (new Date(slotStartTime) >= new Date(slot.start) &&
          new Date(slotStartTime) < slotEndTime) ||
        (endTime > new Date(slot.start) && endTime <= slotEndTime)
      ) {
        return { ...slot, status: "Забронирован" }; // Блокируем пересекающиеся слоты
      }
      return slot;
    });
  
    setSlots(updatedSlots); // Обновляем слоты с новыми статусами
  
    // Сохраняем данные о слоте и мастере в состоянии
    setFormData({
      ...formData,
      selectedSlot: {
        startTime,
        endTime,
        masterName,
        duration: `${serviceDuration.hours} ч. ${serviceDuration.minutes} мин.`, // Добавляем длительность услуги
        id: `${slotStartTime}`,
      },
    });
  };
  

  const handleMasterSelect = (master) => {
    setSelectedMaster(master.master.id); // Сохраняем ID мастера
    setSelectedMasterName(master.master.name); // Сохраняем имя мастера
    setSelectedMasterTime(master.master.name)
  };
  return (
    <div>
      <h2>Услуги</h2>

      {selectedService === null ? (
        <>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Поиск услуг..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex flex-wrap">
            {filteredServices.map((service, index) => (
              <Card
                key={service.id || service.index}
                className="m-2 service-card"
                style={
                  hoveredCard === service.id
                    ? { ...cardStyle, ...cardHoverStyle }
                    : cardStyle
                }
                onMouseEnter={() => handleMouseEnter(service.id)}
                onMouseLeave={handleMouseLeave}
                // onClick={() => handleCardClick(service.id, service.name)}
                onClick={() =>
                  handleCardClick(service.id, service.name, {
                    hours: 3, // Пример длительности услуги
                    minutes: 15,
                    
                  })
                }
              >
                <Card.Body>
                  <Card.Title>{service.name}</Card.Title>
                  <Card.Text>
                    <strong>Базовая цена:</strong> {service.basicPrice} <br />
                    <strong>Базовое время:</strong>{" "}
                    {parseTime(service.basicTime)}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <button onClick={handleBackClick} className="btn btn-secondary mb-3">
            Назад
          </button>

          {loading ? (
            <div className="d-flex justify-content-center mt-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            masters.length > 0 && (
              <div className="mt-4">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <h3>Мастера для услуги: {selectedService} </h3>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                <div className="d-flex flex-wrap">
                  {masters.map((master) => (
                    <Card
                      key={master.id}
                      className="m-2"
                      style={
                        selectedMaster === master.master.id
                          ? { ...cardStyle, ...activeCardStyle }
                          : hoveredCard === master.id
                          ? { ...cardStyle, ...cardHoverStyle }
                          : cardStyle
                      }
                      onMouseEnter={() => handleMouseEnter(master.id)}
                      onMouseLeave={handleMouseLeave}
                      // onClick={() => handleCardClick(service.id, service.name)}
                      onClick={() => handleMasterSelect(master)}
                    >
                      <Card.Body>
                        <Card.Title>{master.master.name}</Card.Title>
                        <Card.Text>
                          <strong>Цена:</strong> {master.price} P <br />
                          <strong>Время:</strong>{" "}
                          {parseTime(master.estimatedTime)} <br />
                          <strong>Квалификация:</strong>{" "}
                          {master.qualification.name || "Не указана"} <br />
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                {selectedMaster && (
                  <div className="mt-4">
                    <h4>Свободное время для мастера:{selectedMasterName} </h4>
                    {slots.length > 0 ? (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Начало</th>
                            <th>Конец</th>
                            <th>Статус</th>
                          </tr>
                        </thead>
                        <tbody>
                          {slots.map((slot, index) => (
                            <tr key={slot.id}>
                              <td>{index + 1}</td>
                              <td>{slot.startTime}</td>
                              <td>{slot.endTime}</td>
                              <td>{slot.status}</td>
                              <td>
                                {slot.status === "свободно" && (
                                  <Button
                                    variant="primary"
                                    onClick={() =>
                                      handleSlotBooking(slot.id, slot.start)
                                    }
                                  >
                                    Записаться
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>Слотов нет</p>
                    )}
                  </div>
                )}

                {/* Модальное окно для записи */}
                <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Введите данные для записи</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* Выводим информацию о записи */}
                    <p>
                      <strong>Мастер:</strong>{" "}
                      {formData.selectedSlot?.masterName}
                    </p>
                    <p>
                      <strong>Дата и время:</strong>{" "}
                      {formData.selectedSlot?.startTime?.toLocaleString()} -{" "}
                      {formData.selectedSlot?.endTime?.toLocaleString()}
                    </p>
                    <p>
                      <strong>Длительность услуги:</strong>{" "}
                      {formData.selectedSlot?.selectedMasterTime}
                    </p>
                    <p>
                      <strong>ID слота:</strong> {formData.selectedSlot?.id}
                    </p>

                    {/* Форма для ввода данных пользователя */}
                    <Form onSubmit={handleFormSubmit}>
                      <Form.Group>
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Телефон</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                        />
                      </Form.Group>
                      <Button type="submit" variant="primary" className="mt-3">
                        Записаться
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default ServiceClientForm;
