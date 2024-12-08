import React from "react";
import { Table, Button } from "react-bootstrap";

const SlotList = ({ slots, onBook }) => {
  if (slots.length === 0) {
    return <p>Слотов нет</p>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Начало</th>
          <th>Конец</th>
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
            <td>{slot.status}</td>
            <td>
              {slot.status === "свободно" && (
                <Button onClick={() => onBook(slot)}>Записаться</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SlotList;
