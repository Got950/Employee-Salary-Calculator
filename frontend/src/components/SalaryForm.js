/**
 * SalaryForm Component
 * Form for entering salary components
 * 
 * IMPORTANT: This form only collects raw salary inputs.
 * All salary calculations (gross_salary, tax, net_salary) are done on the backend.
 * The frontend NEVER calculates salary values.
 */

import React, { useState, useEffect } from 'react';
import './SalaryForm.css';

const SalaryForm = ({ employee, onSubmit, onCancel, existingSalary, hideTitle }) => {
    // Form state - ONLY raw inputs, no calculated values
    const [formData, setFormData] = useState({
        base_salary: '',
        hra: '',
        allowances: ''
    });
    
    // Error state
    const [errors, setErrors] = useState({});
    
    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with existing salary data if available
    useEffect(() => {
        if (existingSalary) {
            setFormData({
                base_salary: existingSalary.base_salary?.toString() || '',
                hra: existingSalary.hra?.toString() || '',
                allowances: existingSalary.allowances?.toString() || ''
            });
        } else {
            setFormData({
                base_salary: '',
                hra: '',
                allowances: ''
            });
        }
        setErrors({});
    }, [existingSalary]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Allow only numbers and decimal point
        if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
            return;
        }
        
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
    // Validates that all fields are numeric and >= 0
    const validateForm = () => {
        const newErrors = {};

        // Validate Base Salary (required, numeric, >= 0)
        if (formData.base_salary === '' || formData.base_salary === null) {
            newErrors.base_salary = 'Base Salary is required';
        } else {
            const baseSalary = parseFloat(formData.base_salary);
            if (isNaN(baseSalary)) {
                newErrors.base_salary = 'Base Salary must be a valid number';
            } else if (baseSalary < 0) {
                newErrors.base_salary = 'Base Salary must be >= 0';
            }
        }

        // Validate HRA (required, numeric, >= 0)
        if (formData.hra === '' || formData.hra === null) {
            newErrors.hra = 'HRA is required';
        } else {
            const hra = parseFloat(formData.hra);
            if (isNaN(hra)) {
                newErrors.hra = 'HRA must be a valid number';
            } else if (hra < 0) {
                newErrors.hra = 'HRA must be >= 0';
            }
        }

        // Validate Allowances (required, numeric, >= 0)
        if (formData.allowances === '' || formData.allowances === null) {
            newErrors.allowances = 'Allowances is required';
        } else {
            const allowances = parseFloat(formData.allowances);
            if (isNaN(allowances)) {
                newErrors.allowances = 'Allowances must be a valid number';
            } else if (allowances < 0) {
                newErrors.allowances = 'Allowances must be >= 0';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    // Sends ONLY raw inputs to backend - backend calculates salary
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Send only raw salary inputs to backend
            // Backend will calculate gross_salary, tax, net_salary
            const salaryData = {
                base_salary: parseFloat(formData.base_salary),
                hra: parseFloat(formData.hra),
                allowances: parseFloat(formData.allowances)
            };
            
            await onSubmit(employee.id, salaryData);
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
            base_salary: '',
            hra: '',
            allowances: ''
        });
        setErrors({});
        if (onCancel) {
            onCancel();
        }
    };

    if (!employee) {
        return null;
    }

    return (
        <div className="salary-form-container">
            {!hideTitle && (
                <h2 className="form-title">
                    {existingSalary ? 'Update Salary' : 'Add Salary'}
                </h2>
            )}
            
            {/* Employee Info */}
            <div className="employee-info">
                <div className="info-item">
                    <span className="info-label">Employee:</span>
                    <span className="info-value">{employee.name}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">ID:</span>
                    <span className="info-value employee-id-badge">{employee.employee_id}</span>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="salary-form">
                {/* Submit Error Message */}
                {errors.submit && (
                    <div className="error-message form-error">
                        {errors.submit}
                    </div>
                )}

                {/* Base Salary Field */}
                <div className="form-group">
                    <label htmlFor="base_salary" className="form-label">
                        Base Salary <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                        <span className="currency-symbol">$</span>
                        <input
                            type="text"
                            id="base_salary"
                            name="base_salary"
                            value={formData.base_salary}
                            onChange={handleChange}
                            className={`form-input currency-input ${errors.base_salary ? 'input-error' : ''}`}
                            placeholder="0.00"
                            disabled={isSubmitting}
                        />
                    </div>
                    {errors.base_salary && (
                        <span className="error-text">{errors.base_salary}</span>
                    )}
                    <span className="helper-text">Must be numeric and >= 0</span>
                </div>

                {/* HRA Field */}
                <div className="form-group">
                    <label htmlFor="hra" className="form-label">
                        HRA (House Rent Allowance) <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                        <span className="currency-symbol">$</span>
                        <input
                            type="text"
                            id="hra"
                            name="hra"
                            value={formData.hra}
                            onChange={handleChange}
                            className={`form-input currency-input ${errors.hra ? 'input-error' : ''}`}
                            placeholder="0.00"
                            disabled={isSubmitting}
                        />
                    </div>
                    {errors.hra && (
                        <span className="error-text">{errors.hra}</span>
                    )}
                    <span className="helper-text">Must be numeric and >= 0</span>
                </div>

                {/* Allowances Field */}
                <div className="form-group">
                    <label htmlFor="allowances" className="form-label">
                        Other Allowances <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                        <span className="currency-symbol">$</span>
                        <input
                            type="text"
                            id="allowances"
                            name="allowances"
                            value={formData.allowances}
                            onChange={handleChange}
                            className={`form-input currency-input ${errors.allowances ? 'input-error' : ''}`}
                            placeholder="0.00"
                            disabled={isSubmitting}
                        />
                    </div>
                    {errors.allowances && (
                        <span className="error-text">{errors.allowances}</span>
                    )}
                    <span className="helper-text">Must be numeric and >= 0</span>
                </div>

                {/* Note about backend calculation */}
                <div className="calculation-note">
                    <span className="note-icon">ℹ️</span>
                    <span className="note-text">
                        Gross Salary, Tax (10%), and Net Salary will be calculated by the server.
                    </span>
                </div>

                {/* Form Buttons */}
                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (existingSalary ? 'Update Salary' : 'Save Salary')}
                    </button>
                    
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SalaryForm;
