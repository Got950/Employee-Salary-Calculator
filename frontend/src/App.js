/**
 * Employee Salary Calculator - Main Application
 * Dashboard layout: sidebar + main content. Salary logic stays on backend.
 */

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

import {
  EmployeeForm,
  EmployeeTable,
  SalaryForm,
  SalarySummaryTable,
  Sidebar,
  Modal,
  DashboardSummaryCards,
  DashboardTable
} from './components';

import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllSalaries,
  createSalary,
  getSalaryByEmployeeId
} from './services/api';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [salariesLoading, setSalariesLoading] = useState(true);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryEmployee, setSalaryEmployee] = useState(null);
  const [existingSalary, setExistingSalary] = useState(null);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setEmployeesLoading(true);
      const response = await getAllEmployees();
      setEmployees(response.data || []);
    } catch (err) {
      setError('Failed to load employees: ' + err.message);
    } finally {
      setEmployeesLoading(false);
    }
  }, []);

  const fetchSalaries = useCallback(async () => {
    try {
      setSalariesLoading(true);
      const response = await getAllSalaries();
      setSalaries(response.data || []);
    } catch (err) {
      setError('Failed to load salaries: ' + err.message);
    } finally {
      setSalariesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchSalaries();
  }, [fetchEmployees, fetchSalaries]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  const openAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEditingEmployee(false);
    setShowEmployeeModal(true);
  };

  const openEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditingEmployee(true);
    setShowEmployeeModal(true);
  };

  const closeEmployeeModal = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
    setIsEditingEmployee(false);
  };

  const handleCreateEmployee = async (data) => {
    try {
      setError(null);
      await createEmployee(data);
      setSuccessMessage('Employee created successfully!');
      closeEmployeeModal();
      await fetchEmployees();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateEmployee = async (data) => {
    try {
      setError(null);
      await updateEmployee(selectedEmployee.id, data);
      setSuccessMessage('Employee updated successfully!');
      closeEmployeeModal();
      await fetchEmployees();
      await fetchSalaries();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      setError(null);
      await deleteEmployee(id);
      setSuccessMessage('Employee deleted successfully!');
      await fetchEmployees();
      await fetchSalaries();
      if (selectedEmployee?.id === id) closeEmployeeModal();
    } catch (err) {
      setError('Failed to delete employee: ' + err.message);
    }
  };

  const openSalaryModal = async (rowOrEmployee) => {
    const isRow = rowOrEmployee && 'salary_id' in rowOrEmployee;
    if (isRow) {
      setSalaryEmployee({
        id: rowOrEmployee.employee_uuid,
        name: rowOrEmployee.employee_name,
        employee_id: rowOrEmployee.employee_id
      });
      setExistingSalary({
        base_salary: rowOrEmployee.base_salary,
        hra: rowOrEmployee.hra,
        allowances: rowOrEmployee.allowances
      });
    } else {
      setSalaryEmployee(rowOrEmployee);
      try {
        const res = await getSalaryByEmployeeId(rowOrEmployee.id);
        setExistingSalary(res.data);
      } catch {
        setExistingSalary(null);
      }
    }
    setShowSalaryModal(true);
  };

  const closeSalaryModal = () => {
    setShowSalaryModal(false);
    setSalaryEmployee(null);
    setExistingSalary(null);
  };

  const handleSaveSalary = async (employeeId, data) => {
    try {
      setError(null);
      await createSalary(employeeId, data);
      setSuccessMessage('Salary saved successfully!');
      closeSalaryModal();
      await fetchSalaries();
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="app app-dashboard-layout">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      <div className="app-main-wrap">
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">{error}</span>
            <button className="alert-close" onClick={() => setError(null)}>×</button>
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            <span className="alert-message">{successMessage}</span>
          </div>
        )}

        {activeView === 'dashboard' && (
          <>
            <header className="dashboard-header">
              <h1 className="dashboard-title">Dashboard</h1>
              <button type="button" className="btn-add-employee" onClick={openAddEmployee}>
                Add Employee
              </button>
            </header>
            <div className="dashboard-content">
              <DashboardSummaryCards salaries={salaries} employeeCount={employees.length} />
              <DashboardTable
                salaries={salaries}
                isLoading={salariesLoading}
                onEditSalary={openSalaryModal}
              />
            </div>
          </>
        )}

        {activeView === 'employees' && (
          <div className="app-main">
            <div className="main-grid">
              <div className="form-column">
                <EmployeeForm
                  onSubmit={isEditingEmployee ? handleUpdateEmployee : handleCreateEmployee}
                  initialData={selectedEmployee}
                  onCancel={isEditingEmployee ? () => { setSelectedEmployee(null); setIsEditingEmployee(false); } : null}
                  isEditing={isEditingEmployee}
                />
                {showSalaryModal && salaryEmployee && (
                  <SalaryForm
                    employee={salaryEmployee}
                    onSubmit={handleSaveSalary}
                    onCancel={closeSalaryModal}
                    existingSalary={existingSalary}
                  />
                )}
              </div>
              <div className="table-column">
                <EmployeeTable
                  employees={employees}
                  onEdit={openEditEmployee}
                  onDelete={handleDeleteEmployee}
                  onAddSalary={openSalaryModal}
                  isLoading={employeesLoading}
                />
              </div>
            </div>
          </div>
        )}

        {activeView === 'salary' && (
          <div className="app-main">
            <section className="salary-summary-section">
              <SalarySummaryTable salaries={salaries} isLoading={salariesLoading} />
            </section>
          </div>
        )}
      </div>

      {showEmployeeModal && (
        <Modal title={isEditingEmployee ? 'Edit Employee' : 'Add Employee'} onClose={closeEmployeeModal}>
          <EmployeeForm
            onSubmit={isEditingEmployee ? handleUpdateEmployee : handleCreateEmployee}
            initialData={selectedEmployee}
            onCancel={closeEmployeeModal}
            isEditing={isEditingEmployee}
            hideTitle
          />
        </Modal>
      )}

      {showSalaryModal && salaryEmployee && (
        <Modal title={existingSalary ? 'Update Salary' : 'Add Salary'} onClose={closeSalaryModal}>
          <SalaryForm
            employee={salaryEmployee}
            onSubmit={handleSaveSalary}
            onCancel={closeSalaryModal}
            existingSalary={existingSalary}
            hideTitle
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
