import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
// import { parseTime } from "../../utils/timeUtils";
// import MasterList from "./MasterList";

const BookingModal = ({ show, onHide, formData, handleFormChange, handleFormSubmit }) => {
  // Проверяем, есть ли данные о слоте перед рендером
  // const { selectedSlot } = formData || {};
  // const masterName = selectedSlot?.masterName || 'Не выбран';
  // const startTime = selectedSlot?.startTime ? selectedSlot.startTime.toLocaleString() : 'Не выбрано';
  // const endTime = selectedSlot?.endTime ? selectedSlot.endTime.toLocaleString() : 'Не выбрано';
  // const duration = selectedSlot?.duration || 'Не указано';

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Введите данные для записи</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Выводим информацию о записи */}
        <p>
  {/* <strong>Мастер:</strong> {formData.selectedSlot?.masterName || 'Не выбран'} <br />
  <strong>Дата и время:</strong> {formData.selectedSlot?.startTime || 'Не выбрано'} - {formData.selectedSlot?.endTime || 'Не выбрано'} <br />
  <strong>Длительность:</strong> {formData.duration || 'Не указано'} <br />
  <strong>Время выполнения:</strong> {parseTime(formData.estimatedTime) || 'Не указано'} <br />
  <strong>ID слота:</strong> {formData.slotId || 'Не указан'} <br />
  <p>Выбрана услуга: {formData.serviceId}</p>
<p>Цена: {formData.priceM} руб.</p> */}

</p>


        {/* Форма для ввода данных */}
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите ваше имя"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Телефон</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите ваш телефон"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите ваш email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Записаться
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookingModal;
