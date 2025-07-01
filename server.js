const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // Allow all origins (for dev only)
app.use(express.json()); // Parse JSON bodies

// Dummy in-memory tasks storage
let tasks = [];
let idCounter = 1;

// GET /tasks?email=...
app.get("/tasks", (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email is required" });
  // Filter tasks by email
  const userTasks = tasks.filter((t) => t.email === email);
  res.json(userTasks);
});

// POST /tasks?email=...
app.post("/tasks", (req, res) => {
  const email = req.query.email;
  const { text } = req.body;
  if (!email || !text) return res.status(400).json({ error: "Email and text required" });

  const newTask = {
    id: idCounter++,
    email,
    text,
    status: "Pending",
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id/toggle?email=...
app.put("/tasks/:id/toggle", (req, res) => {
  const id = parseInt(req.params.id);
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const task = tasks.find((t) => t.id === id && t.email === email);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.status = task.status === "Completed" ? "Pending" : "Completed";
  res.json(task);
});

// DELETE /tasks/:id?email=...
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const index = tasks.findIndex((t) => t.id === id && t.email === email);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks.splice(index, 1);
  res.status(204).send();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

