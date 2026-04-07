-- Employee Salary Calculator Database Schema
-- Migration: 001_create_tables.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    designation VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create salaries table
CREATE TABLE IF NOT EXISTS salaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL,
    base_salary NUMERIC(12, 2) NOT NULL CHECK (base_salary >= 0),
    hra NUMERIC(12, 2) NOT NULL CHECK (hra >= 0),
    allowances NUMERIC(12, 2) NOT NULL CHECK (allowances >= 0),
    gross_salary NUMERIC(12, 2) NOT NULL CHECK (gross_salary >= 0),
    tax NUMERIC(12, 2) NOT NULL CHECK (tax >= 0),
    net_salary NUMERIC(12, 2) NOT NULL CHECK (net_salary >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
);

-- Create index on employee_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_salaries_employee_id ON salaries(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);

-- Comments for documentation
COMMENT ON TABLE employees IS 'Stores employee information';
COMMENT ON TABLE salaries IS 'Stores salary details and calculated values for employees';
COMMENT ON COLUMN employees.employee_id IS 'Unique employee identifier (business key)';
COMMENT ON COLUMN salaries.base_salary IS 'Base salary amount';
COMMENT ON COLUMN salaries.hra IS 'House Rent Allowance';
COMMENT ON COLUMN salaries.allowances IS 'Other allowances';
COMMENT ON COLUMN salaries.gross_salary IS 'Calculated: base_salary + hra + allowances';
COMMENT ON COLUMN salaries.tax IS 'Calculated: gross_salary * 0.10';
COMMENT ON COLUMN salaries.net_salary IS 'Calculated: gross_salary - tax';
