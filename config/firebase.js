const admin = require('firebase-admin');
const path = require('path');

// 初始化 Firebase Admin SDK
let db;

try {
  let serviceAccount;
  
  // 檢查是否在雲端環境（Vercel, Railway, 或有 Firebase 環境變數）
  if (process.env.VERCEL || process.env.RAILWAY_ENVIRONMENT || process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_CONFIG) {
    console.log('🔍 雲端環境偵測 (Vercel/Railway)');
    
    // 嘗試使用 FIREBASE_CONFIG
    if (process.env.FIREBASE_CONFIG) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
        console.log('✅ 使用 FIREBASE_CONFIG');
      } catch (e) {
        console.error('❌ FIREBASE_CONFIG 解析失敗，使用備用配置');
        // 備用方案：使用分散的環境變數
        serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID || "shopping-cart-dbc00",
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
        };
      }
    } else {
      // 使用分散的環境變數
      console.log('✅ 使用分散的環境變數');
      serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID || "shopping-cart-dbc00",
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
      };
    }
  } else {
    // 本地開發使用 JSON 檔案
    console.log('🔍 本地環境，使用 serviceAccountKey.json');
    serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));
  }
  
  // 檢查 Firebase Admin 是否已初始化
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  db = admin.firestore();
  console.log('✅ Firebase Firestore 連接成功！');
} catch (error) {
  console.error('❌ Firebase 初始化失敗:', error.message);
  console.error('Stack:', error.stack);
  db = null;
}

module.exports = { admin, db };
