# Employee Salary Calculator

A full-stack web application for managing employees and calculating their salaries.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Explanation](#architecture-explanation)
3. [Database Schema Explanation](#database-schema-explanation)
4. [API Documentation](#api-documentation)
5. [Assumptions](#assumptions)
6. [Tools Used](#tools-used)
7. [Challenges](#challenges)
8. [Improvements if More Time](#improvements-if-more-time)
9. [Local Setup Guide](#local-setup-guide)

---

## Project Overview

The Employee Salary Calculator is a full-stack application that allows organizations to:

- **Manage Employees**: Create, view, edit, and delete employee records
- **Enter Salary Components**: Input base salary, HRA (House Rent Allowance), and other allowances
- **Calculate Salaries**: Automatically calculate gross salary, tax, and net salary
- **View Salary Summaries**: Display comprehensive salary information for all employees

### Key Features

- Employee CRUD operations (Create, Read, Update, Delete)
- Salary component entry with validation
- Automatic salary calculation (performed server-side)
- Salary summary view with all details
- Responsive UI design
- Input validation on both frontend and backend

### Important Design Decision

**All salary calculations are performed exclusively on the backend.** The frontend never calculates salary values. This ensures:

- Data integrity and consistency
- Single source of truth for business logic
- Easier maintenance and updates to calculation formulas
- Security (prevents manipulation of calculated values)

### Salary Calculation Formula

```
Gross Salary = Base Salary + HRA + Allowances
Tax = Gross Salary × 10%
Net Salary = Gross Salary − Tax
```

---

## Architecture Explanation

### Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend                                │
│                    (React Application)                           │
│  ┌─────────────┐ ┌─────────────┐ ┌────────────┐ ┌─────────────┐ │
│  │EmployeeForm │ │EmployeeTable│ │ SalaryForm │ │SalarySummary│ │
│  └──────┬──────┘ └──────┬──────┘ └─────┬──────┘ └──────┬──────┘ │
│         │               │              │               │         │
│         └───────────────┴──────────────┴───────────────┘         │
│                              │                                    │
│                    ┌─────────┴─────────┐                         │
│                    │    API Service    │                         │
│                    └─────────┬─────────┘                         │
└──────────────────────────────┼──────────────────────────────────┘
                               │ HTTP REST API
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                          Backend                                  │
│                  (Node.js + Express)                              │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                        Routes                                │ │
│  │  /api/employees (CRUD)    /api/salaries (Create, Get)       │ │
│  └──────────────────────────────┬──────────────────────────────┘ │
│                                 │                                 │
│  ┌──────────────────────────────┴──────────────────────────────┐ │
│  │                      Controllers                             │ │
│  │  employeeController.js        salaryController.js            │ │
│  └──────────────────────────────┬──────────────────────────────┘ │
│                                 │                                 │
│  ┌──────────────────────────────┴──────────────────────────────┐ │
│  │                       Services                               │ │
│  │                   salaryService.js                           │ │
│  │         (Contains ALL salary calculation logic)              │ │
│  └──────────────────────────────┬──────────────────────────────┘ │
│                                 │                                 │
│  ┌──────────────────────────────┴──────────────────────────────┐ │
│  │                        Models                                │ │
│  │     employeeModel.js            salaryModel.js               │ │
│  └──────────────────────────────┬──────────────────────────────┘ │
└──────────────────────────────────┼──────────────────────────────┘
                                   │ SQL Queries
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                         Database                                  │
│                       (PostgreSQL)                                │
│                                                                   │
│  ┌─────────────────────┐       ┌─────────────────────┐          │
│  │     employees       │       │      salaries       │          │
│  │  ───────────────    │       │  ───────────────    │          │
│  │  id (PK)            │◄──────│  employee_id (FK)   │          │
│  │  employee_id        │       │  base_salary        │          │
│  │  name               │       │  hra                │          │
│  │  department         │       │  allowances         │          │
│  │  designation        │       │  gross_salary       │          │
│  │  created_at         │       │  tax                │          │
│  └─────────────────────┘       │  net_salary         │          │
│                                │  created_at         │          │
│                                └─────────────────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

### Backend Folder Structure

```
backend/
├── package.json
├── .env.example
└── src/
    ├── app.js              # Main application entry point
    ├── controllers/
    │   ├── employeeController.js  # Employee HTTP handlers
    │   └── salaryController.js    # Salary HTTP handlers
    ├── routes/
    │   ├── employeeRoutes.js      # Employee API routes
    │   └── salaryRoutes.js        # Salary API routes
    ├── services/
    │   └── salaryService.js       # Salary calculation logic (IMPORTANT)
    ├── models/
    │   ├── employeeModel.js       # Employee database operations
    │   └── salaryModel.js         # Salary database operations
    └── utils/
        ├── database.js            # PostgreSQL connection pool
        └── validation.js          # Input validation utilities
```

### Frontend Folder Structure

```
frontend/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js            # React entry point
    ├── index.css           # Global styles
    ├── App.js              # Main application component
    ├── App.css             # App-specific styles
    ├── services/
    │   └── api.js          # API client service
    └── components/
        ├── index.js        # Component exports
        ├── EmployeeForm.js      # Employee create/edit form
        ├── EmployeeForm.css
        ├── EmployeeTable.js     # Employee list table
        ├── EmployeeTable.css
        ├── SalaryForm.js        # Salary input form
        ├── SalaryForm.css
        ├── SalarySummaryTable.js    # Salary summary display
        └── SalarySummaryTable.css
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Routes** | Define API endpoints and route HTTP requests to controllers |
| **Controllers** | Handle HTTP request/response, validate input format, call services |
| **Services** | Implement business logic (salary calculations happen here) |
| **Models** | Perform database CRUD operations |
| **Utils** | Provide shared utilities (DB connection, validation helpers) |

---

## Database Schema Explanation

### employees Table

Stores employee personal and professional information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier (system-generated) |
| `employee_id` | VARCHAR(50) | UNIQUE, NOT NULL | Business identifier (user-provided, e.g., "EMP001") |
| `name` | VARCHAR(255) | NOT NULL | Employee's full name |
| `department` | VARCHAR(255) | NULLABLE | Department name (optional) |
| `designation` | VARCHAR(255) | NULLABLE | Job title/designation (optional) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

### salaries Table

Stores salary components and calculated values for employees.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `employee_id` | UUID | FOREIGN KEY → employees(id), ON DELETE CASCADE | Reference to employee |
| `base_salary` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Base salary amount |
| `hra` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | House Rent Allowance |
| `allowances` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Other allowances |
| `gross_salary` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Calculated: base + hra + allowances |
| `tax` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Calculated: gross × 10% |
| `net_salary` | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Calculated: gross − tax |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

### Database Design Decisions

1. **UUID Primary Keys**: Using UUIDs instead of auto-increment integers for better security and distributed system compatibility

2. **Separate Tables**: Employees and salaries are in separate tables for:
   - Normalization
   - Flexibility (one employee can have salary history)
   - Clear separation of concerns

3. **NUMERIC(12,2) for Money**: Using NUMERIC type with 2 decimal places ensures precise monetary calculations without floating-point errors

4. **CHECK Constraints**: Database-level validation ensures values cannot be negative

5. **Cascade Delete**: When an employee is deleted, their salary records are automatically removed

6. **Indexes**: Created on `employee_id` columns for faster lookups

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Employee APIs

#### Create Employee

```
POST /api/employees
```

**Request Body:**
```json
{
  "employee_id": "EMP001",
  "name": "John Doe",
  "department": "Engineering",
  "designation": "Software Engineer"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "employee_id": "EMP001",
    "name": "John Doe",
    "department": "Engineering",
    "designation": "Software Engineer",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Employees

```
GET /api/employees
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [...],
  "count": 10
}
```

#### Get Employee by ID

```
GET /api/employees/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": { ... }
}
```

#### Update Employee

```
PUT /api/employees/:id
```

**Request Body:**
```json
{
  "employee_id": "EMP001",
  "name": "John Doe Updated",
  "department": "Engineering",
  "designation": "Senior Software Engineer"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": { ... }
}
```

#### Delete Employee

```
DELETE /api/employees/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": { "id": "550e8400-e29b-41d4-a716-446655440000" }
}
```

### Salary APIs

#### Create/Update Salary

```
POST /api/salaries/:employeeId
```

**Request Body (only raw inputs - calculation done by server):**
```json
{
  "base_salary": 50000,
  "hra": 10000,
  "allowances": 5000
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Salary saved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "employee_id": "550e8400-e29b-41d4-a716-446655440000",
    "base_salary": "50000.00",
    "hra": "10000.00",
    "allowances": "5000.00",
    "gross_salary": "65000.00",
    "tax": "6500.00",
    "net_salary": "58500.00",
    "created_at": "2024-01-15T10:35:00.000Z"
  }
}
```

#### Get All Salary Summaries (with Employee Details)

```
GET /api/salaries
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Salary summaries retrieved successfully",
  "data": [
    {
      "salary_id": "550e8400-e29b-41d4-a716-446655440001",
      "employee_uuid": "550e8400-e29b-41d4-a716-446655440000",
      "employee_id": "EMP001",
      "employee_name": "John Doe",
      "department": "Engineering",
      "designation": "Software Engineer",
      "base_salary": "50000.00",
      "hra": "10000.00",
      "allowances": "5000.00",
      "gross_salary": "65000.00",
      "tax": "6500.00",
      "net_salary": "58500.00",
      "salary_created_at": "2024-01-15T10:35:00.000Z",
      "employee_created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error message 1", "Detailed error message 2"]
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation failed |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate employee_id |
| 500 | Internal Server Error |

---

## Assumptions

1. **Single Currency**: All salary amounts are in a single currency (no currency conversion needed)

2. **Tax Rate**: Fixed at 10% of gross salary (no tax brackets or complex tax calculations)

3. **One Salary per Employee**: Each employee has one salary record (updated when new salary is entered)

4. **No Authentication**: As per requirements, no authentication system is implemented

5. **Employee ID Format**: Employee IDs are user-provided strings (no specific format enforced)

6. **Positive Numbers Only**: All salary components must be zero or positive

7. **No Salary History**: Only the most recent salary is stored (not historical salary data)

8. **Server-Side Calculation**: All salary calculations happen exclusively on the backend

9. **UTC Timestamps**: All timestamps are stored in UTC

10. **Modern Browser**: Frontend assumes a modern browser with ES6+ support

---

## Tools Used

### Backend

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x+ | JavaScript runtime |
| Express.js | 4.18.x | Web framework |
| PostgreSQL | 14.x+ | Database |
| pg | 8.11.x | PostgreSQL client for Node.js |
| cors | 2.8.x | CORS middleware |
| dotenv | 16.x | Environment variable management |
| uuid | 9.x | UUID generation |
| nodemon | 3.x | Development auto-restart |

### Frontend

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.2.x | UI library |
| axios | 1.6.x | HTTP client |
| react-scripts | 5.0.x | Build tooling (Create React App) |

### Development

| Tool | Purpose |
|------|---------|
| npm | Package management |
| Git | Version control |

---

## Challenges

### 1. Ensuring Server-Side Calculation Only

**Challenge**: Ensuring that salary calculations never happen in the frontend.

**Solution**: Designed the API to only accept raw salary inputs (base_salary, hra, allowances). The salaryService.js is the single source of truth for all calculations. Frontend components are explicitly documented to never calculate values.

### 2. Data Validation Consistency

**Challenge**: Ensuring consistent validation between frontend and backend.

**Solution**: Implemented validation on both layers:
- Frontend provides immediate user feedback
- Backend provides security and data integrity
- Both use the same validation rules (numeric, >= 0)

### 3. Database Money Precision

**Challenge**: Handling monetary values without floating-point errors.

**Solution**: Used NUMERIC(12,2) PostgreSQL type which provides exact decimal arithmetic, avoiding issues like 0.1 + 0.2 ≠ 0.3.

### 4. UUID Handling

**Challenge**: Managing two types of IDs (UUID primary key vs. user-provided employee_id).

**Solution**: Clear naming convention:
- `id` always refers to the UUID primary key
- `employee_id` always refers to the user-provided business identifier

### 5. Responsive Design

**Challenge**: Making the salary summary table readable on mobile devices.

**Solution**: Implemented horizontal scrolling for the table on smaller screens while keeping the overall layout responsive.

---

## Improvements if More Time

### Technical Improvements

1. **TypeScript**: Convert both frontend and backend to TypeScript for better type safety

2. **Unit Tests**: Add comprehensive test suites using Jest for backend and React Testing Library for frontend

3. **API Documentation**: Generate OpenAPI/Swagger documentation

4. **Database Migrations**: Implement a proper migration system (e.g., node-pg-migrate or Knex)

5. **Connection Pooling**: Implement PgBouncer for better database connection management

6. **Error Tracking**: Integrate error tracking service (e.g., Sentry)

7. **Logging**: Implement structured logging with Winston or Pino

8. **Rate Limiting**: Add rate limiting to prevent API abuse

9. **Input Sanitization**: Add additional input sanitization (XSS prevention)

10. **Docker**: Containerize the application with Docker and docker-compose

### Feature Improvements

1. **Salary History**: Store historical salary records instead of just the current one

2. **Multiple Tax Brackets**: Implement configurable tax slabs

3. **Department-wise Reports**: Add summary reports grouped by department

4. **Export Functionality**: Allow exporting salary data to CSV/PDF

5. **Search and Filter**: Add employee search and filtering capabilities

6. **Pagination**: Implement pagination for large employee lists

7. **Bulk Operations**: Allow bulk salary entry via file upload

8. **Audit Trail**: Track who made changes and when

9. **Authentication**: Add user authentication and role-based access

10. **Dashboard**: Add charts and statistics dashboard

---

## Local Setup Guide

### Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14.x or higher) - [Download](https://www.postgresql.org/download/)

### Step 1: Clone/Download the Project

```bash
# Navigate to your desired directory
cd C:\Users\ASUS\Desktop\Assesment
```

### Step 2: Database Setup

#### 2.1 Start PostgreSQL Service

Make sure PostgreSQL is running on your system.

**Windows:**
- Open Services (services.msc)
- Find "postgresql-x64-14" (or your version)
- Ensure it's running

**Or via Command Line:**
```bash
pg_ctl start -D "C:\Program Files\PostgreSQL\14\data"
```

#### 2.2 Create Database

Open a terminal or command prompt and connect to PostgreSQL:

```bash
# Connect to PostgreSQL as the postgres user
psql -U postgres
```

Then run these SQL commands:

```sql
-- Create the database
CREATE DATABASE employee_salary_db;

-- Connect to the database
\c employee_salary_db

-- Exit psql
\q
```

#### 2.3 Run Migration Script

Execute the migration script to create tables:

```bash
# From the project root directory
psql -U postgres -d employee_salary_db -f database/migrations/001_create_tables.sql
```

**Or manually:**

1. Open pgAdmin or psql
2. Connect to `employee_salary_db`
3. Copy the contents of `database/migrations/001_create_tables.sql`
4. Execute the SQL commands

### Step 3: Backend Setup

#### 3.1 Navigate to Backend Directory

```bash
cd backend
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Configure Environment Variables

Create a `.env` file in the backend folder:

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_salary_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### 3.4 Start Backend Server

```bash
# For development (with auto-restart)
npm run dev

# Or for production
npm start
```

You should see:
```
Connected to PostgreSQL database
Server is running on port 5000
Environment: development
API Base URL: http://localhost:5000/api
```

#### 3.5 Verify Backend

Open a browser and navigate to:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### Step 4: Frontend Setup

#### 4.1 Open a New Terminal

Keep the backend running and open a new terminal window.

#### 4.2 Navigate to Frontend Directory

```bash
cd C:\Users\ASUS\Desktop\Assesment\frontend
```

#### 4.3 Install Dependencies

```bash
npm install
```

#### 4.4 Start Frontend Development Server

```bash
npm start
```

The application will open in your default browser at:
```
http://localhost:3000
```

### Step 5: Using the Application

1. **Add an Employee**:
   - Fill in the Employee ID (e.g., "EMP001")
   - Enter the Employee Name (required)
   - Optionally add Department and Designation
   - Click "Add Employee"

2. **View Employees**:
   - The employee table shows all employees
   - Use Edit, Salary, or Delete buttons for actions

3. **Add Salary**:
   - Click "Salary" button on an employee row
   - Enter Base Salary, HRA, and Allowances
   - Click "Save Salary"
   - The server calculates Gross, Tax, and Net Salary

4. **View Salary Summary**:
   - Scroll down to see the Salary Summary table
   - Shows all salary details including calculated values

### Troubleshooting

#### Database Connection Error

If you see "Failed to start server" or database connection errors:

1. Verify PostgreSQL is running
2. Check your `.env` file credentials
3. Ensure the database `employee_salary_db` exists
4. Verify the PostgreSQL port (default: 5432)

```bash
# Test PostgreSQL connection
psql -U postgres -d employee_salary_db -c "SELECT 1"
```

#### Port Already in Use

If port 5000 or 3000 is already in use:

**Backend (port 5000):**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (port 3000):**
When prompted, press 'Y' to use a different port.

#### npm Install Errors

If you encounter npm install errors:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rd /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Quick Reference: Commands

```bash
# Database
psql -U postgres -d employee_salary_db    # Connect to DB

# Backend (from /backend directory)
npm install           # Install dependencies
npm run dev           # Start development server
npm start             # Start production server

# Frontend (from /frontend directory)
npm install           # Install dependencies
npm start             # Start development server
npm run build         # Build for production
```

### URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## License

This project is created for assessment purposes.

---

## Contact

For questions or issues, please refer to the documentation above or create an issue in the repository.
