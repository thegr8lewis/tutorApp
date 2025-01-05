// server.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import db module
const authRoutes = require('./routes/authRoutes');
const app = express();

// Enable CORS with specific origin
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from localhost:3000 (your React app)
    methods: 'GET,POST,PUT,DELETE',  // Specify allowed HTTP methods (optional)
    allowedHeaders: 'Content-Type,Authorization'  // Specify allowed headers (optional)
}));


app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// Use promise API for the query
db.query('SELECT 1')
  .then(([rows, fields]) => {
    console.log('Database connected:', rows);
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
