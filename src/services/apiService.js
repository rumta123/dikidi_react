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
  if (!response.ok) throw new Error("Ошибка загрузки мастеров");
  return response.json();
};

export const fetchSlotsForMaster = async (masterId, date) => {
  const formattedDate = date.toISOString().split("T")[0];
  const response = await fetch(
    `${BASE_URL}/workhours/date/${formattedDate}/slots/master/${masterId}`
  );
  if (!response.ok) throw new Error("Ошибка загрузки слотов");
  return response.json();
};
