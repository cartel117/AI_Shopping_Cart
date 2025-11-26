const pool = require('../config/database');

class ProductPG {
  // 取得所有商品
  static async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM products WHERE 1=1';
      const values = [];
      let paramCount = 1;

      // 篩選條件
      if (filters.status) {
        query += ` AND status = $${paramCount}`;
        values.push(filters.status);
        paramCount++;
      }

      if (filters.minPrice) {
        query += ` AND price >= $${paramCount}`;
        values.push(filters.minPrice);
        paramCount++;
      }

      if (filters.maxPrice) {
        query += ` AND price <= $${paramCount}`;
        values.push(filters.maxPrice);
        paramCount++;
      }

      if (filters.search) {
        query += ` AND name ILIKE $${paramCount}`;
        values.push(`%${filters.search}%`);
        paramCount++;
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`取得商品列表失敗: ${error.message}`);
    }
  }

  // 根據 ID 取得單一商品
  static async getById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`取得商品失敗: ${error.message}`);
    }
  }

  // 建立新商品
  static async create(productData) {
    const { name, description, price, stock_quantity, image_path, status } = productData;
    try {
      const result = await pool.query(
        `INSERT INTO products (name, description, price, stock_quantity, image_path, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, description, price, stock_quantity || 0, image_path, status || 'active']
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`建立商品失敗: ${error.message}`);
    }
  }

  // 更新商品
  static async update(id, productData) {
    const { name, description, price, stock_quantity, image_path, status } = productData;
    try {
      const result = await pool.query(
        `UPDATE products 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             price = COALESCE($3, price),
             stock_quantity = COALESCE($4, stock_quantity),
             image_path = COALESCE($5, image_path),
             status = COALESCE($6, status),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [name, description, price, stock_quantity, image_path, status, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`更新商品失敗: ${error.message}`);
    }
  }

  // 更新庫存
  static async updateStock(id, quantity, operation = 'set') {
    try {
      let query;
      if (operation === 'increment') {
        query = `UPDATE products 
                 SET stock_quantity = stock_quantity + $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2
                 RETURNING *`;
      } else if (operation === 'decrement') {
        query = `UPDATE products 
                 SET stock_quantity = GREATEST(0, stock_quantity - $1),
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2
                 RETURNING *`;
      } else {
        query = `UPDATE products 
                 SET stock_quantity = $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2
                 RETURNING *`;
      }

      const result = await pool.query(query, [quantity, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`更新庫存失敗: ${error.message}`);
    }
  }

  // 刪除商品（軟刪除）
  static async delete(id) {
    try {
      const result = await pool.query(
        `UPDATE products 
         SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`刪除商品失敗: ${error.message}`);
    }
  }

  // 永久刪除商品
  static async hardDelete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`永久刪除商品失敗: ${error.message}`);
    }
  }

  // 檢查庫存是否足夠
  static async checkStock(id, requiredQuantity) {
    try {
      const product = await this.getById(id);
      if (!product) {
        return { available: false, message: '商品不存在' };
      }
      if (product.stock_quantity < requiredQuantity) {
        return { 
          available: false, 
          message: `庫存不足，目前庫存: ${product.stock_quantity}` 
        };
      }
      return { available: true, currentStock: product.stock_quantity };
    } catch (error) {
      throw new Error(`檢查庫存失敗: ${error.message}`);
    }
  }
}

module.exports = ProductPG;
