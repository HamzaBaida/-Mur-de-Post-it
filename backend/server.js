const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// DB
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    else {
        console.log("DB connected");

        db.run(`
            CREATE TABLE IF NOT EXISTS notes (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             auteur TEXT,
             message TEXT,
             color TEXT,
             date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

app.get('/api/notes', (req, res) => {
    db.all("SELECT * FROM notes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/notes', (req, res) => {
    const { auteur, message, color } = req.body;

    if (!auteur || !message) {
        return res.status(400).json({ error: "champs obligatoires" });
    }

    db.run(
        "INSERT INTO notes (auteur, message, color) VALUES (?, ?, ?)",
        [auteur, message, color || '#ffeb3b'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({ id: this.lastID });
        }
    );
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM notes WHERE id = ?", id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "deleted" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});

app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const { message, color } = req.body;

    if (!message) {
        return res.status(400).json({ error: "message required" });
    }

    db.run(
        "UPDATE notes SET message = ?, color = ? WHERE id = ?",
        [message, color || '#ffeb3b', id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: "updated" });
        }
    );
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});