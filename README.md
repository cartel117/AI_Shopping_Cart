# 🛒 Shopping Cart - 購物車應用

一個使用 Node.js + Express + Firebase Firestore 構建的購物車應用程式。

## 📋 專案簡介

這是一個全端購物車系統，具備用戶註冊、登入功能，資料儲存在 Firebase Firestore 雲端資料庫。

### 🎯 主要功能

- ✅ 用戶註冊
- ✅ 用戶登入
- ✅ JWT 身份驗證
- ✅ 密碼加密（bcrypt）
- ✅ Firebase Firestore 資料庫
- ✅ RESTful API

### 🛠️ 技術棧

**後端**
- Node.js
- Express.js
- Firebase Admin SDK
- bcrypt（密碼加密）
- jsonwebtoken（JWT 驗證）

**資料庫**
- Firebase Firestore

**前端**
- HTML/CSS/JavaScript
- 原生 JavaScript（無框架）

## 🚀 快速開始

### 前置需求

- Node.js 18.x 或更高版本
- npm 或 yarn
- Firebase 帳號

### 安裝步驟

1. **克隆專案**
```bash
git clone <your-repo-url>
cd train
```

2. **安裝依賴**
```bash
npm install
```

3. **設定環境變數**

創建 `.env` 檔案：
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. **設定 Firebase**

從 Firebase Console 下載服務帳戶金鑰：
- 前往 [Firebase Console](https://console.firebase.google.com/)
- 選擇您的專案
- 專案設定 → 服務帳戶
- 產生新的私密金鑰
- 將下載的 JSON 檔案重新命名為 `serviceAccountKey.json`
- 放在專案根目錄

5. **啟動應用**

開發模式：
```bash
npm run dev
```

生產模式：
```bash
npm start
```

應用將在 `http://localhost:5000` 運行。

## 📁 專案結構

```
train/
├── app.js                    # 主應用程式入口
├── config/
│   ├── firebase.js          # Firebase 配置
│   └── database.js          # 資料庫配置（已棄用）
├── controllers/
│   └── authController.js    # 認證控制器
├── routes/
│   └── authRoutes.js        # 認證路由
├── public/                  # 靜態檔案
│   ├── index.html
│   ├── styles.css
│   └── browser-app.js
├── navbar-app/              # 主應用頁面
│   └── index.html
├── api/                     # Vercel Serverless 函數
│   └── index.js
├── Dockerfile              # Docker 配置
├── railway.json            # Railway 配置
├── vercel.json             # Vercel 配置
├── firebase.json           # Firebase 配置
├── package.json
└── README.md
```

## 🔐 API 端點

### 認證 API

**註冊**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123"
}
```

**登入**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

## 🌐 部署

### Railway 部署（推薦）

1. 安裝 Railway CLI
```bash
npm install -g @railway/cli
```

2. 登入 Railway
```bash
railway login
```

3. 初始化專案
```bash
railway init
```

4. 設定環境變數（在 Railway 網頁界面）
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=your-cert-url
```

5. 部署
```bash
railway up
```

### Vercel 部署

1. 安裝 Vercel CLI
```bash
npm install -g vercel
```

2. 登入並部署
```bash
vercel login
vercel --prod
```

3. 在 Vercel 網頁界面設定環境變數（同上）

### Firebase Hosting（僅靜態檔案）

```bash
firebase login
firebase init
firebase deploy
```

## 🔧 環境變數

### 必要環境變數

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `PORT` | 伺服器端口 | `5000` |
| `JWT_SECRET` | JWT 密鑰 | `your_secret_key` |
| `NODE_ENV` | 環境模式 | `development` / `production` |

### Firebase 環境變數（雲端部署需要）

| 變數名稱 | 說明 |
|---------|------|
| `FIREBASE_PROJECT_ID` | Firebase 專案 ID |
| `FIREBASE_PRIVATE_KEY_ID` | 私鑰 ID |
| `FIREBASE_PRIVATE_KEY` | 私鑰（完整） |
| `FIREBASE_CLIENT_EMAIL` | 服務帳戶 Email |
| `FIREBASE_CLIENT_ID` | 客戶端 ID |
| `FIREBASE_CLIENT_CERT_URL` | 證書 URL |

## 📊 資料庫結構

### Users Collection (Firestore)

```javascript
users/{userId}
├── username: string
├── email: string
├── password: string (hashed)
└── created_at: timestamp
```

## 🧪 測試

執行測試：
```bash
npm test
```

## 🤝 貢獻

歡迎提交 Pull Request 或開 Issue！

## 📝 授權

MIT License

## 🔗 相關連結

- [Firebase Console](https://console.firebase.google.com/)
- [Railway 文件](https://docs.railway.app/)
- [Vercel 文件](https://vercel.com/docs)

## 📧 聯絡方式

如有問題，請聯絡：cartel117@gmail.com

---

### 🌟 線上部署

- **Railway**: https://shopping-cart-production-ef99.up.railway.app
- **Vercel**: https://train-762qmhoiw-shopping-cart1.vercel.app
- **Firebase**: https://shopping-cart-dbc00.web.app

---

**最後更新**: 2025-11-25
