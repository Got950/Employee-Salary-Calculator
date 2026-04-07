/**
 * Salary Service
 * Contains all salary calculation logic
 * 
 * IMPORTANT: All salary calculations MUST happen here in the backend.
 * Frontend must NEVER calculate salary values.
 * 
 * Salary Calculation Formula (MANDATORY):
 * - Gross Salary = Base Salary + HRA + Allowances
 * - Tax = Gross Salary × 10%
 * - Net Salary = Gross Salary − Tax
 */

const salaryModel = require('../models/salaryModel');
const employeeModel = require('../models/employeeModel');

/**
 * Calculate salary components
 * This function implements the MANDATORY salary calculation formula
 * 
 * @param {number} baseSalary - Base salary amount
 * @param {number} hra - House Rent Allowance
 * @param {number} allowances - Other allowances
 * @returns {Object} Calculated salary components
 */
const calculateSalary = (baseSalary, hra, allowances) => {
    // Parse inputs to ensure numeric values
    const base = parseFloat(baseSalary) || 0;
    const hraAmount = parseFloat(hra) || 0;
    const allowancesAmount = parseFloat(allowances) || 0;

    // MANDATORY FORMULA: Gross Salary = Base Salary + HRA + Allowances
    const grossSalary = base + hraAmount + allowancesAmount;

    // MANDATORY FORMULA: Tax = Gross Salary × 10%
    const tax = grossSalary * 0.10;

    // MANDATORY FORMULA: Net Salary = Gross Salary − Tax
    const netSalary = grossSalary - tax;

    // Return all values rounded to 2 decimal places for currency precision
    return {
        base_salary: parseFloat(base.toFixed(2)),
        hra: parseFloat(hraAmount.toFixed(2)),
        allowances: parseFloat(allowancesAmount.toFixed(2)),
        gross_salary: parseFloat(grossSalary.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        net_salary: parseFloat(netSalary.toFixed(2))
    };
};

/**
 * Create or update salary for an employee
 * Calculates salary values and persists to database
 * 
 * @param {string} employeeId - Employee UUID
 * @param {Object} salaryInput - Raw salary input (base_salary, hra, allowances)
 * @returns {Object} Created/updated salary record with calculated values
 */
const createOrUpdateSalary = (employeeId, salaryInput) => {
    // Verify employee exists
    const employee = employeeModel.findById(employeeId);
    if (!employee) {
        throw new Error('Employee not found');
    }

    // Calculate salary values using the mandatory formula
    const calculatedSalary = calculateSalary(
        salaryInput.base_salary,
        salaryInput.hra,
        salaryInput.allowances
    );

    // Prepare salary data for database
    const salaryData = {
        employee_id: employeeId,
        ...calculatedSalary
    };

    // Check if salary record already exists for this employee
    const existingSalary = salaryModel.existsByEmployeeId(employeeId);

    let result;
    if (existingSalary) {
        // Update existing salary record
        result = salaryModel.updateByEmployeeId(employeeId, salaryData);
    } else {
        // Create new salary record
        result = salaryModel.create(salaryData);
    }

    return result;
};

/**
 * Get salary for a specific employee
 * @param {string} employeeId - Employee UUID
 * @returns {Object|null} Salary record or null
 */
const getSalaryByEmployeeId = (employeeId) => {
    return salaryModel.findByEmployeeId(employeeId);
};

/**
 * Get all salary summaries with employee details
 * This returns the data for the Salary Summary View
 * 
 * @returns {Array} List of salary records with employee info
 */
const getAllSalarySummaries = () => {
    return salaryModel.findAllWithEmployees();
};

module.exports = {
    calculateSalary,
    createOrUpdateSalary,
    getSalaryByEmployeeId,
    getAllSalarySummaries
};
