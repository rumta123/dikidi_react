import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { parseTime } from "../../utils/timeUtils";
const AddMasterQualificationServicesTable = ({ onSubmit }) => {
  const [masters, setMasters] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [qualificationDetails, setQualificationDetails] = useState({
    price: "",
    time: "",
  });
  const [serviceDetails, setServiceDetails] = useState({
    basicPrice: "",
    basicTime: "",
  });

  // Загружаем данные мастеров и услуг при монтировании компонента
  useEffect(() => {
    fetchAllMasters();
    fetchAllServices();
  }, []);

  const fetchAllMasters = async () => {
    try {
      const response = await fetch("http://localhost:8081/master-qualifications");
      const data = await response.json();
      const uniqueMasters = data.filter(
        (value, index, self) =>
          index === self.findIndex((m) => m.master.id === value.master.id)
      );
      setMasters(uniqueMasters);
    } catch (error) {
      console.error("Ошибка при загрузке мастеров:", error);
    }
  };

  const fetchAllServices = async () => {
    try {
      const response = await fetch("http://localhost:8081/services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Ошибка при загрузке услуг:", error);
    }
  };

  const handleMasterChange = (e) => {
    const masterId = e.target.value;
    setSelectedMaster(masterId);
    const selectedMasterDetails = masters.find((master) => master.id === parseInt(masterId));
    if (selectedMasterDetails && selectedMasterDetails.qualification) {
      const { price, time } = selectedMasterDetails.qualification;
      setQualificationDetails({ price, time });
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedService(serviceId);
    const selectedServiceDetails = services.find((service) => service.id === parseInt(serviceId));
    if (selectedServiceDetails) {
      const { basicPrice, basicTime } = selectedServiceDetails;
      setServiceDetails({ basicPrice, basicTime });
    }
  };

  const handleAddService = async () => {
    if (!selectedMaster || !selectedService) {
      alert("Пожалуйста, выберите мастера и услугу.");
      return;
    }

    const data = {
      masterQualification: {
        id: selectedMaster,
        qualification: {
          price: qualificationDetails.price,
          time: qualificationDetails.time,
        },
      },
      service: {
        id: selectedService,
        basicPrice: serviceDetails.basicPrice,
        basicTime: serviceDetails.basicTime,
      },
    };

    try {
      const response = await fetch("http://localhost:8081/master-qualification-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Сервис добавлен успешно!");
        setSelectedMaster("");
        setSelectedService("");
        setQualificationDetails({ price: "", time: "" });
        setServiceDetails({ basicPrice: "", basicTime: "" });
        if (onSubmit) {
          onSubmit(data); // Передача данных наверх
        }
      } else {
        console.error("Ошибка при добавлении сервиса");
      }
    } catch (error) {
      console.error("Ошибка при добавлении сервиса:", error);
    }
  };

  return (
    <Container>
      <h1 className="my-4">Добавить сервис</h1>
      <Form onSubmit={handleAddService} >
        <Row>
          <Col md={6}>
            <Form.Group controlId="masterSelect">
              <Form.Label>Выберите мастера</Form.Label>
              <Form.Select value={selectedMaster} onChange={handleMasterChange}>
                <option value="">Выберите мастера</option>
                {masters.map((master) => (
                  <option key={master.id} value={master.id}>
                    {master.master.name} ({master.qualification?.name || "Без квалификации"})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {selectedMaster && qualificationDetails.price && (
              <Alert variant="info" className="mt-3">
                <strong>Квалификация</strong>
                <div>Цена: {qualificationDetails.price}₽</div>
                <div>Время: {qualificationDetails.time} часов</div>
              </Alert>
            )}
          </Col>

          <Col md={6}>
            <Form.Group controlId="serviceSelect">
              <Form.Label>Выберите услугу</Form.Label>
              <Form.Select value={selectedService} onChange={handleServiceChange}>
                <option value="">Выберите услугу</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {selectedService && serviceDetails.basicPrice && (
              <Alert variant="info" className="mt-3">
                <strong>Услуга</strong>
                <div>Цена: {serviceDetails.basicPrice}₽</div>
                <div>Время: {parseTime(serviceDetails.basicTime)}</div>
              </Alert>
            )}
          </Col>
        </Row>
        <Button className="mt-4" variant="primary" onClick={handleAddService}>
          Добавить сервис
        </Button>
      </Form>
    </Container>
  );
};

export default AddMasterQualificationServicesTable;
