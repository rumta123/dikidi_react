import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';

const MasterQualification = () => {
    const [masterQualifications, setMasterQualifications] = useState([]);
    const [masters, setMasters] = useState([]); // State to store masters
    const [qualifications, setQualifications] = useState([]); // State to store qualifications
    const [master, setMaster] = useState('');
    const [qualification, setQualification] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchMasterQualifications();
        fetchMasters();
        fetchQualifications();
    }, []);

    const fetchMasterQualifications = async () => {
        try {
            const response = await fetch('http://localhost:8081/master-qualifications');
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            setMasterQualifications(data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    const fetchMasters = async () => {
        try {
            const response = await fetch('http://localhost:8081/masters'); // Replace with correct endpoint for masters
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            setMasters(data); // Set the masters data
        } catch (error) {
            console.error('Ошибка при загрузке мастеров:', error);
        }
    };

    const fetchQualifications = async () => {
        try {
            const response = await fetch('http://localhost:8081/qualifications'); // Replace with correct endpoint for qualifications
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            setQualifications(data); // Set the qualifications data
        } catch (error) {
            console.error('Ошибка при загрузке квалификаций:', error);
        }
    };

    const handleAddMasterQualification = async () => {
        const newMasterQualification = {
            master: { id: master },
            qualification: { id: qualification },
        };

        try {
            const response = await fetch('http://localhost:8081/master-qualifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMasterQualification),
            });

            if (response.ok) {
                fetchMasterQualifications();
                setMaster('');
                setQualification('');
                setShowModal(false);
            } else {
                console.error('Ошибка при добавлении записи');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const handleDeleteMasterQualification = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/master-qualifications/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchMasterQualifications();
            } else {
                console.error('Ошибка при удалении записи');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Master Qualification</h2>

            {/* Add Master Qualification Form */}
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Добавить новую квалификацию мастера
            </Button>

            {/* Add Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить квалификацию мастера</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="masterSelect">
                            <Form.Label>Мастер</Form.Label>
                            <Form.Control
                                as="select"
                                value={master}
                                onChange={(e) => setMaster(e.target.value)}
                            >
                                <option value="">Выберите мастера</option>
                                {masters.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="qualificationSelect">
                            <Form.Label>Квалификация</Form.Label>
                            <Form.Control
                                as="select"
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                            >
                                <option value="">Выберите квалификацию</option>
                                {qualifications.map((q) => (
                                    <option key={q.id} value={q.id}>
                                        {q.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button variant="success" onClick={handleAddMasterQualification}>
                            Добавить
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* List of Master Qualifications */}
            <h3 className="mt-4">Все записи</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Мастер</th>
                        <th>Квалификация</th>
                        {/* <th>Цена</th>
                        <th>Время</th> */}
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {masterQualifications.map((item) => (
                        <tr key={item.id}>
                            <td>{item.master ? item.master.name : 'Не указан'}</td>
                            <td>{item.qualification ? item.qualification.name : 'Не указана'}</td>
                            {/* <td>{item.qualification ? item.qualification.price : 'Не указана'}₽</td>
                            <td>{item.qualification ? item.qualification.time : 'Не указано'} мин</td> */}
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteMasterQualification(item.id)}
                                >
                                    Удалить
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default MasterQualification;
