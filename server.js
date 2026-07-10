const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.json({ message: "Hello, Lina"});
});

app.get('/status', (req, res) => {
    res.json({
        status: "ok",
        time: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});