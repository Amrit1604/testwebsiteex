const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON body data
app.use(bodyParser.json());

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Replace with your MySQL username
    password: 'yoyoyo12345678',  // Replace with your MySQL password
    database: 'websiteDB'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Route to serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, email } = req.body;

    // Insert form data into MySQL
    const sql = 'INSERT INTO submissions (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        console.log(`Submission saved: Name - ${name}, Email - ${email}`);
        res.json({ message: 'Form submitted successfully' });
    });
});

// Render thank-you page using EJS
app.get('/thankyou', (req, res) => {
    res.render('thankyou');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
