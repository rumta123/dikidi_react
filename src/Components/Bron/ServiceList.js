import React from "react";
import { Card, Form } from "react-bootstrap";
import { parseTime } from "../../utils/timeUtils";

const ServiceList = ({ services, searchQuery, setSearchQuery, onSelect, selectedService }) => {
  return (
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
        {services.map((service) => {
          const isActive = selectedService?.id === service.id;
          
          return (
            <Card
              key={service.id}
              className={`m-2 ${isActive ? 'border-success' : ''}`}  // Добавляем стиль для активной услуги
              onClick={() => onSelect(service)}
              style={{
                cursor: "pointer",
                boxShadow: isActive ? "0 0 10px rgba(0, 128, 0, 0.6)" : "none", // Подсвечиваем активную услугу
                border: isActive ? "2px solid green" : "none", // Зеленая рамка для активной услуги
                transition: 'all 0.3s ease', // Плавный переход для эффектов
              }}
              onMouseEnter={(e) => {
                // Добавляем подсветку только при наведении
                if (!isActive) {
                  e.target.style.cursor = "pointer"; // Легкая подсветка при наведении
                }
              }}
              
            >
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text>
                  <strong>Базовая цена:</strong> {service.basicPrice} <br />
                  <strong>Базовое время:</strong> {parseTime(service.basicTime)}
                </Card.Text>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default ServiceList;
