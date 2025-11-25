# Shopping Cart - Firebase 遷移指南

## ✅ 已完成的設定

### 1. Firebase Admin SDK 配置
- ✅ 已安裝 `firebase-admin`、`firebase-functions`、`firebase-tools`
- ✅ 已創建 `config/firebase.js` 配置檔案
- ✅ 已更新 `authController.js` 使用 Firestore

### 2. 資料庫遷移
- ✅ PostgreSQL → Firestore 遷移完成
- ✅ 用戶註冊/登入功能已適配 Firestore

---

## 🔧 接下來需要手動完成的步驟

### 步驟 1：下載 Firebase Service Account Key

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案 `Shopping-Cart`
3. 點擊左上角「⚙️ 專案設定」
4. 進入「**服務帳戶**」分頁
5. 點擊「**產生新的私密金鑰**」
6. 下載 JSON 檔案，**重新命名為 `serviceAccountKey.json`**
7. 將此檔案放到專案根目錄：`d:\Project\train\serviceAccountKey.json`

⚠️ **重要**：此檔案包含敏感資訊，請勿上傳到 Git（已加入 .gitignore）

---

### 步驟 2：測試本地連接

完成步驟 1 後，執行以下命令測試 Firestore 連接：

```powershell
npm start
```

如果看到 `✅ Firebase Firestore 連接成功！` 表示配置正確。

---

### 步驟 3：登入 Firebase CLI（部署前必須）

在終端機執行：

```powershell
npx firebase login
```

這會開啟瀏覽器要求您登入 Google 帳號並授權 Firebase CLI。

---

### 步驟 4：初始化 Firebase 專案

```powershell
npx firebase init
```

選擇以下選項：
- **Firestore**: Configure security rules and indexes
- **Functions**: Configure Cloud Functions
- **Hosting**: Configure files for Firebase Hosting

專案選擇：選擇您在 Firebase Console 創建的 `Shopping-Cart` 專案

---

### 步驟 5：部署到 Firebase

完成初始化後，執行部署命令：

```powershell
npm run deploy
```

或直接使用：

```powershell
npx firebase deploy
```

---

## 📊 Firestore 資料結構

您的應用程式現在使用以下 Firestore 集合結構：

```
users (collection)
  └── {userId} (document)
      ├── username: string
      ├── email: string
      ├── password: string (hashed)
      └── created_at: timestamp
```

---

## 🔒 Firestore 安全規則建議

在 Firebase Console 的 Firestore → 規則中，設定以下規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 只允許透過 Admin SDK 訪問
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

因為您使用 Admin SDK（後端），所以前端不需要直接訪問 Firestore。

---

## 🚀 部署選項

### 選項 A：Firebase Hosting + Cloud Functions
- 適合全棧應用
- 自動擴展
- 免費額度充足

### 選項 B：其他雲端平台（Render, Railway, Heroku）
- 只需確保 `serviceAccountKey.json` 正確配置
- 設定環境變數 `JWT_SECRET`

---

## 📝 重要提醒

1. **Service Account Key**：必須放在專案根目錄才能正常運作
2. **環境變數**：確保 `.env` 檔案設定了 `JWT_SECRET`
3. **Git 安全**：`serviceAccountKey.json` 已加入 `.gitignore`，絕對不要上傳到 Git
4. **測試 API**：部署前先在本地測試註冊和登入功能

---

## 🧪 測試 API

### 註冊新用戶
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 用戶登入
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

---

需要任何協助，請隨時詢問！
