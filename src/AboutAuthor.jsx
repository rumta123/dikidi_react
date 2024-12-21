import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AboutAuthor = () => {
    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h1 className="card-title text-center">Об авторе</h1>
                </div>
                <div className="card-body">
                    <p><strong>ФИО:</strong> Холодова Кристина Дмитриевна 
                    </p>
                    <p><strong>Группа/Учебное заведение:</strong> ДПИ22-2, Финансовый университет при  правительстве Российской Федерации 
                    </p>
                    <p><strong>Контактные данные:</strong> Тел: +79132044295; email: holodovakristina2002@gmail.com 
                    </p>
                    <p><strong>Описание программы:</strong> Программа состоит из бэкенда и фронтенда и представляет собой систему записи клиентов в салон красоты.</p>
                    <p><strong>На фронтенде использовалось:</strong> Опыт работы с React, JavaScript, HTML, CSS, Bootstrap</p>
                    <p><strong>На бэкенде использовалось:</strong> Java, Gradle, реализация разделения ролей (User и Admin), Basic Auth для аутентификации, CORS для контроля доступа между доменами,  ORM (Hibernate) для работы с базой данных Postgres</p>
                    <p><strong>Даты начала и завершения проекта:</strong> 1.10.2024 - 21.12.2024</p>
                </div>
            </div>
        </div>
    );
};

export default AboutAuthor;
