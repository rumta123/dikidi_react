import React, { useState, useEffect } from "react";
import AddWorkHoursForm from "./AddWorkHoursForm";
import { Button,  Modal } from 'react-bootstrap';
const WorkHoursList = () => {
    const [workHours, setWorkHours] = useState([]);
    const [months, setMonths] = useState([]); // Список месяцев
    const [masters, setMasters] = useState([]); // Список мастеров
    const [editingWorkHours, setEditingWorkHours] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
  
    const [selectedMonth, setSelectedMonth] = useState(""); // Поиск по месяцу
    const [selectedMaster, setSelectedMaster] = useState(""); // Поиск по мастеру
    const [selectedDate, setSelectedDate] = useState(""); // Поиск по дате
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

    const [formData, setFormData] = useState({
        workDate: "",
        startTime: "",
        endTime: "",
        masters: [], // Массив ID мастеров
        month: ""
    });

    const handleAddWorkHour = (newWorkHour) => {
        setWorkHours((prevWorkHours) => [...prevWorkHours, newWorkHour]);
    };

    // Обработка поиска
    const filteredWorkHours = workHours.filter((workHour) => {
        const query = searchQuery.toLowerCase();
        
        const matchesSearchQuery = 
            (workHour.workDate?.toLowerCase().includes(query) ||
            workHour.startTime?.toLowerCase().includes(query) ||
            workHour.endTime?.toLowerCase().includes(query) ||
            (workHour.masters?.some((master) => master.name.toLowerCase().includes(query)) || false) ||
            (workHour.month?.name?.toLowerCase().includes(query) || false));
    
        const matchesMonth = selectedMonth ? workHour.month?.name === selectedMonth : true;
        const matchesMaster = selectedMaster ? workHour.masters?.some(master => master.name === selectedMaster) : true;
        const matchesDate = selectedDate ? workHour.workDate === selectedDate : true;
    
        return matchesSearchQuery && matchesMonth && matchesMaster && matchesDate;
    });
    
    // Обработка сортировки
    const sortedWorkHours = [...filteredWorkHours].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
            const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };
    // Загрузка списка рабочих часов
    const fetchWorkHours = async () => {
        try {
            const response = await fetch("http://localhost:8081/workhours");
            const data = await response.json();
            setWorkHours(data);
        } catch (error) {
            console.error("Error fetching work hours:", error);
        }
    };

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
        fetchWorkHours();
        fetchMasters();
        fetchMonths();
    }, []);

    const handleEdit = (workHour) => {
        setEditingWorkHours(workHour);
        setFormData({
            workDate: workHour.workDate,
            startTime: workHour.startTime,
            endTime: workHour.endTime,
            masters: workHour.masters.map((master) => master.id), // Сохраняем ID мастеров
            month: workHour.month.name
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this work hour?")) return;

        try {
            await fetch(`http://localhost:8081/workhours/${id}`, { method: "DELETE" });
            fetchWorkHours();
        } catch (error) {
            console.error("Error deleting work hour:", error);
        }
    };

    const handleSave = async () => {
        try {
            const updatedMonth = months.find((month) => month.name === formData.month);

            const updatedData = {
                ...formData,
                masters: masters.filter((master) => formData.masters.includes(String(master.id))), // Сохраняем только выбранных мастеров
                month: updatedMonth // Передаем объект месяца
            };

            await fetch(`http://localhost:8081/workhours/${editingWorkHours.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });

            fetchWorkHours();
            setEditingWorkHours(null);
        } catch (error) {
            console.error("Error updating work hour:", error);
        }
    };

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

    return (
        <div className="container mt-5">

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title> Добавить рабочие часы </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddWorkHoursForm onAddWorkHour={handleAddWorkHour} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Закрыть
                    </Button>
                   
                </Modal.Footer>
            </Modal>


            <h1 className="text-center mb-4">График работы</h1>
 
      <input
                type="text"
                className="form-control mb-3"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Фильтр по месяцу */}
            <select
                className="form-control mb-3"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
            >
                <option value="">Выберете месяц</option>
                {months.map((month) => (
                    <option key={month.id} value={month.name}>
                        {month.name}
                    </option>
                ))}
            </select>

            {/* Фильтр по мастеру */}
            <select
                className="form-control mb-3"
                value={selectedMaster}
                onChange={(e) => setSelectedMaster(e.target.value)}
            >
                <option value="">Выберете мастера</option>
                {masters.map((master) => (
                    <option key={master.id} value={master.name}>
                        {master.name}
                    </option>
                ))}
            </select>

            {/* Фильтр по дате */}
            <input
                type="date"
                className="form-control mb-3"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

<WorkHoursTable
                workHours={sortedWorkHours}
                onSort={handleSort}
                onEdit={handleEdit}
                sortConfig={sortConfig}
                onDelete={handleDelete}
            />
           
<Button variant="primary" onClick={() => setShowModal(true)}>
    Добавить данные
</Button>
            {editingWorkHours && (
                <EditForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSave={handleSave}
                    setEditingWorkHours={setEditingWorkHours}
                    months={months}
                    masters={masters} // Передаем список мастеров
                />
            )}
        </div>
    );
};

const WorkHoursTable = ({ workHours,  onSort, sortConfig,  onEdit, onDelete }) => (
    <table className="table table-striped table-bordered">
        <thead className="thead-dark">
        <tr>
                <th onClick={() => onSort("workDate")}>
                    Дата {sortConfig.key === "workDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => onSort("startTime")}>
                    Время начала {sortConfig.key === "startTime" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => onSort("endTime")}>
                   Время окончания {sortConfig.key === "endTime" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th>Мастера</th>
                <th onClick={() => onSort("month.name")}>
                   Месяц {sortConfig.key === "month.name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th>Действие</th>
            </tr>
        </thead>
        <tbody>
            {workHours.map((workHour) => (
                <tr key={workHour.id}>
                    <td>{workHour.workDate}</td>
                    <td>{workHour.startTime}</td>
                    <td>{workHour.endTime}</td>
                    <td>{workHour.masters?.map((master) => master.name).join(", ") || "No masters"}</td>
                    <td>{workHour.month.name}</td>
                    <td>
                        <button className="btn btn-warning btn-sm mr-2" onClick={() => onEdit(workHour)}>
                            Редактировать
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(workHour.id)}>
                            Удалить
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const EditForm = ({ formData, handleChange, handleSave, setEditingWorkHours, months, masters }) => {



    const mastersList = Array.isArray(formData.masters) ? formData.masters : [];

    return (
        <div className="card mt-4">

            <div className="card-header">
                <h5>Edit Work Hour</h5>
            </div>
            <div className="card-body">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Work Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="workDate"
                            value={formData.workDate}
                            onChange={handleChange}
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
                        />
                    </div>
                    <div className="form-group">
                        <label>Мастера</label>
                        <div>
                            {mastersList.map((masterId) => {
                                console.log('masterId', masterId); // Проверяем, что передается в masterId
                                const master = masters.find((m) => {
                                    console.log('Checking master', m); // Логируем каждый объект в массиве masters
                                    return m.id === Number(masterId);;
                                });

                                console.log('master', master); // Проверяем, что возвращается

                                return (
                                    <div key={masterId} className="d-flex align-items-center mb-2">
                                        <span>{master?.name || "Unknown"}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <select
                            className="form-control mt-2"
                            name="masters"
                            value={formData.masters || []} // Обязательно используйте массив
                            onChange={handleChange}
                            multiple
                        >
                            <option value="">Выберете мастера</option>
                            {masters
                                .filter((master) => !formData.masters.includes(master.id)) // Исключаем уже выбранных
                                .map((master) => (
                                    <option key={master.id} value={master.id}>
                                        {master.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Month</label>
                        <select
                            className="form-control"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                        >
                            <option value="">Выберете месяц</option>
                            {months.map((month) => (
                                <option key={month.id} value={month.name}>
                                    {month.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingWorkHours(null)}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary ml-2" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkHoursList;
