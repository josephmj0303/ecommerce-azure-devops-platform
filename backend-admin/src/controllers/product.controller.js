// ...existing code...
const fs = require('fs');
const path = require('path');
const { pool } = require("../config/db");

// helper to coerce numbers from string form-data
const toNumber = v => (v === undefined || v === '' ? null : Number(v));

const createProduct = async (req, res) => {
  console.log('createProduct function called');
  console.log('Request body:', req.body);
  console.log('Files:', req.files);

  try {
    const body = req.body || {};
    const {
      category_id,
      name,
      description,
      sellingPrice,
      stock,
      productFormat,
      author,
      series,
      level,
      language,
      edition,
      mrp,
      created_by
    } = body;

    // support images coming from multipart (req.files) or JSON array in body.images
    let images = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      // use file paths relative to uploads directory; adjust as needed
      images = req.files.map(f => f.path || f.filename);
    } else if (body.images) {
      try {
        images = typeof body.images === 'string' ? JSON.parse(body.images) : body.images;
      } catch (e) {
        images = Array.isArray(body.images) ? body.images : [];
      }
    }

    const insertProductQuery = `
      INSERT INTO products
      (category_id, name, description, sellingprice, stock, productformat, author, series, level, language, edition, mrp, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      toNumber(category_id),
      name || null,
      description || null,
      toNumber(sellingPrice),
      toNumber(stock),
      productFormat || null,
      author || null,
      series || null,
      level || null,
      language || null,
      edition || null,
      toNumber(mrp),
    ];

    const result = await pool.query(insertProductQuery, values);
    const createdProduct = result.rows[0];

    let insertedImages = [];
    if (Array.isArray(images) && images.length > 0) {
      // Build parameterized multi-row INSERT
      // valuesForImages = [productId, img1, createdBy1, img2, createdBy2, ...]
      const valuesForImages = [createdProduct.product_id];
      const placeholders = [];

      images.forEach((imgPath, i) => {
        const imgIndex = 2 + i * 2; // placeholder index for image_path
        const createdByIndex = imgIndex + 1; // placeholder index for created_by
        placeholders.push(`($1, $${imgIndex}, $${createdByIndex}, NOW(), NOW())`);
        valuesForImages.push(imgPath, created_by ? toNumber(created_by) : null);
      });

      const insertImagesQuery = `
        INSERT INTO product_images (product_id, image_path, created_by, created_at, updated_at)
        VALUES ${placeholders.join(', ')}
        RETURNING *;
      `;

      const imagesResult = await pool.query(insertImagesQuery, valuesForImages);
      insertedImages = imagesResult.rows;
    }

    res.status(200).json({
      message: "Product Created Successfully",
      success: true,
      response: createdProduct,
      images: insertedImages
    });
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const query = `
      SELECT
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'image_path', pi.image_path,
              'created_by', pi.created_by,
              'updated_by', pi.updated_by,
              'created_at', pi.created_at,
              'updated_at', pi.updated_at
            )
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.product_id
      GROUP BY p.product_id
      ORDER BY p.product_id DESC;
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'image_path', pi.image_path,
              'created_by', pi.created_by,
              'updated_by', pi.updated_by,
              'created_at', pi.created_at,
              'updated_at', pi.updated_at
            )
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.product_id
      WHERE p.product_id = $1
      GROUP BY p.product_id;
    `;
    const values = [id];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const body = req.body || {};
    const {
      category_id,
      name,
      description,
      sellingPrice,
      stock,
      productFormat,
      author,
      series,
      level,
      language,
      edition,
      mrp,
      updated_by
    } = body;

    // collect images from multipart or body.images
    let images = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      images = req.files.map(f => f.path || f.filename);
    } else if (body.images) {
      try {
        images = typeof body.images === 'string' ? JSON.parse(body.images) : body.images;
      } catch (e) {
        images = Array.isArray(body.images) ? body.images : [];
      }
    }

    await client.query('BEGIN');

    const updateQuery = `
      UPDATE products
      SET 
        category_id = $1,
        name = $2,
        description = $3,
        sellingprice = $4,
        stock = $5,
        productformat = $6,
        author = $7,
        series = $8,
        level = $9,
        language = $10,
        edition = $11,
        mrp = $12,
        updated_at = NOW()
      WHERE id = $13
      RETURNING *;
    `;

    const values = [
      toNumber(category_id),
      name || null,
      description || null,
      toNumber(sellingPrice),
      toNumber(stock),
      productFormat || null,
      author || null,
      series || null,
      level || null,
      language || null,
      edition || null,
      toNumber(mrp),
      id
    ];

    const updateResult = await client.query(updateQuery, values);
    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Product not found" });
    }

    let insertedImages = [];
    if (Array.isArray(images)) {
      await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);

      if (images.length > 0) {
        const valuesForImages = [id];
        const placeholders = [];

        images.forEach((imgPath, i) => {
          const imgIndex = 2 + i * 2;
          const createdByIndex = imgIndex + 1;
          placeholders.push(`($1, $${imgIndex}, $${createdByIndex}, NOW(), NOW())`);
          valuesForImages.push(imgPath, updated_by ? toNumber(updated_by) : null);
        });

        const insertImagesQuery = `
          INSERT INTO product_images (product_id, image_path, created_by, created_at, updated_at)
          VALUES ${placeholders.join(', ')}
          RETURNING *;
        `;
        const imagesResult = await client.query(insertImagesQuery, valuesForImages);
        insertedImages = imagesResult.rows;
      }
    }

    await client.query('COMMIT');

    // return updated product with images
    const finalQuery = `
      SELECT p.*, COALESCE(json_agg(json_build_object(
        'id', pi.id, 'image_path', pi.image_path, 'created_by', pi.created_by, 'updated_by', pi.updated_by, 'created_at', pi.created_at, 'updated_at', pi.updated_at
      )) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id;
    `;
    const finalResult = await pool.query(finalQuery, [id]);

    res.status(200).json({
      message: "Product Updated Successfully",
      success: true,
      response: finalResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('updateProduct error:', error);
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

const deleteProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');

    await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);
    const deleteProductQuery = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await client.query(deleteProductQuery, [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Product not found" });
    }

    await client.query('COMMIT');
    res.status(200).json({ message: "Product and related images deleted successfully", success: true });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('deleteProduct error:', error);
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
// ...existing code...