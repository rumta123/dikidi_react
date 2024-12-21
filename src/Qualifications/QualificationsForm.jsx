import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';

const QualificationsForm = () => {
  const [qualifications, setQualifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editQualification, setEditQualification] = useState(null);
  const [newQualification, setNewQualification] = useState({
    name: '',
    price: '',
    time: '',
  });

  useEffect(() => {
    // Fetch request to get qualifications data
    fetch('http://localhost:8081/qualifications')
      .then((response) => response.json())
      .then((data) => setQualifications(data))
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  const handleAddQualification = () => {
    setNewQualification({ name: '', price: '', time: '' });
    setShowModal(true);
    setEditQualification(null); // Указываем, что это добавление, а не редактирование
  };

  const handleEditQualification = (qualification) => {
    setEditQualification(qualification);
    setNewQualification({
      name: qualification.name,
      price: qualification.price,
      time: qualification.time,
    });
    setShowModal(true);
  };

  const handleDeleteQualification = (id) => {
    fetch(`http://localhost:8081/qualifications/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setQualifications(qualifications.filter((q) => q.id !== id));
      })
      .catch((error) => console.error('Error deleting qualification: ', error));
  };

  const handleSubmit = () => {
    const method = editQualification ? 'PUT' : 'POST';
    const url = editQualification
      ? `http://localhost:8081/qualifications/${editQualification.id}`
      : 'http://localhost:8081/qualifications';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQualification),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data qul' , data)
        if (editQualification) {
          setQualifications(
            qualifications.map((q) =>
              q.id === data.id ? { ...q, ...data } : q
            )
          );
        } else {
          setQualifications([...qualifications, data]);
        }
        setShowModal(false);
      })
      .catch((error) => console.error('Error saving qualification: ', error));
  };

  return (
    <div>
      <h2>Список квалификаций</h2>
      <Button variant="primary" onClick={handleAddQualification}>
        Добавить квалификацию
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>№</th>
            <th>Имя</th>
            <th>Коэфициент цены</th>
            <th>Коэфициент времени</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {qualifications.map((qualification) => (
            <tr key={qualification.id}>
              <td>{qualification.id}</td>
              <td>{qualification.name}</td>
              <td>{qualification.price}</td>
              <td>{qualification.time}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEditQualification(qualification)}
                >
                  Редактировать
                </Button>{' '}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteQualification(qualification.id)}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Модальное окно для добавления/редактирования квалификации */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editQualification ? 'Редактировать' : 'Добавить'} квалификацию</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите имя"
                value={newQualification.name}
                onChange={(e) =>
                  setNewQualification({ ...newQualification, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Коэфициент цены</Form.Label>
              <Form.Control
                type="number"
                placeholder="Введите коэфициент цены"
                value={newQualification.price}
                onChange={(e) =>
                  setNewQualification({ ...newQualification, price: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>Коэфициент времени</Form.Label>
              <Form.Control
                type="number"
                placeholder="Коэфициент времени"
                value={newQualification.time}
                onChange={(e) =>
                  setNewQualification({ ...newQualification, time: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editQualification ? 'Сохранить изменения' : 'Добавить'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QualificationsForm;
