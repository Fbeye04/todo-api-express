const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 5000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/tasks", async (req, res) => {
  try {
    const allTasks = await prisma.task.findMany();
    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: id },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const newTaskData = req.body;
    const newTask = await prisma.task.create({
      data: {
        title: newTaskData.title,
        isDone: newTaskData.isDone || false,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create new task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: id },
    });
    res
      .status(200)
      .json({ message: `Task with ID ${id} deleted successfully` });
  } catch (error) {
    res
      .status(404)
      .json({ message: `Task with ID ${req.params.id} not found` });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: updatedData,
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    res
      .status(404)
      .json({ message: `Task with ID ${req.params.id} not found` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
