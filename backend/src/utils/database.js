/**
 * Database Connection Utility
 * Uses sql.js (pure JS SQLite) - no external dependencies or compilation required
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Database file path
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'employee_salary.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

/**
 * Initialize the database
 */
const initializeDatabase = async () => {
    const SQL = await initSqlJs();
    
    // Load existing database or create new one
    try {
        if (fs.existsSync(DB_PATH)) {
            const fileBuffer = fs.readFileSync(DB_PATH);
            db = new SQL.Database(fileBuffer);
            console.log('Loaded existing database');
        } else {
            db = new SQL.Database();
            console.log('Created new database');
        }
    } catch (error) {
        console.log('Creating new database due to error:', error.message);
        db = new SQL.Database();
    }

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Create employees table
    db.run(`
        CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            employee_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            department TEXT,
            designation TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);

    // Create salaries table
    db.run(`
        CREATE TABLE IF NOT EXISTS salaries (
            id TEXT PRIMARY KEY,
            employee_id TEXT NOT NULL,
            base_salary REAL NOT NULL CHECK (base_salary >= 0),
            hra REAL NOT NULL CHECK (hra >= 0),
            allowances REAL NOT NULL CHECK (allowances >= 0),
            gross_salary REAL NOT NULL CHECK (gross_salary >= 0),
            tax REAL NOT NULL CHECK (tax >= 0),
            net_salary REAL NOT NULL CHECK (net_salary >= 0),
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        )
    `);

    // Create indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_salaries_employee_id ON salaries(employee_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id)`);

    // Save database
    saveDatabase();
    
    console.log('Database initialized successfully');
    return db;
};

/**
 * Save database to file
 */
const saveDatabase = () => {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
};

/**
 * Get database instance
 */
const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
};

/**
 * Generate UUID
 */
const generateUUID = () => uuidv4();

/**
 * Execute a query and return all results
 */
const queryAll = (sql, params = []) => {
    try {
        const stmt = getDb().prepare(sql);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

/**
 * Execute a query and return first result
 */
const queryOne = (sql, params = []) => {
    try {
        const stmt = getDb().prepare(sql);
        stmt.bind(params);
        let result = null;
        if (stmt.step()) {
            result = stmt.getAsObject();
        }
        stmt.free();
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

/**
 * Execute a statement (INSERT, UPDATE, DELETE)
 */
const run = (sql, params = []) => {
    try {
        getDb().run(sql, params);
        saveDatabase(); // Persist changes
        return { changes: getDb().getRowsModified() };
    } catch (error) {
        console.error('Database run error:', error);
        throw error;
    }
};

module.exports = {
    initializeDatabase,
    getDb,
    generateUUID,
    queryAll,
    queryOne,
    run,
    saveDatabase
};
