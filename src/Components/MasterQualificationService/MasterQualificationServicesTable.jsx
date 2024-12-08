// MasterQualificationServicesTable.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import AddMasterQualificationServicesTable from "./AddMasterQualificationServicesTable";

const MasterQualificationServicesTable = () => {
  const [services, setServices] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  // Загрузка данных
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:8081/master-qualification-services");
      const data = await response.json();
      console.log(data)
      setServices(data);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/master-qualification-services/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setServices((prev) => prev.filter((service) => service.id !== id));
      } else {
        console.error("Ошибка при удалении записи");
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  // const handleEditClick = (service) => {
  //   setCurrentService(service);
  //   setShowEditModal(true);
  // };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/master-qualification-services/${currentService.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentService),
        }
      );
      if (response.ok) {
        setShowEditModal(false);
        fetchServices();
      } else {
        console.error("Ошибка при обновлении записи");
      }
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
    }
  };

  return (
    <div className="container mt-4">
      <AddMasterQualificationServicesTable onSubmit={fetchServices} />
      <h1>Список мастеров и их услуг</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Мастер</th>
            <th>Квалификация</th>
            <th>Услуга</th>
            <th>КЦена</th>
            <th>Время</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.masterQualification.master.name}</td>
              <td>{service.masterQualification.qualification?.name || "Нет данных"}</td>
              <td>{service.service.name}</td>
              <td>{service.price}₽</td>
              <td>{service.estimatedTime}</td>
              <td>
                <Button variant="danger" className="me-2" onClick={() => handleDelete(service.id)}>
                  Удалить
                </Button>
                {/* <Button variant="primary" onClick={() => handleEditClick(service)}>
                  Редактировать
                </Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать запись</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentService && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Услуга</Form.Label>
                <Form.Control
                  type="text"
                  value={currentService.service.name}
                  onChange={(e) =>
                    setCurrentService((prev) => ({
                      ...prev,
                      service: { ...prev.service, name: e.target.value },
                    }))
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Цена</Form.Label>
                <Form.Control
                  type="number"
                  value={currentService.service.basicPrice}
                  onChange={(e) =>
                    setCurrentService((prev) => ({
                      ...prev,
                      service: { ...prev.service, basicPrice: e.target.value },
                    }))
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Время</Form.Label>
                <Form.Control
                  type="text"
                  value={currentService.service.basicTime}
                  onChange={(e) =>
                    setCurrentService((prev) => ({
                      ...prev,
                      service: { ...prev.service, basicTime: e.target.value },
                    }))
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MasterQualificationServicesTable;
