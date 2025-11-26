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
const productRoutes = require('./routes/productRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './navbar-app/index.html'))
})

app.get('/about',(req,res) => {
  res.send('About Page');
});

app.all('*',(req,res) => {
  res.status(404).send('<h1>resource not found</h1>')
})

const PORT = process.env.PORT || 5000;

// 在非 Vercel 環境下啟動伺服器（Railway, 本地等）
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
