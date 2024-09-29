const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'patriot_parker'
});

// Registration
app.post('/api/register', (req, res) => {
    const { netID, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO users (netID, password, role) VALUES (?, ?, ?)';
    
    db.query(sql, [netID, hashedPassword, role], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { netID, password } = req.body;
    const sql = 'SELECT * FROM users WHERE netID = ?';
    
    db.query(sql, [netID], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
        
        const user = results[0];
        const isValidPassword = bcrypt.compareSync(password, user.password);
        
        if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user.id, role: user.role }, 'secret_key', { expiresIn: '1h' });
        res.json({ token });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
