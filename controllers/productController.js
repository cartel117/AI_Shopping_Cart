const ProductPG = require('../models/ProductPG');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 設定圖片上傳
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/products');
    // 確保目錄存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允許上傳圖片檔案 (jpeg, jpg, png, gif, webp)'));
    }
  }
}).single('image');

// 取得所有商品
exports.getAllProducts = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'active',
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search
    };

    const products = await ProductPG.getAll(filters);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('取得商品列表錯誤:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 取得單一商品
exports.getProduct = async (req, res) => {
  try {
    const product = await ProductPG.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('取得商品錯誤:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 建立商品
exports.createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      const { name, description, price, stock_quantity, status } = req.body;

      // 驗證必填欄位
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: '商品名稱和價格為必填欄位'
        });
      }

      const productData = {
        name,
        description,
        price: parseFloat(price),
        stock_quantity: parseInt(stock_quantity) || 0,
        status: status || 'active',
        image_path: req.file ? `/uploads/products/${req.file.filename}` : null
      };

      const product = await ProductPG.create(productData);

      res.status(201).json({
        success: true,
        message: '商品建立成功',
        data: product
      });
    } catch (error) {
      console.error('建立商品錯誤:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
};

// 更新商品
exports.updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      const { name, description, price, stock_quantity, status } = req.body;

      const productData = {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        stock_quantity: stock_quantity ? parseInt(stock_quantity) : undefined,
        status,
        image_path: req.file ? `/uploads/products/${req.file.filename}` : undefined
      };

      const product = await ProductPG.update(req.params.id, productData);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }

      res.json({
        success: true,
        message: '商品更新成功',
        data: product
      });
    } catch (error) {
      console.error('更新商品錯誤:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
};

// 更新庫存
exports.updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: '請提供庫存數量'
      });
    }

    const product = await ProductPG.updateStock(
      req.params.id,
      parseInt(quantity),
      operation || 'set'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    res.json({
      success: true,
      message: '庫存更新成功',
      data: product
    });
  } catch (error) {
    console.error('更新庫存錯誤:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 刪除商品
exports.deleteProduct = async (req, res) => {
  try {
    const hardDelete = req.query.hard === 'true';
    
    const product = hardDelete 
      ? await ProductPG.hardDelete(req.params.id)
      : await ProductPG.delete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    res.json({
      success: true,
      message: hardDelete ? '商品已永久刪除' : '商品已刪除',
      data: product
    });
  } catch (error) {
    console.error('刪除商品錯誤:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 檢查庫存
exports.checkStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: '請提供需要檢查的數量'
      });
    }

    const result = await ProductPG.checkStock(req.params.id, parseInt(quantity));

    res.json({
      success: result.available,
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error('檢查庫存錯誤:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
