import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Хук авторизации
import { useNavigate } from "react-router-dom";
import AllClients from "./AllClients"; // Компонент списка клиентов
import AllQualifications from "./ALLQualifications";
import ServiceForm from "../Components/Service/ServiceForm";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import WorkHoursList from "../Components/WorkHours/WorkHoursList";
import MastersTable from "../Components/Masters/MastersTable";
import MasterQualificationServicesTable from "../Components/MasterQualificationService/MasterQualificationServicesTable";
// import MastersForm from "../Components/Masters/MastersForm";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Work from "../Components/WorkHours/Work";
import SlotsList from "../Components/Slots/SlotsList";
import MasterQualificationForm from "../Components/MasterQualification/MasterQualification";
import ServiceAdminForm from "../Components/Service/ServiceAdminForm";
import RegistrationForm from "../Components/RegistrationForm";
// import SlotsPage from './SlotsPage'
const Dashboard = () => {
  const { isLoggedIn, logout, userName } = useAuth();
  const [activeComponent, setActiveComponent] = useState("clients");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
 
  const getCookieValue = (cookieName) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return null;
  };
  
  useEffect(() => {
    const role = getCookieValue("role");
    setUserRole(role);
    if (!isLoggedIn) {
      navigate("/"); // Если не авторизован, перенаправляем на страницу входа
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null; // Чтобы предотвратить рендеринг до редиректа
  }
console.log('userRole', userRole )
  return (
    <div>
      {/* Фиксированный заголовок */}
      <div className="header">
        <Container>
          <Row>
            <Col xs={9}>
              <h1>Добро пожаловать, {userName}!</h1>
            </Col>
            <Col xs={3} className="text-end">
              <Button variant="danger" onClick={logout}>
                Выйти
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Основной контент */}
      <div className="main-content">
        <Container fluid>
          <Row>
            {/* Навигация */}
            <Col xs={3} sm={2} className="bg-light p-3">
              <Nav className="flex-column menu">
                <h5>Меню</h5>
                {userRole === "ADMIN" && (
                  <Nav.Link
                    onClick={() => setActiveComponent("worker")}
                    className={
                      activeComponent === "worker" ? "active-link" : ""
                    }
                  >
                    Регистрация менеджера
                  </Nav.Link>
                )}

                <Nav.Link
                  onClick={() => setActiveComponent("appoitment")}
                  className={
                    activeComponent === "appoitment" ? "active-link" : ""
                  }
                >
                  Записи
                </Nav.Link>
                <Nav.Link
                  onClick={() => setActiveComponent("slots")}
                  className={activeComponent === "slots" ? "active-link" : ""}
                >
                  Слоты
                </Nav.Link>

                <Nav.Link
                  onClick={() => setActiveComponent("clients")}
                  className={activeComponent === "clients" ? "active-link" : ""}
                >
                  Список клиентов
                </Nav.Link>

                <Nav.Link
                  onClick={() => setActiveComponent("services")}
                  className={
                    activeComponent === "services" ? "active-link" : ""
                  }
                >
                  Список услуг
                </Nav.Link>

                <Nav.Link
                  onClick={() => setActiveComponent("masters")}
                  className={activeComponent === "masters" ? "active-link" : ""}
                >
                  Мастера
                </Nav.Link>

                <Nav.Link
                  onClick={() => setActiveComponent("workHours")}
                  className={
                    activeComponent === "workHours" ? "active-link" : ""
                  }
                >
                  График работы
                </Nav.Link>

                <Nav.Link
                  onClick={() => setActiveComponent("qualifications")}
                  className={
                    activeComponent === "qualifications" ? "active-link" : ""
                  }
                >
                  Список квалификаций
                </Nav.Link>

                <Nav.Link
                  onClick={() => setActiveComponent("master_q")}
                  className={
                    activeComponent === "master_q" ? "active-link" : ""
                  }
                >
                  Квалификация мастеров
                </Nav.Link>

                <Nav.Link
                  onClick={() => setActiveComponent("services1")}
                  className={
                    activeComponent === "services1" ? "active-link" : ""
                  }
                >
                  Список мастеров и услуг
                </Nav.Link>
              </Nav>
            </Col>

            {/* Контент */}
            <Col xs={9} sm={10} className="p-3">
              {activeComponent === "work" && <Work />}
              {activeComponent === "worker" && userRole === "ADMIN" && (
                <RegistrationForm />
              )}
              {activeComponent === "clients" && <AllClients />}
              {activeComponent === "qualifications" && <AllQualifications />}
              {activeComponent === "services" && <ServiceForm />}
              {activeComponent === "workHours" && <WorkHoursList />}
              {activeComponent === "masters" && <MastersTable />}
              {activeComponent === "services1" && (
                <MasterQualificationServicesTable />
              )}
              {activeComponent === "slots" && <SlotsList />}
              {activeComponent === "master_q" && <MasterQualificationForm />}
              {activeComponent === "appoitment" && <ServiceAdminForm />}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
