/**
 * Dashboard summary cards: Total Payroll, Active Employees, Average Net Salary
 */

import React from 'react';
import './DashboardSummaryCards.css';

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const DashboardSummaryCards = ({ salaries = [], employeeCount = 0 }) => {
  const totalPayroll = salaries.reduce((sum, s) => sum + parseFloat(s.net_salary || 0), 0);
  const avgNetSalary = salaries.length > 0 ? totalPayroll / salaries.length : 0;

  const cards = [
    { title: 'Total Payroll', value: formatCurrency(totalPayroll), id: 'payroll' },
    { title: 'Active Employees', value: String(employeeCount), id: 'employees' },
    { title: 'Average Net Salary', value: formatCurrency(avgNetSalary), id: 'avg' }
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div key={card.id} className="dashboard-card">
          <button className="dashboard-card-menu" aria-label="Options">⋯</button>
          <div className="dashboard-card-title">{card.title}</div>
          <div className="dashboard-card-value">{card.value}</div>
          <div className="dashboard-card-chart">
            <svg viewBox="0 0 120 24" className="mini-chart">
              <path
                d="M0,18 Q15,14 30,16 T60,10 T90,14 T120,8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummaryCards;
