/**
 * API Service
 * Handles all HTTP requests to the backend
 * 
 * IMPORTANT: Salary calculations are performed ONLY on the backend.
 * This service only sends raw salary inputs to the backend.
 */

import axios from 'axios';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extract error message from response or use default
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors?.[0] || 
                           error.message || 
                           'An unexpected error occurred';
        
        // Create a standardized error object
        const standardError = new Error(errorMessage);
        standardError.response = error.response;
        standardError.errors = error.response?.data?.errors || [errorMessage];
        
        return Promise.reject(standardError);
    }
);

// ============================================
// EMPLOYEE API FUNCTIONS
// ============================================

/**
 * Create a new employee
 * POST /api/employees
 * 
 * @param {Object} employeeData - Employee data
 * @param {string} employeeData.employee_id - Unique employee ID (required)
 * @param {string} employeeData.name - Employee name (required)
 * @param {string} employeeData.department - Department (optional)
 * @param {string} employeeData.designation - Designation (optional)
 * @returns {Promise<Object>} Created employee
 */
export const createEmployee = async (employeeData) => {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
};

/**
 * Get all employees
 * GET /api/employees
 * 
 * @returns {Promise<Object>} List of employees
 */
export const getAllEmployees = async () => {
    const response = await apiClient.get('/employees');
    return response.data;
};

/**
 * Get a single employee by ID
 * GET /api/employees/:id
 * 
 * @param {string} id - Employee UUID
 * @returns {Promise<Object>} Employee data
 */
export const getEmployeeById = async (id) => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
};

/**
 * Update an employee
 * PUT /api/employees/:id
 * 
 * @param {string} id - Employee UUID
 * @param {Object} employeeData - Updated employee data
 * @returns {Promise<Object>} Updated employee
 */
export const updateEmployee = async (id, employeeData) => {
    const response = await apiClient.put(`/employees/${id}`, employeeData);
    return response.data;
};

/**
 * Delete an employee
 * DELETE /api/employees/:id
 * 
 * @param {string} id - Employee UUID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteEmployee = async (id) => {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
};

// ============================================
// SALARY API FUNCTIONS
// ============================================

/**
 * Create or update salary for an employee
 * POST /api/salaries/:employeeId
 * 
 * IMPORTANT: Only send raw salary inputs. 
 * The backend calculates gross_salary, tax, and net_salary.
 * 
 * @param {string} employeeId - Employee UUID
 * @param {Object} salaryData - Raw salary inputs
 * @param {number} salaryData.base_salary - Base salary (>= 0)
 * @param {number} salaryData.hra - HRA (>= 0)
 * @param {number} salaryData.allowances - Other allowances (>= 0)
 * @returns {Promise<Object>} Salary with calculated values
 */
export const createSalary = async (employeeId, salaryData) => {
    const response = await apiClient.post(`/salaries/${employeeId}`, salaryData);
    return response.data;
};

/**
 * Get all salary summaries with employee details
 * GET /api/salaries
 * 
 * Returns joined data containing:
 * - Employee Name
 * - Employee ID
 * - Base Salary
 * - HRA
 * - Allowances
 * - Gross Salary
 * - Tax Amount
 * - Net Salary
 * 
 * @returns {Promise<Object>} List of salary summaries
 */
export const getAllSalaries = async () => {
    const response = await apiClient.get('/salaries');
    return response.data;
};

/**
 * Get salary for a specific employee
 * GET /api/salaries/:employeeId
 * 
 * @param {string} employeeId - Employee UUID
 * @returns {Promise<Object>} Salary data
 */
export const getSalaryByEmployeeId = async (employeeId) => {
    const response = await apiClient.get(`/salaries/${employeeId}`);
    return response.data;
};

// Export all functions as default object for convenience
export default {
    // Employee APIs
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    // Salary APIs
    createSalary,
    getAllSalaries,
    getSalaryByEmployeeId
};
