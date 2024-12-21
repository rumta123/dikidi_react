import React, { useState, useEffect } from "react";

const CreateSlotForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    status: "Свободно",
    masterId: "",
    masterQualificationServiceId: "",
  });

  const [masters, setMasters] = useState([]);
  const [qualificationServices, setQualificationServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMasters();
    fetchQualificationServices();
    
  }, []);

  const fetchMasters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8081/masters`);
      if (!response.ok) {
        throw new Error(`Ошибка загрузки мастеров: ${response.statusText}`);
      }
      const data = await response.json();
      setMasters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQualificationServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8081/master-qualification-services`);
      if (!response.ok) {
        throw new Error(`Ошибка загрузки квалификаций: ${response.statusText}`);
      }
      const data = await response.json();
      setQualificationServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 
    const formatTime = (time) =>
      time.includes(":") && time.split(":").length === 2
        ? `${time}:00`
        : time;

    const formattedData = {
      master: { id: parseInt(formData.masterId, 10) },
      masterQualificationService: { id: parseInt(formData.masterQualificationServiceId, 10) },
      date: formData.date,
      startTime: formatTime(formData.startTime),
      endTime: formatTime(formData.endTime),
      status: formData.status,
    };

    fetch("http://localhost:8081/free-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Ошибка при отправке данных");
      })
      .then((data) => {
        console.log("Ответ от сервера:", data);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });
      if (onSubmit) {
        onSubmit(formData); // Передача данных наверх
      }
    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      status: "Свободно",
      masterId: "",
      masterQualificationServiceId: "",
    });
    console.log("onSubmit function:", onSubmit);
  };

  return (
    <form onSubmit={handleSubmit}  className="container mt-4">
      <div className="mb-3">
        <label htmlFor="date" className="form-label">Дата:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="startTime" className="form-label">Время начала:</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="endTime" className="form-label">Время окончания:</label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>


      <div className="mb-3">
        <label htmlFor="masterSelect">Выберите мастера:</label>
        <select
          id="masterSelect"
          name="masterId"
          value={formData.masterId}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Выберите мастера</option>
          {masters.map((master) => (
            <option key={master.id} value={master.id}>
              {master.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="qualificationSelect">Выберите квалификацию мастера:</label>
        <select
          id="qualificationSelect"
          name="masterQualificationServiceId"
          value={formData.masterQualificationServiceId}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Выберите квалификацию</option>
          {qualificationServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.master.name} - {service.qualification.name} ({service.service.name})
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">Создать слот</button>
    </form>
  );
};

export default CreateSlotForm;
