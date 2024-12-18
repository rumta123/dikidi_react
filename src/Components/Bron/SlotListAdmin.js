import React from "react";
import { Button, Table } from "react-bootstrap";

const SlotListAdmin = ({ slots, onSlotCancel }) => {
  return (
    
    <Table>
      <thead>
        <tr>
          <th>№</th>
          <th>Начало</th>
          <th>Конец</th>  
          <th>Клиент</th>
          <th>Статус</th>
        
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        {slots.map((slot, index) => (
          <tr key={slot.id}>
            <td>{index + 1}</td>
            <td>{slot.startTime}</td>
            <td>{slot.endTime}</td>
            <td>{slot.clients.name}</td>
            <td>{slot.status}</td>
            <td>
              <Button
                variant="danger"
                onClick={() => onSlotCancel(slot.id, slot.clients.id)}
              >
                Отменить
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  
  );
};

export default SlotListAdmin;
