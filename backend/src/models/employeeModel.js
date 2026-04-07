/**
 * Employee Model
 * Handles all database operations for employees table
 */

const { queryAll, queryOne, run, generateUUID } = require('../utils/database');

/**
 * Create a new employee
 * @param {Object} employeeData - Employee data
 * @returns {Object} Created employee
 */
const create = (employeeData) => {
    const { employee_id, name, department, designation } = employeeData;
    const id = generateUUID();
    
    run(
        `INSERT INTO employees (id, employee_id, name, department, designation)
         VALUES (?, ?, ?, ?, ?)`,
        [id, employee_id.trim(), name.trim(), department ? department.trim() : null, designation ? designation.trim() : null]
    );
    
    return findById(id);
};

/**
 * Get all employees
 * @returns {Array} List of all employees
 */
const findAll = () => {
    return queryAll(
        `SELECT id, employee_id, name, department, designation, created_at
         FROM employees
         ORDER BY created_at DESC`
    );
};

/**
 * Find employee by UUID (primary key)
 * @param {string} id - Employee UUID
 * @returns {Object|null} Employee or null
 */
const findById = (id) => {
    return queryOne(
        `SELECT id, employee_id, name, department, designation, created_at
         FROM employees
         WHERE id = ?`,
        [id]
    );
};

/**
 * Find employee by employee_id (business key)
 * @param {string} employeeId - Employee ID
 * @returns {Object|null} Employee or null
 */
const findByEmployeeId = (employeeId) => {
    return queryOne(
        `SELECT id, employee_id, name, department, designation, created_at
         FROM employees
         WHERE employee_id = ?`,
        [employeeId]
    );
};

/**
 * Update an employee
 * @param {string} id - Employee UUID
 * @param {Object} employeeData - Updated employee data
 * @returns {Object|null} Updated employee or null
 */
const update = (id, employeeData) => {
    const { employee_id, name, department, designation } = employeeData;
    
    run(
        `UPDATE employees
         SET employee_id = ?, name = ?, department = ?, designation = ?
         WHERE id = ?`,
        [employee_id.trim(), name.trim(), department ? department.trim() : null, designation ? designation.trim() : null, id]
    );
    
    return findById(id);
};

/**
 * Delete an employee
 * @param {string} id - Employee UUID
 * @returns {boolean} True if deleted, false otherwise
 */
const remove = (id) => {
    const result = run(`DELETE FROM employees WHERE id = ?`, [id]);
    return result.changes > 0;
};

/**
 * Check if employee_id exists (for uniqueness validation)
 * @param {string} employeeId - Employee ID to check
 * @param {string} excludeId - UUID to exclude from check (for updates)
 * @returns {boolean} True if exists
 */
const existsByEmployeeId = (employeeId, excludeId = null) => {
    let result;
    
    if (excludeId) {
        result = queryOne(
            `SELECT 1 as found FROM employees WHERE employee_id = ? AND id != ? LIMIT 1`,
            [employeeId, excludeId]
        );
    } else {
        result = queryOne(
            `SELECT 1 as found FROM employees WHERE employee_id = ? LIMIT 1`,
            [employeeId]
        );
    }
    
    return !!result;
};

module.exports = {
    create,
    findAll,
    findById,
    findByEmployeeId,
    update,
    remove,
    existsByEmployeeId
};
