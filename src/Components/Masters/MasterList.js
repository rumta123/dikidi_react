import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Для получения параметров из URL
import { Card } from 'react-bootstrap';

const MasterList = () => {
    const { serviceId } = useParams(); // Получаем ID услуги из URL
    const [masters, setMasters] = useState([]);

    useEffect(() => {
        // Делаем запрос к API для получения мастеров по ID услуги
        fetch(`http://localhost:8081/master-qualification-services/${serviceId}/masters`)
            .then((response) => response.json())
            .then((data) => setMasters(data))
            .catch((error) => console.error('Error fetching masters:', error));
    }, [serviceId]); // Перезагружаем данные при изменении serviceId

    return (
        <div>
            <h2>Мастера для услуги ID {serviceId}</h2>
            <div className="d-flex flex-wrap">
                {masters.length > 0 ? (
                    masters.map((master, index) => (
                        <Card key={index} className="m-2" style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>{master.master.name}</Card.Title>
                                <Card.Text>
                                    <strong>Цена:</strong> {master.price} <br />
                                    <strong>Время:</strong> {master.estimatedTime} <br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>Мастера не найдены.</p>
                )}
            </div>
        </div>
    );
};

export default MasterList;
