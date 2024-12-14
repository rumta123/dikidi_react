import React from "react";
import { Card, Spinner } from "react-bootstrap";
import { parseTime } from "../../utils/timeUtils";

const MasterList = ({ masters, selectedMaster, onSelect, loading }) => {
  console.log(masters); // Логирование masters для проверки структуры данных
  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap">
      {masters.map((master) => {
        // Проверяем, выбран ли мастер
        const isActive = selectedMaster?.id === master.master?.id;
        
        return (
          <Card
            key={master.master?.id}
            className={`m-2 ${isActive ? 'border-success' : ''}`}  // Добавляем стиль для активного мастера
            onClick={() =>
              onSelect({ ...master, estimatedTime: master.estimatedTime })
            }
            style={{
              cursor: "pointer",
              boxShadow: isActive ? "0 0 10px rgba(0, 128, 0, 0.6)" : "none", // Подсвечиваем активного мастера
              border: isActive ? "2px solid green" : "none", // Зелёная рамка для активного мастера
            }}
          >
            <Card.Body>
              <Card.Title>{master.master?.name}</Card.Title>
              <Card.Text>
                <strong>Квалификация:</strong> {master.qualification?.name}
              </Card.Text>
              <Card.Text>
                <strong>Время выполнения:</strong>{" "}
                {parseTime(master.estimatedTime)}
              </Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default MasterList;
