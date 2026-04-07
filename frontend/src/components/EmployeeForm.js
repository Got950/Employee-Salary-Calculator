/**
 * EmployeeForm Component
 * Form for creating and editing employees
 */

import React, { useState, useEffect } from 'react';
import './EmployeeForm.css';

const EmployeeForm = ({ onSubmit, initialData, onCancel, isEditing, hideTitle }) => {
    // Form state
    const [formData, setFormData] = useState({
        employee_id: '',
        name: '',
        department: '',
        designation: ''
    });
    
    // Error state
    const [errors, setErrors] = useState({});
    
    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with data when editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                employee_id: initialData.employee_id || '',
                name: initialData.name || '',
                department: initialData.department || '',
                designation: initialData.designation || ''
            });
        } else {
            // Reset form for new employee
            setFormData({
                employee_id: '',
                name: '',
                department: '',
                designation: ''
            });
        }
        setErrors({});
    }, [initialData]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Validate Employee ID (required)
        if (!formData.employee_id.trim()) {
            newErrors.employee_id = 'Employee ID is required';
        }

        // Validate Name (required)
        if (!formData.name.trim()) {
            newErrors.name = 'Employee Name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            await onSubmit(formData);
            
            // Reset form only if creating new employee
            if (!isEditing) {
                setFormData({
                    employee_id: '',
                    name: '',
                    department: '',
                    designation: ''
                });
            }
            setErrors({});
        } catch (error) {
            // Handle API errors
            if (error.errors) {
                setErrors({ submit: error.errors.join(', ') });
            } else {
                setErrors({ submit: error.message });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            employee_id: '',
            name: '',
            department: '',
            designation: ''
        });
        setErrors({});
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="employee-form-container">
            {!hideTitle && (
                <h2 className="form-title">
                    {isEditing ? 'Edit Employee' : 'Add New Employee'}
                </h2>
            )}
            
            <form onSubmit={handleSubmit} className="employee-form">
                {/* Submit Error Message */}
                {errors.submit && (
                    <div className="error-message form-error">
                        {errors.submit}
                    </div>
                )}

                {/* Employee ID Field */}
                <div className="form-group">
                    <label htmlFor="employee_id" className="form-label">
                        Employee ID <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="employee_id"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        className={`form-input ${errors.employee_id ? 'input-error' : ''}`}
                        placeholder="Enter Employee ID (e.g., EMP001)"
                        disabled={isSubmitting}
                    />
                    {errors.employee_id && (
                        <span className="error-text">{errors.employee_id}</span>
                    )}
                </div>

                {/* Employee Name Field */}
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        Employee Name <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'input-error' : ''}`}
                        placeholder="Enter Employee Name"
                        disabled={isSubmitting}
                    />
                    {errors.name && (
                        <span className="error-text">{errors.name}</span>
                    )}
                </div>

                {/* Department Field (Optional) */}
                <div className="form-group">
                    <label htmlFor="department" className="form-label">
                        Department
                    </label>
                    <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter Department (optional)"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Designation Field (Optional) */}
                <div className="form-group">
                    <label htmlFor="designation" className="form-label">
                        Designation
                    </label>
                    <input
                        type="text"
                        id="designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter Designation (optional)"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Form Buttons */}
                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Employee' : 'Add Employee')}
                    </button>
                    
                    {(isEditing || onCancel) && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
