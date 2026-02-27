const { pool } = require('../../config/database');

/**
 * Create Product
 */
exports.createProduct = async (data) => {
  const sql = `
    INSERT INTO tbproduct
    (productcode, productname, shortdescription, categoryid, subcategoryid, deptid, storeid)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [
    data.productcode,
    data.productname,
    data.shortdescription,
    data.categoryid,
    data.subcategoryid,
    data.deptid,
    data.storeid
  ]);
  return rows[0];
};

/**
 * Save Product Images
 */
exports.insertProductImages = async (productId, images) => {
  for (const img of images) {
    await pool.query(
      `INSERT INTO tbproductimage (productid, imagepath)
       VALUES ($1, $2)`,
      [productId, img]
    );
  }
};

/**
 * Get Products by CategoryId with Images
 */
exports.getProductByCategoryId = async (categoryId) => {
  const sql = `
      SELECT 
          p.Productid, 
          p.Productcode, 
          p.Productname, 
          p.Shortdescription, 
          COALESCE(i.imagepath, '/images/default.jpg') AS ProductImage,  -- Use default if no image
          c.Categoryid, 
          c.Categoryname, 
          s.Subcategoryid, 
          s.Subcategoryname, 
          d.Deptid, 
          d.Deptname, 
          st.Storeid, 
          st.Storename, 
          pp.MRP, 
          pp.WholeSalePrice
      FROM tbproduct p
          LEFT JOIN tbproductprice pp 
              ON p.productid = pp.productid
          INNER JOIN tbcategory c 
              ON p.Categoryid = c.Categoryid AND c.isactive = true
          INNER JOIN tbsubcategory s 
              ON p.Subcategoryid = s.Subcategoryid AND s.isactive = true
          INNER JOIN tbdepartment d 
              ON p.Deptid = d.Deptid
          INNER JOIN tbstore st 
              ON p.Storeid = st.Storeid
          LEFT JOIN tbproductimage i 
              ON p.productid = i.productid AND i.isprimary = true AND i.isactive = true
      WHERE 
          p.isactive = true 
          AND p.delflag = false 
          AND p.Categoryid = $1
      ORDER BY p.Productname;
  `;
  const { rows } = await pool.query(sql, [categoryId]);
  return rows;
};

/**
 * Get Product Details By ProductId
 *
 * - Fetches single product details
 * - Includes pricing and related master data
 * - Returns product images as list
 *
 * @param {number} productId - Product ID
 */
exports.getProductById = async (productId) => {

   // 🔴 CHECK: productId exists
  if (!productId) {
    throw new Error('Product ID is required');
  }

  // 🔴 CHECK: productId is a number
  if (isNaN(productId)) {
    throw new Error('Invalid Product ID');
  }

  const sql = `
    SELECT
      p.Productid,
      p.Productcode,
      p.Productname,
      p.Shortdescription,
      c.Categoryid,
      c.Categoryname,
      s.Subcategoryid,
      s.Subcategoryname,
      d.Deptid,
      d.Deptname,
      st.Storeid,
      st.Storename,
      pp.MRP,
      pp.WholeSalePrice,
      COALESCE(
        json_agg(
          json_build_object(
            'productimageid', pi.productimageid,
            'imagepath', pi.imagepath,
            'isprimary', pi.isprimary
          )
        ) FILTER (WHERE pi.productimageid IS NOT NULL),
        '[]'
      ) AS images
    FROM tbproduct p
    LEFT JOIN tbproductprice pp ON p.productid = pp.productid
    LEFT JOIN tbproductimage pi ON p.productid = pi.productid
    INNER JOIN tbcategory c ON p.categoryid = c.categoryid
    INNER JOIN tbsubcategory s ON p.subcategoryid = s.subcategoryid
    INNER JOIN tbdepartment d ON p.deptid = d.deptid
    INNER JOIN tbstore st ON p.storeid = st.storeid
    WHERE p.productid = $1
      AND p.isactive = true
      AND p.delflag = false
    GROUP BY
      p.productid,
      c.categoryid,
      s.subcategoryid,
      d.deptid,
      st.storeid,
      pp.mrp,
      pp.wholesaleprice;
  `;

  const { rows } = await pool.query(sql, [productId]);
  return rows[0] || null;
};


/**
 * Update Product (like create)
 */
exports.updateProduct = async (productId, data) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update product
    const productSql = `
      UPDATE tbproduct
      SET
        productcode = $1,
        productname = $2,
        shortdescription = $3,
        categoryid = $4,
        subcategoryid = $5,
        deptid = $6,
        storeid = $7,
        modifiedon = NOW()
      WHERE productid = $8
        AND delflag = false
      RETURNING *
    `;

    const { rows } = await client.query(productSql, [
      data.productcode,
      data.productname,
      data.shortdescription,
      data.categoryid,
      data.subcategoryid,
      data.deptid,
      data.storeid,
      productId
    ]);

    if (!rows.length) {
      throw new Error('Product not found');
    }

    // Update images (delete + insert)
    if (Array.isArray(data.images)) {
      await client.query(
        `DELETE FROM tbproductimage WHERE productid = $1`,
        [productId]
      );

      for (const img of data.images) {
        await client.query(
          `INSERT INTO tbproductimage (productid, imagepath)
           VALUES ($1, $2)`,
          [productId, img]
        );
      }
    }

    await client.query('COMMIT');
    return rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Delete Product (Soft Delete)
 */
exports.deleteProduct = async (id) => {
  await pool.query(
    `UPDATE tbproduct SET delflag=true WHERE productid=$1`,
    [id]
  );
};
