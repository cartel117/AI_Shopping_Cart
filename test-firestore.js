const { db, admin } = require('./config/firebase');

async function testFirestore() {
  try {
    console.log('🔍 測試 Firestore 連接...\n');
    
    // 測試寫入
    console.log('1️⃣ 測試寫入資料...');
    const docRef = await db.collection('test').add({
      message: 'Hello from Node.js!',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      testNumber: Math.random()
    });
    console.log('✅ 寫入成功！文檔 ID:', docRef.id);
    
    // 測試讀取
    console.log('\n2️⃣ 測試讀取資料...');
    const snapshot = await db.collection('test').limit(5).get();
    console.log('✅ 讀取成功！找到', snapshot.size, '筆資料');
    
    snapshot.forEach(doc => {
      console.log('   -', doc.id, ':', doc.data().message);
    });
    
    console.log('\n🎉 Firestore 測試完成！\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 測試失敗:', error.message);
    console.error('\n請確認：');
    console.error('1. Firebase Console 中已啟用 Cloud Firestore');
    console.error('2. 前往 https://console.firebase.google.com/project/shopping-cart-dbc00/firestore');
    console.error('3. 點擊「建立資料庫」並選擇「正式環境模式」\n');
    process.exit(1);
  }
}

testFirestore();
