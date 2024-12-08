import React from "react";
import { Card, Form } from "react-bootstrap";
import { parseTime } from "../../utils/timeUtils";
const ServiceList = ({ services, searchQuery, setSearchQuery, onSelect }) => {
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
        {services.map((service) => (
          <Card
            key={service.id}
            className="m-2"
            onClick={() => onSelect(service)}
          >
            <Card.Body>
              <Card.Title>{service.name}</Card.Title>
              <Card.Text>
                <strong>Базовая цена:</strong> {service.basicPrice} <br />
                <strong>Базовое время:</strong> {parseTime(service.basicTime)}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ServiceList;
