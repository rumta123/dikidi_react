import React, { useState, useEffect } from "react";

// Форма для добавления нового рабочего графика
const AddWorkHoursForm = ({ onAddWorkHour }) => {
    const [formData, setFormData] = useState({
        workDate: "",
        startTime: "",
        endTime: "",
        masters: [], // Массив ID мастеров
        month: ""
    });
    const [months, setMonths] = useState([]);
    const [masters, setMasters] = useState([]);

    // Загрузка списка мастеров
    const fetchMasters = async () => {
        try {
            const response = await fetch("http://localhost:8081/masters");
            const data = await response.json();
            setMasters(data);
        } catch (error) {
            console.error("Error fetching masters:", error);
        }
    };

    // Загрузка списка месяцев
    const fetchMonths = async () => {
        try {
            const response = await fetch("http://localhost:8081/months");
            const data = await response.json();
            setMonths(data);
        } catch (error) {
            console.error("Error fetching months:", error);
        }
    };

    useEffect(() => {
        fetchMasters();
        fetchMonths();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "masters") {
            // Преобразуем NodeList в массив значений выбранных опций
            const selectedMasters = Array.from(event.target.selectedOptions, (option) => option.value);
            setFormData((prevState) => ({
                ...prevState,
                masters: selectedMasters, // Обновляем массив выбранных мастеров
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const updatedMonth = months.find((month) => month.name === formData.month);

            const updatedData = {
                ...formData,
                masters: masters.filter((master) => formData.masters.includes(String(master.id))), // Сохраняем только выбранных мастеров
                month: updatedMonth // Передаем объект месяца
            };

            // Отправляем данные на сервер для добавления нового рабочего графика
            await fetch("http://localhost:8081/workhours", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });

            // Очистим форму после успешного добавления
            onAddWorkHour(updatedData);
            setFormData({ workDate: "", startTime: "", endTime: "", masters: [], month: "" });
            alert("Рабочие часы успешно добавлены"); // Показать успешное сообщение

        } catch (error) {
            console.error("ошибка:", error);
            alert("ошибка.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Добавить рабочие часы </h1>
            <div className="card">
                <div className="card-header">
                    <h5>График</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Дата работы</label>
                            <input
                                type="date"
                                className="form-control"
                                name="workDate"
                                value={formData.workDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Время начала</label>
                            <input
                                type="time"
                                className="form-control"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Время окончания</label>
                            <input
                                type="time"
                                className="form-control"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Мастера</label>
                            <select
                                className="form-control mt-2"
                                name="masters"
                                value={formData.masters || []} // Обязательно используйте массив
                                onChange={handleChange}
                                multiple
                            >
                                <option value="">Выберите мастеров</option>
                                {masters.map((master) => (
                                    <option key={master.id} value={master.id}>
                                        {master.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Месяц</label>
                            <select
                                className="form-control"
                                name="month"
                                value={formData.month}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Выберите месяц</option>
                                {months.map((month) => (
                                    <option key={month.id} value={month.name}>
                                        {month.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Добавить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddWorkHoursForm;
