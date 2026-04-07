/**
 * Validation Utility
 * Contains validation functions for request data
 */

/**
 * Validate employee data
 * @param {Object} data - Employee data to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
const validateEmployee = (data) => {
    const errors = [];

    // Validate Employee Name (required)
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        errors.push('Employee Name is required and must be a non-empty string');
    }

    // Validate Employee ID (required, unique check done at database level)
    if (!data.employee_id || typeof data.employee_id !== 'string' || data.employee_id.trim() === '') {
        errors.push('Employee ID is required and must be a non-empty string');
    }

    // Validate Department (optional, but if provided must be string)
    if (data.department !== undefined && data.department !== null && data.department !== '') {
        if (typeof data.department !== 'string') {
            errors.push('Department must be a string');
        }
    }

    // Validate Designation (optional, but if provided must be string)
    if (data.designation !== undefined && data.designation !== null && data.designation !== '') {
        if (typeof data.designation !== 'string') {
            errors.push('Designation must be a string');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate salary data
 * @param {Object} data - Salary data to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
const validateSalary = (data) => {
    const errors = [];

    // Validate Base Salary (required, numeric, >= 0)
    if (data.base_salary === undefined || data.base_salary === null || data.base_salary === '') {
        errors.push('Base Salary is required');
    } else {
        const baseSalary = parseFloat(data.base_salary);
        if (isNaN(baseSalary)) {
            errors.push('Base Salary must be a valid number');
        } else if (baseSalary < 0) {
            errors.push('Base Salary must be greater than or equal to 0');
        }
    }

    // Validate HRA (required, numeric, >= 0)
    if (data.hra === undefined || data.hra === null || data.hra === '') {
        errors.push('HRA is required');
    } else {
        const hra = parseFloat(data.hra);
        if (isNaN(hra)) {
            errors.push('HRA must be a valid number');
        } else if (hra < 0) {
            errors.push('HRA must be greater than or equal to 0');
        }
    }

    // Validate Allowances (required, numeric, >= 0)
    if (data.allowances === undefined || data.allowances === null || data.allowances === '') {
        errors.push('Allowances is required');
    } else {
        const allowances = parseFloat(data.allowances);
        if (isNaN(allowances)) {
            errors.push('Allowances must be a valid number');
        } else if (allowances < 0) {
            errors.push('Allowances must be greater than or equal to 0');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate UUID format
 * @param {string} id - UUID to validate
 * @returns {boolean} True if valid UUID format
 */
const isValidUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

module.exports = {
    validateEmployee,
    validateSalary,
    isValidUUID
};
