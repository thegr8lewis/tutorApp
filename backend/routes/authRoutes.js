const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db'); // Import database connection

// Register Route
router.post('/signup', async (req, res) => {
    const { role, email, password } = req.body;
    try {
        // Check if user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.query('INSERT INTO users (role, email, password) VALUES (?, ?, ?)', [role, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) return res.status(404).json({ message: 'User not found' });

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT
        const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, role: user[0].role });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
