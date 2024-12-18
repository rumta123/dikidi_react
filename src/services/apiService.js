// apiService.js
const BASE_URL = "http://localhost:8081";

export const fetchServices = async () => {
  const response = await fetch(`${BASE_URL}/services`);
  if (!response.ok) throw new Error("Ошибка загрузки услуг");
  return response.json();
};

export const fetchMastersForService = async (serviceId) => {
  const response = await fetch(
    `${BASE_URL}/master-qualification-services/${serviceId}/masters`
  );
  console.log('response', response);

  // Проверяем статус ответа
  if (response.status === 204) {
    console.log("No content returned for serviceId:", serviceId);
    return []; // Возвращаем пустой массив, если контента нет
  }

  if (!response.ok) {
    throw new Error("Ошибка загрузки мастеров");
  }

  // Возвращаем JSON только если статус не 204
  return response.json();
};

export const fetchSlotsForMaster = async (masterId, date) => {
  try {
    // Преобразуем строку даты в объект Date
    const parsedDate = new Date(date);
    console.log('parsedDate', parsedDate);

    // Устанавливаем время в начало дня в UTC
    parsedDate.setDate(parsedDate.getDate() + 1);

    // Получаем строку в формате ISO и разбиваем на дату
    const formattedDate = parsedDate.toISOString().split("T")[0];
    console.log('formattedDate', formattedDate);

    const response = await fetch(
      `${BASE_URL}/workhours/date/${formattedDate}/slots/master/${masterId}`
    );
    console.log('fetchSlotsForMaster response', response);

    if (!response.ok) throw new Error("Ошибка загрузки слотов");

    return await response.json();
  } catch (error) {
    console.error("fetchSlotsForMaster error:", error);
    throw error; // Пробрасываем ошибку дальше для обработки на уровне вызова
  }
};





export const parseDuration = (duration) => {
  const regex = /^PT(\d+H)?(\d+M)?$/;
  const matches = duration.match(regex);

  if (!matches) return 0;

  const hours = matches[1] ? parseInt(matches[1].replace("H", ""), 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2].replace("M", ""), 10) : 0;

  return (hours * 60 + minutes) * 60 * 1000; // Возвращаем в миллисекундах
};
