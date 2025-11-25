// 此檔案已被棄用，現在使用 Firebase Firestore
// 請改用 config/firebase.js

// 保留此檔案僅供參考（PostgreSQL 舊配置）
/*
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;
*/

// 現在請使用 Firebase
const { db } = require('./firebase');
module.exports = db;
