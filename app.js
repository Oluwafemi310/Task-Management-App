const express = require('express');
const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());

// In-memory tasks store
let tasks = [];

// Route to display all tasks
app.get('/', (req, res) => {
  res.render('index', { tasks });
});

// Route to create a new task
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  if (task) {
    // Create a simple task object with a unique ID using current timestamp
    tasks.push({ 
      id: Date.now().toString(), 
      text: task,
      completed: false,
      createdAt: new Date().toISOString()
    });
  }
  res.redirect('/');
});

// Route to get a specific task for editing
app.get('/tasks/:id/edit', (req, res) => {
  const id = req.params.id;
  const task = tasks.find(task => task.id === id);
  
  if (task) {
    res.render('edit', { task });
  } else {
    res.status(404).send('Task not found');
  }
});

// Route to update a task
app.post('/tasks/:id/update', (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex !== -1 && text) {
    tasks[taskIndex].text = text;
    tasks[taskIndex].updatedAt = new Date().toISOString();
  }
  
  res.redirect('/');
});

// Route to toggle task completion status
app.post('/tasks/:id/toggle', (req, res) => {
  const id = req.params.id;
  
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    tasks[taskIndex].updatedAt = new Date().toISOString();
  }
  
  res.redirect('/');
});

// Route to delete a task by its ID
app.post('/tasks/:id/delete', (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter(task => task.id !== id);
  res.redirect('/');
});

// API endpoints for AJAX operations
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks/:id/toggle', (req, res) => {
  const id = req.params.id;
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    tasks[taskIndex].updatedAt = new Date().toISOString();
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});