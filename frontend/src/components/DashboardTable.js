/**
 * Dashboard employee/salary table: Employee (avatar + name), Department (pill), Gross, Tax, Net
 */

import React, { useState, useMemo } from 'react';
import './DashboardTable.css';

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const getInitials = (name) => {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const DEPARTMENT_COLORS = ['#f97316', '#a855f7', '#0d9488', '#ec4899', '#eab308', '#22c55e', '#3b82f6'];
const getDeptColor = (dept) => {
  if (!dept) return '#94a3b8';
  let hash = 0;
  for (let i = 0; i < dept.length; i++) hash = ((hash << 5) - hash) + dept.charCodeAt(i);
  const idx = Math.abs(hash) % DEPARTMENT_COLORS.length;
  return DEPARTMENT_COLORS[idx];
};

const DashboardTable = ({ salaries = [], onEditSalary, isLoading }) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sortedSalaries = useMemo(() => {
    if (!sortKey) return salaries;
    const copy = [...salaries];
    copy.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'employee_name') {
        va = (va || '').toLowerCase();
        vb = (vb || '').toLowerCase();
        return sortDir === 'asc' ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
      }
      if (sortKey === 'department') {
        va = (va || '').toLowerCase();
        vb = (vb || '').toLowerCase();
        return sortDir === 'asc' ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
      }
      va = parseFloat(va) || 0;
      vb = parseFloat(vb) || 0;
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return copy;
  }, [salaries, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortKey !== columnKey) return <span className="sort-icon">⇅</span>;
    return <span className="sort-icon sort-active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  if (isLoading) {
    return (
      <div className="dashboard-table-container">
        <div className="dashboard-table-loading">
          <div className="loading-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!salaries.length) {
    return (
      <div className="dashboard-table-container">
        <div className="dashboard-table-empty">
          <p>No salary records yet. Add employees and their salaries to see data here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-table-container">
      <div className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>
                <button className="th-sort" onClick={() => handleSort('employee_name')}>
                  Employee <SortIcon columnKey="employee_name" />
                </button>
              </th>
              <th>
                <button className="th-sort" onClick={() => handleSort('department')}>
                  Department
                </button>
              </th>
              <th>
                <button className="th-sort" onClick={() => handleSort('gross_salary')}>
                  Gross Salary <SortIcon columnKey="gross_salary" />
                </button>
              </th>
              <th>
                <button className="th-sort" onClick={() => handleSort('tax')}>
                  Tax (10%) <SortIcon columnKey="tax" />
                </button>
              </th>
              <th>
                <button className="th-sort" onClick={() => handleSort('net_salary')}>
                  Net Salary <SortIcon columnKey="net_salary" />
                </button>
              </th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSalaries.map((row) => (
              <tr key={row.salary_id}>
                <td>
                  <div className="cell-employee">
                    <div className="avatar" style={{ background: '#e2e8f0', color: '#475569' }}>
                      {getInitials(row.employee_name)}
                    </div>
                    <span className="employee-name">{row.employee_name}</span>
                  </div>
                </td>
                <td>
                  <span
                    className="dept-pill"
                    style={{ background: getDeptColor(row.department) + '22', color: getDeptColor(row.department) }}
                  >
                    {row.department || '—'}
                  </span>
                </td>
                <td className="cell-amount">{formatCurrency(row.gross_salary)}</td>
                <td className="cell-amount">{formatCurrency(row.tax)}</td>
                <td className="cell-amount">{formatCurrency(row.net_salary)}</td>
                <td>
                  {onEditSalary && (
                    <button
                      type="button"
                      className="table-action-btn"
                      onClick={() => onEditSalary(row)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
