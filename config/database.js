const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL 連線池
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'shopping_cart_db',
});

// 測試連線
pool.on('connect', () => {
  console.log('✅ PostgreSQL 連線成功');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 連線錯誤:', err);
});

module.exports = pool;
