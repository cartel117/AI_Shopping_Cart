-- ============================================
-- 商品管理系統 - 資料庫 Schema
-- 方案 A：簡單版（庫存在商品表內）
-- ============================================

-- 先刪除舊的 products 表（如果存在）
DROP TABLE IF EXISTS products CASCADE;

-- 商品表（包含庫存）
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_path VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_name ON products(name);

-- ============================================
-- 觸發器函數：自動更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為 products 表建立觸發器
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();



-- ============================================
-- 測試資料
-- ============================================

-- 插入商品資料
INSERT INTO products (name, description, price, stock_quantity, status) VALUES
('iPhone 15 Pro', '最新款 iPhone，配備 A17 Pro 晶片，鈦金屬設計', 35900, 50, 'active'),
('MacBook Pro 14"', 'M3 Pro 晶片，16GB RAM，512GB SSD', 69900, 20, 'active'),
('AirPods Pro 2', '主動降噪無線耳機，USB-C 充電', 7990, 100, 'active'),
('iPad Air', 'M2 晶片，11 吋 Liquid Retina 顯示器', 19900, 30, 'active'),
('Apple Watch Series 9', 'GPS + 行動網路，45mm', 15900, 40, 'active');

-- ============================================
-- 驗證查詢
-- ============================================

-- 查看所有商品及庫存
SELECT 
    id,
    name,
    price,
    stock_quantity,
    status,
    created_at
FROM products
ORDER BY created_at DESC;
