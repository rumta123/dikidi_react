import React from 'react';

const TableSearch = ({ onSearch }) => {
    const handleInputChange = (event) => {
        if (typeof onSearch === 'function') {
            onSearch(event.target.value); // Вызов переданной функции
        } else {
            console.error('onSearch is not a function or not provided:', onSearch);
        }
    };

    return (
        <input
            type="text"
            placeholder="Search..."
            onChange={handleInputChange}
            className="form-control"
        />
    );
};

export default TableSearch;
