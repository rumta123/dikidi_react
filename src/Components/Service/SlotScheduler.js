import React, { useState } from 'react';

// Функция для преобразования времени в минуты
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Значение для продолжительности слота
const vremya = 60;

// Функция для проверки слотов
const checkSlots = (slots) => {
  const availableSlots = [];

  // Проходим по каждому слоту
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    let currentStart = slot.start;
    let currentEnd = slot.end;
    let currentDuration = timeToMinutes(currentEnd) - timeToMinutes(currentStart);
    let action = currentDuration >= vremya ? 'можно' : 'Нельзя записаться';

    // Пробегаем по остальным слотам и проверяем их с текущим
    for (let j = i + 1; j < slots.length; j++) {
      const nextSlot = slots[j];

      // Проверяем, если разрыв между слотами больше 60 минут
      const nextStart = timeToMinutes(nextSlot.start);
      const previousEnd = timeToMinutes(currentEnd);

      if (nextStart - previousEnd >= vremya) {
        break; // Если разрыв больше 60 минут, прекращаем объединение
      }

      // Объединяем слоты
      currentEnd = nextSlot.end;
      currentDuration = timeToMinutes(currentEnd) - timeToMinutes(currentStart);

      // Если длительность больше 60, можно записаться
      action = currentDuration >= vremya ? 'можно' : 'Нельзя записаться';
    }

    availableSlots.push({
      id: i + 1, // Добавляем уникальный id для каждого слота
      start: currentStart,
      end: currentEnd,
      duration: `${currentDuration} мин`,
      action: action,
      booked: false, // Флаг для отслеживания состояния записи
    });
  }

  return availableSlots;
};

// Главный компонент
const SlotScheduler = () => {
  const [slots, setSlots] = useState([
    { start: '08:00:00', end: '08:30:00' },
    { start: '08:30:00', end: '09:00:00' },
    { start: '09:00:00', end: '09:30:00' },
    { start: '09:30:00', end: '10:00:00' },
    { start: '12:30:00', end: '13:00:00' },
  ]);

  const [result, setResult] = useState(checkSlots(slots));

  // Модальное окно
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');

  // Для хранения информации о забронированных слотах
  const [bookedSlots, setBookedSlots] = useState([]);

  // Функция для записи на слот
  const handleBookSlot = (index) => {
    const updatedSlots = [...result]; // Делаем копию текущих слотов
    let currentSlot = updatedSlots[index];
    let combinedDuration = timeToMinutes(currentSlot.end) - timeToMinutes(currentSlot.start);
  
    if (currentSlot.action === 'можно' && !currentSlot.booked) {
      let slotsToBook = [currentSlot];
      let bookedIds = [currentSlot.id]; // Массив для хранения id слотов
  
      // Проверяем последующие слоты
      for (let i = index + 1; i < updatedSlots.length; i++) {
        const nextSlot = updatedSlots[i];
        const nextStart = timeToMinutes(nextSlot.start);
        const currentEnd = timeToMinutes(currentSlot.end);
  
        // Если между слотами разрыв больше 60 минут, останавливаем цикл
        if (nextStart - currentEnd >= vremya) break;
  
        // Объединяем время
        combinedDuration += timeToMinutes(nextSlot.end) - timeToMinutes(nextSlot.start);
        currentSlot.end = nextSlot.end;
        slotsToBook.push(nextSlot); // Добавляем этот слот в список
        bookedIds.push(nextSlot.id); // Добавляем id слотов
  
        // Если суммарная длительность больше или равна 60 минутам, прекращаем
        if (combinedDuration >= vremya) {
          break;
        }
      }
  
      // Если суммарная длительность больше или равна 60 минутам, открываем модальное окно
      if (combinedDuration >= vremya) {
        setBookedSlots(slotsToBook); // Сохраняем слоты для бронирования
        setIsModalOpen(true); // Открываем модальное окно
      } else {
        alert('Недостаточно времени для записи.');
      }
    }
  };
  
  const handleConfirmBooking = async () => {
    try {
      const updatedSlots = [...result];
  
      // Помечаем выбранные слоты как забронированные
      bookedSlots.forEach(slot => {
        const slotIndex = updatedSlots.findIndex(s => s.id === slot.id);
        if (slotIndex !== -1) {
          updatedSlots[slotIndex].booked = true;
        }
      });
  
      // Отправляем запросы на сервер
      await Promise.all(
        bookedSlots.map(slot =>
          fetch(`http://localhost:8081/slots/book/${slot.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName }),
          })
        )
      );
  
      // Обновляем состояние после успешной записи
      setResult(updatedSlots);
      alert(
        `Запись успешно сохранена на слоты: ${bookedSlots
          .map(slot => slot.start)
          .join(', ')}`
      );
      setIsModalOpen(false); // Закрываем модалку
      setUserName(''); // Очищаем имя
      setBookedSlots([]); // Сбрасываем временные данные
    } catch (error) {
      console.error('Ошибка при записи:', error);
      alert('Ошибка при записи. Попробуйте снова.');
    }
  };

  return (
    <div>
      <h1>Время записи на сеансы</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Время</th>
            <th>Длительность</th>
            <th>Действие</th>
            <th>Записаться</th>
          </tr>
        </thead>
        <tbody>
          {result.map((slot, index) => (
            <tr key={index}>
              <td>{`${slot.start} - ${slot.end}`}</td>
              <td>{slot.duration}</td>
              <td>{slot.action}</td>
              <td>
                {/* Добавляем кнопку записи, если слот можно забронировать */}
                {slot.action === 'можно' && !slot.booked ? (
                  <button onClick={() => handleBookSlot(index)}>Записаться</button>
                ) : (
                  <span>Занято</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модальное окно */}
      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2>Введите имя для записи</h2>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ваше имя"
            />
            <div>
              <button onClick={handleConfirmBooking}>Подтвердить запись</button>
              <button onClick={() => setIsModalOpen(false)}>Отменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Стили для модального окна
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
    textAlign: 'center',
  },
};

export default SlotScheduler;
