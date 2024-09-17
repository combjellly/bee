import React from 'react';

function StudentProfile({ student, updateStudent, deleteStudent }) {
  const incrementMeals = () => {
    updateStudent(student.id, 'meals', student.meals + 1);
  };

  const decrementMeals = () => {
    if (student.meals > 0) {
      updateStudent(student.id, 'meals', student.meals - 1);
    }
  };

  const addExtraSpent = () => {
    const extra = parseFloat(prompt("Enter extra amount:"));
    if (!isNaN(extra)) {
      updateStudent(student.id, 'extraSpent', student.extraSpent + extra);
    }
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      <img src={student.photo} alt={`${student.name}'s profile`} width="150" height="150" />
      <h2>{student.name}</h2>
      <p>Meals: {student.meals}</p>
      <p>Extra Spent: ${student.extraSpent ? student.extraSpent.toFixed(2) : '0.00'}</p>
      <button onClick={decrementMeals}>- Meal</button>
      <button onClick={incrementMeals}>+ Meal</button>

      <button onClick={addExtraSpent}>Add Extra Spent</button>
      
      {/* Delete button */}
      <button onClick={() => deleteStudent(student.id)} style={{ backgroundColor: 'red', color: 'white' }}>
        Delete
      </button>
    </div>
  );
}

export default StudentProfile;
