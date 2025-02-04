// SQLite3 CRUD operations
// npm install express
// Create a Bood.sqlite file in Database folder
// Run this file with node CRUDBookSQLite.js
// Test with Postman

require("dotenv").config();
const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

// connnect to database
const db = new sqlite3.Database('./Database/Book.sqlite');

// parse incoming requests
app.use(express.json());

// create books table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT
)`);

// route to get all books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            res.status(500).send(err);
            } else {
                res.json(rows);
        }
    });
});

// route to get a book by id
app.get('/book/:id', (req, res) => {
    db.get('SELECT * FROM books WHERE id =?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Book not found');
            } else {
                res.json(row);
            }
        }
    });
});

// route to create a new book
app.post('/books', (req, res) => {
    const book = req.body;
    db.run('INSERT INTO books (title, author) VALUE (?, ?)', book.title, book.author, function(err) {
        if (err) {
            res.status(500).send(err);
            } else {
                book.id = this.lastID
                res.json(book);
        }
    });
});

// route to update a book
app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run('UPDATE books SET title = ?, auhtor = ? WHERE id = ?', book.title, book.author, req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
            } else {
                res.json(book);
        }
    });
});

// route to delete a book
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
            } else {
                res.json({});
        }
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}...`));
