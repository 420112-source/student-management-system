const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let students = [
  { id: '1', name: 'Aarav Sharma', email: 'aarav.sharma@univ.edu', course: 'Computer Science', gpa: 3.8, status: 'Active' },
  { id: '2', name: 'Priya Patel', email: 'priya.patel@univ.edu', course: 'Data Science', gpa: 3.9, status: 'Active' },
  { id: '3', name: 'Rohan Mehta', email: 'rohan.mehta@univ.edu', course: 'Electrical Eng.', gpa: 3.2, status: 'On Leave' }
];

app.get('/api/students', (req, res) => {
  const { search, course } = req.query;
  let result = [...students];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }
  if (course) {
    result = result.filter(s => s.course === course);
  }
  res.json(result);
});

app.post('/api/students', (req, res) => {
  const { name, email, course, gpa, status } = req.body;
  if (!name || !email || !course || gpa === undefined) {
    return res.status(400).json({ error: 'Please fill all required fields.' });
  }

  const newStudent = {
    id: Date.now().toString(),
    name,
    email,
    course,
    gpa: parseFloat(gpa),
    status: status || 'Active'
  };

  students.unshift(newStudent);
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Student not found.' });

  students[index] = { ...students[index], ...req.body, gpa: parseFloat(req.body.gpa) };
  res.json(students[index]);
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  students = students.filter(s => s.id !== id);
  res.json({ message: 'Removed successfully.' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));