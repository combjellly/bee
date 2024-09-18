// student-server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 2170;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('./students.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      photo TEXT NOT NULL,
      meals INTEGER DEFAULT 0,
      extraSpent REAL DEFAULT 0
    )`);
  }
});

// Routes

// Get all students
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.json(rows);
  });
});

// Add a new student
app.post('/students', (req, res) => {
  const { name, photo } = req.body;
  db.run(`INSERT INTO students (name, photo) VALUES (?, ?)`, [name, photo], function (err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.json({ id: this.lastID });
  });
});

// Update a student
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;
  db.run(`UPDATE students SET ${field} = ? WHERE id = ?`, [value, id], function (err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.sendStatus(200);
  });
});

// Delete a student
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM students WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.sendStatus(200);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
