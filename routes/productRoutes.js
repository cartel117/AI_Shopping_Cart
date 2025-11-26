const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 取得所有商品 (支援篩選: status, minPrice, maxPrice, search)
router.get('/', productController.getAllProducts);

// 取得單一商品
router.get('/:id', productController.getProduct);

// 建立商品 (支援圖片上傳)
router.post('/', productController.createProduct);

// 更新商品 (支援圖片上傳)
router.put('/:id', productController.updateProduct);

// 更新庫存
router.patch('/:id/stock', productController.updateStock);

// 檢查庫存
router.post('/:id/check-stock', productController.checkStock);

// 刪除商品 (軟刪除，使用 ?hard=true 進行永久刪除)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
