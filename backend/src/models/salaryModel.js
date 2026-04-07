/**
 * Salary Model
 * Handles all database operations for salaries table
 */

const { queryAll, queryOne, run, generateUUID } = require('../utils/database');

/**
 * Create a new salary record
 * @param {Object} salaryData - Salary data including calculated values
 * @returns {Object} Created salary record
 */
const create = (salaryData) => {
    const { 
        employee_id, 
        base_salary, 
        hra, 
        allowances, 
        gross_salary, 
        tax, 
        net_salary 
    } = salaryData;
    
    const id = generateUUID();
    
    run(
        `INSERT INTO salaries (id, employee_id, base_salary, hra, allowances, gross_salary, tax, net_salary)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, employee_id, base_salary, hra, allowances, gross_salary, tax, net_salary]
    );
    
    return queryOne(`SELECT * FROM salaries WHERE id = ?`, [id]);
};

/**
 * Find salary by employee UUID
 * @param {string} employeeId - Employee UUID
 * @returns {Object|null} Salary record or null
 */
const findByEmployeeId = (employeeId) => {
    return queryOne(
        `SELECT id, employee_id, base_salary, hra, allowances, 
                gross_salary, tax, net_salary, created_at
         FROM salaries
         WHERE employee_id = ?
         ORDER BY created_at DESC
         LIMIT 1`,
        [employeeId]
    );
};

/**
 * Get all salary records with employee details (JOIN)
 * @returns {Array} List of salary records with employee info
 */
const findAllWithEmployees = () => {
    return queryAll(
        `SELECT 
            s.id AS salary_id,
            e.id AS employee_uuid,
            e.employee_id,
            e.name AS employee_name,
            e.department,
            e.designation,
            s.base_salary,
            s.hra,
            s.allowances,
            s.gross_salary,
            s.tax,
            s.net_salary,
            s.created_at AS salary_created_at,
            e.created_at AS employee_created_at
         FROM salaries s
         INNER JOIN employees e ON s.employee_id = e.id
         ORDER BY s.created_at DESC`
    );
};

/**
 * Update salary record for an employee
 * @param {string} employeeId - Employee UUID
 * @param {Object} salaryData - Updated salary data
 * @returns {Object|null} Updated salary record or null
 */
const updateByEmployeeId = (employeeId, salaryData) => {
    const { 
        base_salary, 
        hra, 
        allowances, 
        gross_salary, 
        tax, 
        net_salary 
    } = salaryData;
    
    run(
        `UPDATE salaries
         SET base_salary = ?, hra = ?, allowances = ?, 
             gross_salary = ?, tax = ?, net_salary = ?,
             created_at = datetime('now')
         WHERE employee_id = ?`,
        [base_salary, hra, allowances, gross_salary, tax, net_salary, employeeId]
    );
    
    return findByEmployeeId(employeeId);
};

/**
 * Delete salary record by employee UUID
 * @param {string} employeeId - Employee UUID
 * @returns {boolean} True if deleted
 */
const removeByEmployeeId = (employeeId) => {
    const result = run(`DELETE FROM salaries WHERE employee_id = ?`, [employeeId]);
    return result.changes > 0;
};

/**
 * Check if salary exists for employee
 * @param {string} employeeId - Employee UUID
 * @returns {boolean} True if exists
 */
const existsByEmployeeId = (employeeId) => {
    const result = queryOne(
        `SELECT 1 as found FROM salaries WHERE employee_id = ? LIMIT 1`,
        [employeeId]
    );
    return !!result;
};

module.exports = {
    create,
    findByEmployeeId,
    findAllWithEmployees,
    updateByEmployeeId,
    removeByEmployeeId,
    existsByEmployeeId
};
