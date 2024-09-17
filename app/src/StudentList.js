import React from 'react';
import StudentProfile from './StudentProfile';  // Import StudentProfile component

const StudentList = ({ students, updateStudent, deleteStudent }) => {
  return (
    <div className="student-list">
      {students.map(student => (
        <StudentProfile 
          key={student.id} 
          student={student} 
          updateStudent={updateStudent} 
          deleteStudent={deleteStudent}  // Pass deleteStudent to StudentProfile
        />
      ))}
    </div>
  );
};

export default StudentList;
