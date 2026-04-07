/**
 * EmployeeTable Component
 * Displays list of employees with edit and delete actions
 */

import React from 'react';
import './EmployeeTable.css';

const EmployeeTable = ({ employees, onEdit, onDelete, onAddSalary, isLoading }) => {
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="employee-table-container">
                <div className="table-header">
                    <h2 className="table-title">Employees</h2>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading employees...</p>
                </div>
            </div>
        );
    }

    // Show empty state
    if (!employees || employees.length === 0) {
        return (
            <div className="employee-table-container">
                <div className="table-header">
                    <h2 className="table-title">Employees</h2>
                </div>
                <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <p className="empty-text">No employees found</p>
                    <p className="empty-subtext">Add your first employee using the form above</p>
                </div>
            </div>
        );
    }

    return (
        <div className="employee-table-container">
            <div className="table-header">
                <h2 className="table-title">Employees</h2>
                <span className="table-count">{employees.length} employee(s)</span>
            </div>
            
            <div className="table-wrapper">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td className="employee-id-cell">
                                    <span className="employee-id-badge">{employee.employee_id}</span>
                                </td>
                                <td className="name-cell">{employee.name}</td>
                                <td>{employee.department || <span className="na-text">N/A</span>}</td>
                                <td>{employee.designation || <span className="na-text">N/A</span>}</td>
                                <td className="date-cell">{formatDate(employee.created_at)}</td>
                                <td className="actions-cell">
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => onEdit(employee)}
                                            title="Edit Employee"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action-btn salary-btn"
                                            onClick={() => onAddSalary(employee)}
                                            title="Add/Update Salary"
                                        >
                                            Salary
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
                                                    onDelete(employee.id);
                                                }
                                            }}
                                            title="Delete Employee"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeTable;
