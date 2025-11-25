const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

// 註冊
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('username:', username);
    console.log('email:', email);
    console.log('password:', password);

    // 檢查用戶是否已存在
    const usersRef = db.collection('users');
    
    // 檢查 username
    const usernameSnapshot = await usersRef.where('username', '==', username).get();
    if (!usernameSnapshot.empty) {
      return res.status(400).json({ message: '用戶名已存在' });
    }

    // 檢查 email
    const emailSnapshot = await usersRef.where('email', '==', email).get();
    if (!emailSnapshot.empty) {
      return res.status(400).json({ message: '郵箱已存在' });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立新用戶
    const newUserRef = await usersRef.add({
      username,
      email,
      password: hashedPassword,
      created_at: new Date()
    });

    // 獲取新建用戶資料
    const newUserDoc = await newUserRef.get();
    const userData = newUserDoc.data();

    res.status(201).json({
      message: '註冊成功',
      user: {
        id: newUserRef.id,
        username: userData.username,
        email: userData.email,
        created_at: userData.created_at
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 登入
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查詢用戶
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', username).get();

    if (snapshot.empty) {
      return res.status(401).json({ message: '用戶名或密碼錯誤' });
    }

    // 獲取用戶資料
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // 驗證密碼
    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      return res.status(401).json({ message: '用戶名或密碼錯誤' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: userDoc.id, username: userData.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: '登入成功',
      token,
      user: {
        id: userDoc.id,
        username: userData.username,
        email: userData.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

module.exports = { register, login };
