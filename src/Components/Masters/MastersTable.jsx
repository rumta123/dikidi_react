import React, { useState, useEffect } from "react";

const MastersTable = () => {
    const [masters, setMasters] = useState([]);
    const [newMaster, setNewMaster] = useState({ name: "", phoneNumber: "" });
    const [editingMaster, setEditingMaster] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", phoneNumber: "" });

    // Fetch all masters
    const fetchMasters = async () => {
        try {
            const response = await fetch("http://localhost:8081/masters");
            if (!response.ok) throw new Error("Failed to fetch masters");
            const data = await response.json();
            setMasters(data);
        } catch (error) {
            console.error("Error fetching masters:", error);
        }
    };

    useEffect(() => {
        fetchMasters();
    }, []);

    // Add a new master
    const handleAddMaster = async () => {
        if (!newMaster.name || !newMaster.phoneNumber) {
            alert("Please fill out all fields");
            return;
        }
        try {
            const response = await fetch("http://localhost:8081/masters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMaster),
            });
            if (!response.ok) throw new Error("Failed to add master");
            const data = await response.json();
            setMasters([...masters, data]);
            setNewMaster({ name: "", phoneNumber: "" });
        } catch (error) {
            console.error("Error adding master:", error);
        }
    };

    // Start editing a master
    const handleEditMaster = (index) => {
        setEditingMaster(index);
        setEditForm({
            name: masters[index].name,
            phoneNumber: masters[index].phoneNumber,
        });
    };

    // Update a master
    const handleUpdateMaster = async () => {
        if (!editForm.name || !editForm.phoneNumber) {
            alert("Please fill out all fields");
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:8081/masters/${masters[editingMaster].id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editForm),
                }
            );
            if (!response.ok) throw new Error("Failed to update master");
            const data = await response.json();
            const updatedMasters = [...masters];
            updatedMasters[editingMaster] = data;
            setMasters(updatedMasters);
            setEditingMaster(null);
        } catch (error) {
            console.error("Error updating master:", error);
        }
    };

    // Delete a master
    const handleDeleteMaster = async (index) => {
        if (!window.confirm("Are you sure you want to delete this master?")) return;
        try {
            const response = await fetch(`http://localhost:8081/masters/${masters[index].id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete master");
            const updatedMasters = masters.filter((_, i) => i !== index);
            setMasters(updatedMasters);
        } catch (error) {
            console.error("Error deleting master:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Masters Management</h1>

            {/* Add Master Form */}
            <div className="card mb-4">
                <div className="card-header">Add New Master</div>
                <div className="card-body">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newMaster.name}
                            onChange={(e) =>
                                setNewMaster({ ...newMaster, name: e.target.value })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newMaster.phoneNumber}
                            onChange={(e) =>
                                setNewMaster({
                                    ...newMaster,
                                    phoneNumber: e.target.value,
                                })
                            }
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleAddMaster}>
                        Add Master
                    </button>
                </div>
            </div>

            {/* Masters Table */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {masters.map((master, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{master.name}</td>
                            <td>{master.phoneNumber}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm mr-2"
                                    onClick={() => handleEditMaster(index)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteMaster(index)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Master Form */}
            {editingMaster !== null && (
                <div className="card mt-4">
                    <div className="card-header">Edit Master</div>
                    <div className="card-body">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editForm.name}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editForm.phoneNumber}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        phoneNumber: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setEditingMaster(null)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary ml-2"
                            onClick={handleUpdateMaster}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MastersTable;
