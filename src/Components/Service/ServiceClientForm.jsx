import React, { useState, useEffect } from "react";
import { fetchServices, fetchMastersForService, fetchSlotsForMaster } from "../../services/apiService";
import ServiceList from "../Bron/ServiceList";
import MasterList from "../Bron/MasterList";
import SlotList from "../Bron/SlotList";
import { Button } from "react-bootstrap";
import BookingModal from "../Bron/BookingModal"; // Импортируем ваш компонент BookingModal

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
  const [selectedSlot, setSelectedSlot] = useState(null); // Состояние для выбранного слота
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
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

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setLoading(true);
    fetchMastersForService(service.id)
      .then(setMasters)
      .finally(() => setLoading(false));
  };

  const handleMasterSelect = (master) => {
    setSelectedMaster(master.master.id);
    fetchSlotsForMaster(master.master.id, new Date()).then(setSlots);
  };

  const handleBack = () => {
    setSelectedService(null);
    setSelectedMaster(null);
    setSlots([]);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot); // Устанавливаем выбранный слот
    setFormData({
      ...formData,
      selectedSlot: slot,
      estimatedTime: slot.estimatedTime, // Передаем estimatedTime в formData
      slotId: slot.id, // Передаем ID слота в formData
    });
    setIsModalOpen(true); // Открываем модальное окно
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

  return (
    <div>
      {selectedService ? (
        <>
          <Button onClick={handleBack}>Назад</Button>
          <h3>Мастера для услуги: {selectedService.name}</h3>
          <MasterList
            masters={masters}
            selectedMaster={selectedMaster}
            onSelect={handleMasterSelect}
            loading={loading}
          />
          {selectedMaster && (
            <SlotList
              slots={slots}
              onBook={handleSlotSelect} // При клике на слот откроется модальное окно
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
      )}

      {/* Модальное окно для бронирования */}
      <BookingModal
        show={isModalOpen}
        onHide={handleCloseModal}
        formData={formData}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default ServiceClientForm;
