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
        {masters.map((master) => (
          <Card
            key={master.master?.id} // Защита от ошибки при отсутствии данных
            className="m-2"
            onClick={() => onSelect(master)}
          >
            <Card.Body>
              <Card.Title>{master.master?.name}</Card.Title>
              <Card.Text>
                <strong>Квалификация:</strong> {master.qualification?.name}
              </Card.Text>
              <Card.Text>
                <strong>Цена:</strong> {parseTime(master.estimatedTime)}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };

export default MasterList;
