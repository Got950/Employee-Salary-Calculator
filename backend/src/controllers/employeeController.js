/**
 * Employee Controller
 * Handles HTTP requests for employee operations
 */

const employeeModel = require('../models/employeeModel');
const { validateEmployee, isValidUUID } = require('../utils/validation');

/**
 * Create a new employee
 * POST /api/employees
 */
const createEmployee = (req, res) => {
    try {
        const employeeData = req.body;

        // Validate input data
        const validation = validateEmployee(employeeData);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Check if employee_id already exists
        const exists = employeeModel.existsByEmployeeId(employeeData.employee_id);
        if (exists) {
            return res.status(409).json({
                success: false,
                message: 'Employee ID already exists',
                errors: ['An employee with this Employee ID already exists']
            });
        }

        // Create employee
        const employee = employeeModel.create(employeeData);

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error.message]
        });
    }
};

/**
 * Get all employees
 * GET /api/employees
 */
const getAllEmployees = (req, res) => {
    try {
        const employees = employeeModel.findAll();

        res.status(200).json({
            success: true,
            message: 'Employees retrieved successfully',
            data: employees,
            count: employees.length
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error.message]
        });
    }
};

/**
 * Get single employee by ID
 * GET /api/employees/:id
 */
const getEmployeeById = (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID format
        if (!isValidUUID(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID format',
                errors: ['Employee ID must be a valid UUID']
            });
        }

        const employee = employeeModel.findById(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
                errors: ['No employee found with the specified ID']
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee retrieved successfully',
            data: employee
        });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error.message]
        });
    }
};

/**
 * Update an employee
 * PUT /api/employees/:id
 */
const updateEmployee = (req, res) => {
    try {
        const { id } = req.params;
        const employeeData = req.body;

        // Validate UUID format
        if (!isValidUUID(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID format',
                errors: ['Employee ID must be a valid UUID']
            });
        }

        // Check if employee exists
        const existingEmployee = employeeModel.findById(id);
        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
                errors: ['No employee found with the specified ID']
            });
        }

        // Validate input data
        const validation = validateEmployee(employeeData);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Check if new employee_id conflicts with another employee
        if (employeeData.employee_id !== existingEmployee.employee_id) {
            const idExists = employeeModel.existsByEmployeeId(employeeData.employee_id, id);
            if (idExists) {
                return res.status(409).json({
                    success: false,
                    message: 'Employee ID already exists',
                    errors: ['An employee with this Employee ID already exists']
                });
            }
        }

        // Update employee
        const updatedEmployee = employeeModel.update(id, employeeData);

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: updatedEmployee
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error.message]
        });
    }
};

/**
 * Delete an employee
 * DELETE /api/employees/:id
 */
const deleteEmployee = (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID format
        if (!isValidUUID(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID format',
                errors: ['Employee ID must be a valid UUID']
            });
        }

        // Check if employee exists
        const existingEmployee = employeeModel.findById(id);
        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
                errors: ['No employee found with the specified ID']
            });
        }

        // Delete employee (cascade will handle salary deletion)
        const deleted = employeeModel.remove(id);

        if (deleted) {
            res.status(200).json({
                success: true,
                message: 'Employee deleted successfully',
                data: { id }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete employee',
                errors: ['An error occurred while deleting the employee']
            });
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error.message]
        });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
