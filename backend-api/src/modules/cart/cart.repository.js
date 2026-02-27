const { pool } = require('../../config/database');

/**
 * Add to Cart
 * - If product exists for user → update qty
 * - Else → insert new cart row
 */
exports.addToCart = async (data) => {
  const { userid, productid, qty, createdby } = data;

  const checkSql = `
    SELECT cartid, qty
    FROM tbcart
    WHERE userid = $1
      AND productid = $2
      AND delflag = 0
  `;

  const { rows } = await pool.query(checkSql, [userid, productid]);

  if (rows.length > 0) {
    const updateSql = `
      UPDATE tbcart
      SET qty = qty + $1,
          modifiedby = $2,
          modifiedon = NOW()
      WHERE cartid = $3
      RETURNING *
    `;
    const result = await pool.query(updateSql, [
      qty,
      createdby,
      rows[0].cartid
    ]);
    return result.rows[0];
  }

  const insertSql = `
    INSERT INTO tbcart
      (userid, productid, qty, createdby, createdon, delflag, modifiedby, deletedby)
    VALUES
      ($1, $2, $3, $4, NOW(), 0, 0, 0)
    RETURNING *
  `;

  const result = await pool.query(insertSql, [
    userid,
    productid,
    qty,
    createdby
  ]);

  return result.rows[0];
};

exports.getCartByUserId = async (userid) => {
  const sql = `
    SELECT
      c.cartid,
      c.qty,
      p.productid,
      p.productname,
      pp.mrp,
      pp.wholesaleprice,
      json_build_object(
        'productimageid', pi.productimageid,
        'imagepath', pi.imagepath,
        'isprimary', pi.isprimary
      ) AS images
    FROM tbcart c
    JOIN tbproduct p 
      ON p.productid = c.productid
    LEFT JOIN tbproductprice pp 
      ON pp.productid = p.productid
    LEFT JOIN (
      SELECT DISTINCT ON (productid)
        productid,
        productimageid,
        imagepath,
        isprimary
      FROM tbproductimage
      ORDER BY productid, isprimary DESC, productimageid
    ) pi
      ON pi.productid = p.productid
    WHERE c.userid = $1
      AND c.delflag = 0;
  `;

  const { rows } = await pool.query(sql, [userid]);
  return rows;
};


/**
 * Update Cart Quantity
 */
exports.updateCartQty = async (cartid, qty, modifiedby) => {
  const sql = `
    UPDATE tbcart
    SET qty = $1,
        modifiedby = $2,
        modifiedon = NOW()
    WHERE cartid = $3
      AND delflag = 0
    RETURNING *
  `;

  const { rows } = await pool.query(sql, [
    qty,
    modifiedby,
    cartid
  ]);

  return rows[0];
};

exports.updateCartBulk = async (items, modifiedby) => {
  const client = await pool.connect();

  console.log("updateCartBulk");
  try {
    await client.query('BEGIN');

    for (const item of items) {
      if (!item.cartid || item.qty < 1) continue;

      await client.query(
        `
        UPDATE tbcart
        SET
          qty = $1,
          modifiedby = $2,
          modifiedon = NOW()
        WHERE cartid = $3
          AND delflag = 0
        `,
        [item.qty, modifiedby, item.cartid]
      );
    }

    await client.query('COMMIT');
    return true;

  } catch (err) {
    await client.query('ROLLBACK');
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
};


/**
 * Delete Cart Item (Soft Delete)
 */
exports.deleteCartItem = async (cartid, deletedby) => {
  const sql = `
    UPDATE tbcart
    SET delflag = 1,
        deletedby = $1,
        deletedon = NOW()
    WHERE cartid = $2
  `;
  await pool.query(sql, [deletedby, cartid]);
};
