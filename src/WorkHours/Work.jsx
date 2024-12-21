import React, { useState, useEffect } from "react";

const Work = () => {
    const [workHours, setWorkHours] = useState([]);
    const [months, setMonths] = useState([]); // Список месяцев
    const [masters, setMasters] = useState([]); // Список мастеров
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

    // Загрузка данных
    const fetchWorkHours = async () => {
        try {
            const response = await fetch("http://localhost:8081/workhours");
            const data = await response.json();
            setWorkHours(data);
        } catch (error) {
            console.error("Error fetching work hours:", error);
        }
    };

    const fetchMasters = async () => {
        try {
            const response = await fetch("http://localhost:8081/masters");
            const data = await response.json();
            setMasters(data);
        } catch (error) {
            console.error("Error fetching masters:", error);
        }
    };

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

    // Обработка поиска
    const filteredWorkHours = workHours.filter((workHour) => {
        const query = searchQuery.toLowerCase();
        return (
            workHour.workDate.toLowerCase().includes(query) ||
            workHour.startTime.toLowerCase().includes(query) ||
            workHour.endTime.toLowerCase().includes(query) ||
            workHour.masters?.some((master) => master.name.toLowerCase().includes(query)) ||
            workHour.month.name.toLowerCase().includes(query)
        );
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

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Work Hours</h1>

            {/* Поле поиска */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <WorkHoursTable
                workHours={sortedWorkHours}
                onSort={handleSort}
                sortConfig={sortConfig}
            />
        </div>
    );
};

const WorkHoursTable = ({ workHours, onSort, sortConfig }) => (
    <table className="table table-striped table-bordered">
        <thead className="thead-dark">
            <tr>
                <th onClick={() => onSort("workDate")}>
                    Date {sortConfig.key === "workDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => onSort("startTime")}>
                    Start Time {sortConfig.key === "startTime" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => onSort("endTime")}>
                    End Time {sortConfig.key === "endTime" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th>Masters</th>
                <th onClick={() => onSort("month.name")}>
                    Month {sortConfig.key === "month.name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
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
                        <button className="btn btn-primary btn-sm mr-2">Edit</button>
                        <button className="btn btn-danger btn-sm">Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default Work;
