/**
 * SalarySummaryTable Component
 * Displays salary summary with all required fields:
 * - Employee Name
 * - Employee ID
 * - Base Salary
 * - HRA
 * - Allowances
 * - Gross Salary
 * - Tax Amount
 * - Net Salary
 */

import React from 'react';
import './SalarySummaryTable.css';

const SalarySummaryTable = ({ salaries, isLoading }) => {
    // Format currency for display
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="salary-summary-container">
                <div className="table-header">
                    <h2 className="table-title">Salary Summary</h2>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading salary data...</p>
                </div>
            </div>
        );
    }

    // Show empty state
    if (!salaries || salaries.length === 0) {
        return (
            <div className="salary-summary-container">
                <div className="table-header">
                    <h2 className="table-title">Salary Summary</h2>
                </div>
                <div className="empty-state">
                    <div className="empty-icon">💰</div>
                    <p className="empty-text">No salary records found</p>
                    <p className="empty-subtext">Add salary information for employees to see the summary</p>
                </div>
            </div>
        );
    }

    return (
        <div className="salary-summary-container">
            <div className="table-header">
                <h2 className="table-title">Salary Summary</h2>
                <span className="table-count">{salaries.length} record(s)</span>
            </div>
            
            <div className="table-wrapper">
                <table className="salary-summary-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Employee ID</th>
                            <th className="amount-header">Base Salary</th>
                            <th className="amount-header">HRA</th>
                            <th className="amount-header">Allowances</th>
                            <th className="amount-header calculated">Gross Salary</th>
                            <th className="amount-header calculated tax">Tax (10%)</th>
                            <th className="amount-header calculated net">Net Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaries.map((salary) => (
                            <tr key={salary.salary_id}>
                                <td className="name-cell">{salary.employee_name}</td>
                                <td className="employee-id-cell">
                                    <span className="employee-id-badge">{salary.employee_id}</span>
                                </td>
                                <td className="amount-cell">{formatCurrency(salary.base_salary)}</td>
                                <td className="amount-cell">{formatCurrency(salary.hra)}</td>
                                <td className="amount-cell">{formatCurrency(salary.allowances)}</td>
                                <td className="amount-cell calculated">{formatCurrency(salary.gross_salary)}</td>
                                <td className="amount-cell tax">{formatCurrency(salary.tax)}</td>
                                <td className="amount-cell net">{formatCurrency(salary.net_salary)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend for calculated values */}
            <div className="table-legend">
                <div className="legend-item">
                    <span className="legend-color calculated-bg"></span>
                    <span className="legend-text">Calculated by server (Gross = Base + HRA + Allowances)</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color tax-bg"></span>
                    <span className="legend-text">Tax = Gross Salary × 10%</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color net-bg"></span>
                    <span className="legend-text">Net Salary = Gross Salary − Tax</span>
                </div>
            </div>
        </div>
    );
};

export default SalarySummaryTable;
