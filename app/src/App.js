import React, { useState, useEffect } from 'react';
import StudentList from './StudentList';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');

  // Load students from the server on initial render
  useEffect(() => {
    fetch('http://192.168.113.8:2170/students')
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error('Error fetching students:', error));
  }, []);

  // Add a new student to the server
  const addStudent = () => {
    if (newStudentName.trim() === '') {
      alert('Please enter a name for the student');
      return;
    }

    const newStudent = {
      name: newStudentName,
      photo: "https://via.placeholder.com/150",
      meals: 0,
      extraSpent: 0,
    };

    fetch('http://192.168.113.8:2170/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((addedStudent) => {
        setStudents([...students, { ...newStudent, id: addedStudent.id }]);
      })
      .catch((error) => console.error('Error adding student:', error));

    setNewStudentName('');
  };

  // Update a student on the server
  const updateStudent = (id, field, value) => {
    fetch(`http://192.168.113.8:2170/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field, value }),
    })
      .then(() => {
        const updatedStudents = students.map((student) =>
          student.id === id ? { ...student, [field]: Number(value) } : student
        );
        setStudents(updatedStudents);
      })
      .catch((error) => console.error('Error updating student:', error));
  };

  // Delete a student from the server
  const deleteStudent = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
      fetch(`http://192.168.113.8:2170/students/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setStudents(students.filter((student) => student.id !== id));
        })
        .catch((error) => console.error('Error deleting student:', error));
    }
  };

  // Reset all students' meals and extraSpent to 0
  const resetAllStudents = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all students\' meals and extra spent?');
    if (confirmReset) {
      Promise.all(students.map(student =>
        fetch(`http://192.168.113.8:2170/students/${student.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ field: 'meals', value: 0 }),
        }).then(() =>
          fetch(`http://192.168.113.8:2170/students/${student.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ field: 'extraSpent', value: 0 }),
          })
        )
      ))
        .then(() => {
          setStudents(students.map(student => ({
            ...student,
            meals: 0,
            extraSpent: 0
          })));
        })
        .catch((error) => console.error('Error resetting students:', error));
    }
  };

  return (
    <div className="App">
      <h1>Student Profiles</h1>
      
      <input
        type="text"
        placeholder="Enter student name"
        value={newStudentName}
        onChange={(e) => setNewStudentName(e.target.value)}
      />
      
      <button onClick={addStudent}>Add Student</button>
      <button onClick={resetAllStudents}>Reset All Students</button>

      <StudentList 
        students={students} 
        updateStudent={updateStudent} 
        deleteStudent={deleteStudent} 
      />
    </div>
  );
}

export default App;
