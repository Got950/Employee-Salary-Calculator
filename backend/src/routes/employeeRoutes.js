/**
 * Employee Routes
 * Defines API endpoints for employee operations
 */

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

/**
 * POST /api/employees
 * Create a new employee
 * 
 * Request body:
 * {
 *   "employee_id": "EMP001" (required, unique),
 *   "name": "John Doe" (required),
 *   "department": "Engineering" (optional),
 *   "designation": "Software Engineer" (optional)
 * }
 */
router.post('/', employeeController.createEmployee);

/**
 * GET /api/employees
 * Get all employees
 */
router.get('/', employeeController.getAllEmployees);

/**
 * GET /api/employees/:id
 * Get a single employee by UUID
 */
router.get('/:id', employeeController.getEmployeeById);

/**
 * PUT /api/employees/:id
 * Update an employee
 * 
 * Request body:
 * {
 *   "employee_id": "EMP001" (required, unique),
 *   "name": "John Doe" (required),
 *   "department": "Engineering" (optional),
 *   "designation": "Software Engineer" (optional)
 * }
 */
router.put('/:id', employeeController.updateEmployee);

/**
 * DELETE /api/employees/:id
 * Delete an employee
 */
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
