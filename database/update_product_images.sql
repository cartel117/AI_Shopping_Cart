-- ============================================
-- 更新商品圖片（使用網路圖片 URL）
-- ============================================

-- 更新 iPhone 15 Pro 圖片
UPDATE products 
SET image_path = 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692846702945'
WHERE name = 'iPhone 15 Pro';

-- 更新 MacBook Pro 14" 圖片
UPDATE products 
SET image_path = 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202'
WHERE name = 'MacBook Pro 14"';

-- 更新 AirPods Pro 2 圖片
UPDATE products 
SET image_path = 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361'
WHERE name = 'AirPods Pro 2';

-- 更新 iPad Air 圖片
UPDATE products 
SET image_path = 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/ipad-air-finish-select-gallery-202211-blue-wifi?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1670864735655'
WHERE name = 'iPad Air';

-- 更新 Apple Watch Series 9 圖片
UPDATE products 
SET image_path = 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/watch-s9-lte-aluminum-midnight-45mm-sport-band-midnight-c2023?wid=5120&hei=3280&fmt=p-jpg&qlt=80&.v=1692844974486'
WHERE name = 'Apple Watch Series 9';

-- ============================================
-- 驗證更新
-- ============================================
SELECT 
    id,
    name,
    image_path,
    updated_at
FROM products
ORDER BY id;
