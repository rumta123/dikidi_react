import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from 'react';

const ClientForm = () => {
  const [clients, setClients] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [editClientId, setEditClientId] = useState(null);
  const [editedClient, setEditedClient] = useState({
    name: '',
    phoneNumber: '',
    email: '',
  });
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' или 'desc'

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await fetch('http://localhost:8081/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Ошибка при загрузке клиентов:', error);
      alert('Произошла ошибка при загрузке данных.');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditStart = (client) => {
    setEditClientId(client.id);
    setEditedClient({
      name: client.name,
      phoneNumber: client.phoneNumber,
      email: client.email,
    });
  };

  const handleEditSubmit = async (clientId) => {
    const updatedClient = {
      name: editedClient.name,
      phoneNumber: editedClient.phoneNumber,
      email: editedClient.email,
    };

    try {
      const response = await fetch(`http://localhost:8081/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });

      if (response.status === 200) {
        // alert('Клиент успешно обновлен!');
        loadClients();
        setEditClientId(null);
      } else {
        alert('Ошибка при обновлении клиента.');
      }
    } catch (error) {
      console.error('Ошибка при редактировании клиента:', error);
      alert('Произошла ошибка при редактировании.');
    }
  };

  const handleDelete = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:8081/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        alert('Клиент успешно удален!');
        loadClients();
      } else {
        alert('Ошибка при удалении клиента.');
      }
    } catch (error) {
      console.error('Ошибка при удалении клиента:', error);
      alert('Произошла ошибка при удалении.');
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const sortClients = (clients) => {
    if (!sortField) return clients;
    return [...clients].sort((a, b) => {
      const valueA = (a[sortField] || '').toLowerCase();
      const valueB =(b[sortField] || '').toLowerCase();
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filterClients = () => {
    return clients.filter((client) => {
      return (
        (client.name || '').toLowerCase().includes(searchName.toLowerCase()) &&
        (client.phoneNumber || '').toLowerCase().includes(searchPhone.toLowerCase()) &&
        (client.email || '').toLowerCase().includes(searchEmail.toLowerCase())
      );
    });
  };

  const displayedClients = sortClients(filterClients());

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Список клиентов</h2>

      <Form className="mb-3">
        <div className="row g-3">
          <div className="col-md-4">
            <Form.Control
              type="text"
              placeholder="Поиск по имени"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <Form.Control
              type="text"
              placeholder="Поиск по телефону"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <Form.Control
              type="text"
              placeholder="Поиск по email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
        </div>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Имя {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('phoneNumber')} style={{ cursor: 'pointer' }}>
              Телефон  {sortField === 'phoneNumber' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
              Email  {sortField === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {displayedClients.map((client) => (
            <tr key={client.id}>
              <td>
                {editClientId === client.id ? (
                  <Form.Control
                    type="text"
                    name="name"
                    value={editedClient.name}
                    onChange={handleEditChange}
                  />
                ) : (
                  client.name
                )}
              </td>
              <td>
                {editClientId === client.id ? (
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={editedClient.phoneNumber}
                    onChange={handleEditChange}
                  />
                ) : (
                  client.phoneNumber
                )}
              </td>
              <td>
                {editClientId === client.id ? (
                  <Form.Control
                    type="email"
                    name="email"
                    value={editedClient.email}
                    onChange={handleEditChange}
                  />
                ) : (
                  client.email
                )}
              </td>
              <td>
                {editClientId === client.id ? (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleEditSubmit(client.id)}
                      className="me-2"
                    >
                      Сохранить
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditClientId(null)}
                    >
                      Отмена
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEditStart(client)}
                      className="me-2"
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                    >
                      Удалить
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ClientForm;
