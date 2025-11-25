const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

// API Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './navbar-app/index.html'))
});

app.get('/about', (req, res) => {
  res.send('About Page');
});

app.all('*', (req, res) => {
  res.status(404).send('<h1>resource not found</h1>')
});

// Export Express app as Firebase Function
exports.api = functions.https.onRequest(app);
