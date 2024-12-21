import React from "react";
import ServiceClientForm from "../Service/ServiceClientForm";
// import MastersTable from "../Masters/MastersTable";
import { Link, Routes, Route } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex !important;
  column-gap: 50px !important;
`;

const BookingForm = () => {
  return (
    <Container style={{ paddingTop: "20px" }}>
      <h1 className="text-center mb-4">Форма бронирования</h1>

      {/* Обертка для ссылок на услуги и мастеров */}
      <Row className="justify-content-center mb-4">
        <Col md="6">
          <Card>
            <Card.Body>
              <h5 className="card-title">Выберите опцию</h5>
              <FlexContainer>
                {/* Кнопки для навигации */}
                <Link to="/services">
                  <Button variant="primary" size="lg" className="mb-3">
                    Перейти к списку услуг
                  </Button>
                </Link>
                {/* <Link to="/masters">
                  <Button variant="secondary" size="lg">
                    Перейти к списку мастеров
                  </Button>
                </Link> */}
              </FlexContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Маршруты */}
      <Routes>
        <Route path="/services" element={<ServiceClientForm />} />
        {/* <Route path="/masters" element={<MastersTable />} /> */}
      </Routes>
    </Container>
  );
};

export default BookingForm;
