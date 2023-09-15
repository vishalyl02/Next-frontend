"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

// Set Axios global configuration
axios.defaults.baseURL = 'https://user-kyuy.onrender.com'; // Replace with your FastAPI server URL

// Set CORS-related headers
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'https://next-frontend-umber.vercel.app'; // Replace with your frontend URL
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;

export default function Home() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: 0, year: '' });

  useEffect(() => {
    // Fetch students data from the FastAPI backend
    axios.get('/') // Use a relative path, which will be handled by Axios global configuration
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleCreateStudent = () => {
    // Send a POST request to create a new student
    try {
      axios.post('/create-student/', newStudent) // Use a relative path
        .then((response) => {
          setStudents([...students, response.data]);
          setNewStudent({ name: '', age: 0, year: '' });
        })
        .catch((error) => {
          console.error('Error creating student:', error);
        });
    } catch (error) {
      // Log the error and the response data
      console.error('Error creating student:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  const handleDeleteStudent = (studentId) => {
    // Send a DELETE request to delete a student
    axios.delete(`/delete-student/${studentId}`) // Use a relative path
      .then(() => {
        setStudents(students.filter((student) => student.id !== studentId));
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
  };

  return (
    <div>
      <h1>Student List</h1>
      {students.length > 0 ? (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.name} (Age: {student.age}, Year: {student.year})
              <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      <h2>Add a New Student</h2>
      <input
        type="text"
        placeholder="Name"
        value={newStudent.name}
        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Age"
        value={newStudent.age}
        onChange={(e) => setNewStudent({ ...newStudent, age: parseInt(e.target.value) })}
      />
      <input
        type="text"
        placeholder="Year"
        value={newStudent.year}
        onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
      />
      <button onClick={handleCreateStudent}>Create</button>
    </div>
  );
}
