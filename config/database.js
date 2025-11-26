const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL 連線池
// 優先使用 DATABASE_URL (Railway)，其次使用個別環境變數
let pool;

if (process.env.DATABASE_URL) {
  console.log('📊 使用 DATABASE_URL 連接 PostgreSQL');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  // 支援個別環境變數 (Railway: PGHOST, 本地: DB_HOST)
  const config = {
    host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
    port: process.env.PGPORT || process.env.DB_PORT || 5432,
    user: process.env.PGUSER || process.env.DB_USER || 'postgres',
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
    database: process.env.PGDATABASE || process.env.DB_NAME || 'shopping_cart_db',
  };

  console.log('📊 PostgreSQL 配置:', {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
    hasPassword: !!config.password
  });

  pool = new Pool(config);
}

// 測試連線
pool.on('connect', () => {
  console.log('✅ PostgreSQL 連線成功');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 連線錯誤:', err);
});

module.exports = pool;
