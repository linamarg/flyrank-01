const express = require('express');
const app = express();
app.use(express.json());
 
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
 
const taskRepository = require('./taskRepository');
 
const PORT = 3000;
 
app.get('/', (req, res) => {
    res.json({ 
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});
 
app.get('/health', (req, res) => {
    res.json({
        status: "ok",
        time: new Date().toISOString()
    });
});
 
app.get('/tasks', (req, res) => {
    res.json(taskRepository.getAll());
});
 
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = taskRepository.getById(id);
 
    if (!task) {
        return res.status(404).json({ error: `Task ${id} not found`});
    }
 
    res.json(task);
});
 
app.post('/tasks', (req, res) => {
    const { title } = req.body;
 
    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }
 
    const newTask = taskRepository.create(title);
    res.status(201).json(newTask);
});
 
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, done } = req.body;
 
    if (title !== undefined && title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
    }
 
    const updated = taskRepository.update(id, { title, done });
 
    if (!updated) {
        return res.status(404).json({ error: `Task ${id} not found`});
    }
 
    res.json(updated);
});
 
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const removed = taskRepository.remove(id);
 
    if (!removed) {
        return res.status(404).json({ error: `Task ${id} not found`});
    }
 
    res.status(204).send();
});
 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});