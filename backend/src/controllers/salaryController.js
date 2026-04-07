/**
 * Salary Controller
 * Handles HTTP requests for salary operations
 * 
 * IMPORTANT: All salary calculations are performed in the salaryService.
 * This controller only handles HTTP request/response processing.
 */

const salaryService = require('../services/salaryService');
const { validateSalary, isValidUUID } = require('../utils/validation');

/**
 * Create or update salary for an employee
 * POST /api/salaries/:employeeId
 * 
 * Request body should contain:
 * - base_salary: number
 * - hra: number
 * - allowances: number
 * 
 * The backend (salaryService) will calculate:
 * - gross_salary
 * - tax
 * - net_salary
 */
const createSalary = (req, res) => {
    try {
        const { employeeId } = req.params;
        const salaryInput = req.body;

        // Validate UUID format
        if (!isValidUUID(employeeId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID format',
                errors: ['Employee ID must be a valid UUID']
            });
        }

        // Validate salary input data
        const validation = validateSalary(salaryInput);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Create/update salary (calculation happens in service layer)
        const salary = salaryService.createOrUpdateSalary(employeeId, salaryInput);

        res.status(201).json({
            success: true,
            message: 'Salary saved successfully',
            data: salary
        });
    } catch (error) {
        console.error('Error saving salary:', error);
        
        // Handle specific errors
        if (error.message === 'Employee not found') {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
                errors: ['No employee found with the specified ID']
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error.message]
        });
    }
};

/**
 * Get all salary summaries with employee details
 * GET /api/salaries
 * 
 * Returns joined data with:
 * - Employee Name
 * - Employee ID
 * - Base Salary
 * - HRA
 * - Allowances
 * - Gross Salary
 * - Tax Amount
 * - Net Salary
 */
const getAllSalaries = (req, res) => {
    try {
        const salaries = salaryService.getAllSalarySummaries();

        res.status(200).json({
            success: true,
            message: 'Salary summaries retrieved successfully',
            data: salaries,
            count: salaries.length
        });
    } catch (error) {
        console.error('Error fetching salaries:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error.message]
        });
    }
};

/**
 * Get salary for a specific employee
 * GET /api/salaries/:employeeId
 */
const getSalaryByEmployeeId = (req, res) => {
    try {
        const { employeeId } = req.params;

        // Validate UUID format
        if (!isValidUUID(employeeId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID format',
                errors: ['Employee ID must be a valid UUID']
            });
        }

        const salary = salaryService.getSalaryByEmployeeId(employeeId);

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'Salary not found',
                errors: ['No salary record found for the specified employee']
            });
        }

        res.status(200).json({
            success: true,
            message: 'Salary retrieved successfully',
            data: salary
        });
    } catch (error) {
        console.error('Error fetching salary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error.message]
        });
    }
};

module.exports = {
    createSalary,
    getAllSalaries,
    getSalaryByEmployeeId
};
