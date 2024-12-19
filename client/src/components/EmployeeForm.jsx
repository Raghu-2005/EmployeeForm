import React, { useState } from 'react';
import './EmployeeForm.css';
import axios from 'axios';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    email: '',
    phone: '',
    department: '',
    date_of_joining: '',
    role: '',
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingEmployeeId, setEditingEmployeeId] = useState(null); // Track the employee being edited

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.date_of_joining);
    const currentDate = new Date();
    const maxDate = new Date('2025-12-31');

    if (selectedDate > currentDate) {
      setErrorMessage('The date of joining cannot be in the future.');
      return;
    }

    if (selectedDate > maxDate) {
      setErrorMessage('The date of joining cannot be beyond 2025.');
      return;
    }

    try {
      if (editingEmployeeId) {
        const updatedData = submittedData.map((employee) =>
          employee.employee_id === editingEmployeeId ? formData : employee
        );
        setSubmittedData(updatedData);
        setEditingEmployeeId(null);
      } else {
        const response = await axios.post('http://localhost:5000/api/employees', formData);
        alert(response.data.message);
        setSubmittedData([...submittedData, formData]);
      }

      handleReset();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleEdit = (employee) => {
    setFormData(employee);
    setEditingEmployeeId(employee.employee_id);
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
      alert(response.data.message);
      const filteredData = submittedData.filter((employee) => employee.employee_id !== employeeId);
      setSubmittedData(filteredData);
      if (editingEmployeeId === employeeId) {
        setEditingEmployeeId(null);
        handleReset();
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete the employee.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      employee_id: '',
      email: '',
      phone: '',
      department: '',
      date_of_joining: '',
      role: '',
    });
    setErrorMessage('');
    setEditingEmployeeId(null);
  };

  return (
    <div className="employee-form-wrapper">
      <div className="employee-form-container">
        <h2>{editingEmployeeId ? 'Edit Employee Details' : 'Add Employee Details'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Employee ID:</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              disabled={!!editingEmployeeId}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div>
            <label>Date of Joining:</label>
            <input
              type="date"
              name="date_of_joining"
              value={formData.date_of_joining}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Role:</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit">{editingEmployeeId ? 'Update' : 'Submit'}</button>
            <button type="button" onClick={handleReset} className="reset-button">
              Reset
            </button>
          </div>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
      <div className="employee-data-table">
        <h2>Employee Records</h2>
        {submittedData.length === 0 ? (
          <p>No employee data available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((employee) => (
                <tr key={employee.employee_id}>
                  <td>{employee.name}</td>
                  <td>{employee.employee_id}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.department}</td>
                  <td>{employee.date_of_joining}</td>
                  <td>{employee.role}</td>
                  <td>
                    <button onClick={() => handleEdit(employee)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(employee.employee_id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeForm;
