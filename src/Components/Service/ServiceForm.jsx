import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { parseTime } from '../../utils/timeUtils';
const ServiceForm = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
        name: '',
        basicPrice: '',
        hours: 0,
        minutes: 0,

    });
    const [showModal, setShowModal] = useState(false);
    const [editService, setEditService] = useState(null);

    // Загрузка списка сервисов
    useEffect(() => {
        fetch('http://localhost:8081/services')
            .then((response) => response.json())
            .then((data) => setServices(data))
            .catch((error) => console.error('Error fetching services:', error));
    }, []);

    // Добавление нового сервиса
    const handleAddService = () => {
        const timeString = `PT${newService.hours}H${newService.minutes}M`; // Форматируем время в строку
        const serviceData = { ...newService, basicTime: timeString };

        fetch('http://localhost:8081/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        })
            .then((response) => response.json())
            .then((data) => {
                setServices([...services, data]);
                setNewService({ name: '', basicPrice: '', hours: '', minutes: '' });
            })
            .catch((error) => console.error('Error adding service:', error));
    };

    // Открытие модального окна для редактирования
    const handleEditService = (service) => {
        // const [hours, minutes] = service.basicTime.replace('PT', '').split('H');
        const time = service.basicTime.replace('PT', '').split('H');
        const hours = parseInt(time, 10) || 0;
        const minutes = time[1] ? time[1].replace('M', '') : 0;

        setEditService({
            ...service,
            hours: hours,
            minutes: minutes,
        });
        setShowModal(true);
    };

 

    const handleSaveService = () => {
        const timeString = `PT${editService.hours}H${editService.minutes}M`; // Используем данные из editService
    
        const updatedService = { ...editService, basicTime: timeString };
    
        fetch(`http://localhost:8081/services/${updatedService.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedService),
        })
            .then((response) => response.json())
            .then((data) => {
                const updatedServices = services.map((service) =>
                    service.id === data.id ? data : service
                );
                setServices(updatedServices);
                setShowModal(false);
                setEditService(null);
            })
            .catch((error) => console.error('Error saving service:', error));
    };
    
    // Удаление сервиса
    const handleDeleteService = (id) => {
        fetch(`http://localhost:8081/services/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setServices(services.filter((service) => service.id !== id));
            })
            .catch((error) => console.error('Error deleting service:', error));
    };

    // Обработчик изменения полей для редактирования
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditService({ ...editService, [name]: value });
    };

    // Обработчик для добавления нового сервиса
    const handleNewServiceChange = (e) => {
        const { name, value } = e.target;
        setNewService({ ...newService, [name]: value });
    };

    return (
        <div>
            <h2>Услуги</h2>

            <Form>
                <Form.Group>
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={newService.name}
                        onChange={handleNewServiceChange}
                        placeholder="Введите название услуги"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Цена</Form.Label>
                    <Form.Control
                        type="number"
                        name="basicPrice"
                        value={newService.basicPrice}
                        onChange={handleNewServiceChange}
                        placeholder="Введите цену"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Время</Form.Label>
                    <div className="d-flex">
                        <Form.Control
                            type="number"
                            name="hours"
                            value={newService.hours}
                            onChange={handleNewServiceChange}
                            placeholder="Часы"
                            className="mr-2"
                        />
                        <Form.Control
                            type="number"
                            name="minutes"
                            value={newService.minutes}
                            onChange={handleNewServiceChange}
                            placeholder="Минуты"
                        />
                    </div>
                </Form.Group>
                <br />
                <Button onClick={handleAddService}>Добавить услугу</Button>
            </Form>
            <br />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Название</th>
                        <th>Базовая цена</th>
                        <th>Базовое время</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service, index) => (
                        <tr key={service.id}>
                            <td>{index+1}</td>
                            <td>{service.name}</td>
                            <td>{service.basicPrice}</td>
                            <td>{service.basicTime ? parseTime(service.basicTime) : '—'}</td>

                            <td>
                                <Button variant="warning"  onClick={() => handleEditService(service)}>Редактировать</Button>
                                <Button variant="danger" onClick={() => handleDeleteService(service.id)}>
                                    Удалить
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать услугу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editService?.name || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Цена</Form.Label>
                            <Form.Control
                                type="number"
                                name="basicPrice"
                                value={editService?.basicPrice || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Время</Form.Label>
                            <div className="d-flex">
                                <Form.Control
                                    type="number"
                                    name="hours"
                                    value={editService?.hours || ''}
                                    onChange={handleChange}
                                    placeholder="Часы"
                                    className="mr-2"
                                />
                                <Form.Control
                                    type="number"
                                    name="minutes"
                                    value={editService?.minutes || ''}
                                    onChange={handleChange}
                                    placeholder="Минуты"
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={handleSaveService}>
                        Сохранить изменения
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ServiceForm;
