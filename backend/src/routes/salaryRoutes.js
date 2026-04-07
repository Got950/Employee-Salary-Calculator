/**
 * Salary Routes
 * Defines API endpoints for salary operations
 */

const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

/**
 * GET /api/salaries
 * Get all salary summaries with employee details (JOIN)
 * 
 * Returns:
 * - Employee Name
 * - Employee ID
 * - Base Salary
 * - HRA
 * - Allowances
 * - Gross Salary
 * - Tax Amount
 * - Net Salary
 */
router.get('/', salaryController.getAllSalaries);

/**
 * POST /api/salaries/:employeeId
 * Create or update salary for an employee
 * 
 * Salary calculation happens in backend (salaryService):
 * - Gross Salary = Base Salary + HRA + Allowances
 * - Tax = Gross Salary × 10%
 * - Net Salary = Gross Salary − Tax
 * 
 * Request body:
 * {
 *   "base_salary": 50000 (required, numeric, >= 0),
 *   "hra": 10000 (required, numeric, >= 0),
 *   "allowances": 5000 (required, numeric, >= 0)
 * }
 */
router.post('/:employeeId', salaryController.createSalary);

/**
 * GET /api/salaries/:employeeId
 * Get salary for a specific employee
 */
router.get('/:employeeId', salaryController.getSalaryByEmployeeId);

module.exports = router;
