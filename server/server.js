const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Add Employee
app.post('/api/employees', (req, res) => {
  const { name, employee_id, email, phone, department, date_of_joining, role } = req.body;

  const query = `INSERT INTO employees (name, employee_id, email, phone, department, date_of_joining, role)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [name, employee_id, email, phone, department, date_of_joining, role], (err, result) => {
    if (err) {
      console.error('Error saving employee data:', err);
      return res.status(500).json({ error: 'Error saving employee data' });
    }
    res.status(201).json({ message: 'Employee added successfully', data: result });
  });
});

// Delete Employee
app.delete('/api/employees/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const query = `DELETE FROM employees WHERE employee_id = ?`;

  db.query(query, [employeeId], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ error: 'Error deleting employee data' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
