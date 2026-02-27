const { pool } = require('../../config/database');

/**
 * Category Repository
 *
 * - Handles database operations for category
 * - Uses parameterized queries
 */

/**
 * CREATE Category
 */
exports.createCategory = async (data) => {
  const sql = `
    INSERT INTO tbcategory
      (categoryname, groupid, isactive, delflag)
    VALUES ($1, $2, true, 0)
    RETURNING categoryid, categoryname;
  `;
  const { rows } = await pool.query(sql, [
    data.categoryname,
    data.groupid
  ]);
  return rows[0];
};

/**
 * READ Categories By GroupId
 */
exports.getCategoriesByGroupId = async (groupId) => {
  const sql = `
    SELECT c.categoryid,
           c.categoryname,
           COUNT(p.productid) AS availableproductcount
    FROM tbcategory c
    LEFT JOIN tbproduct p
      ON p.categoryid = c.categoryid
     AND p.isactive = true
     AND p.delflag = false
    WHERE c.groupid = $1
      AND c.isactive = true
      AND c.delflag = 0
    GROUP BY c.categoryid, c.categoryname
    ORDER BY c.categoryname;
  `;
  const { rows } = await pool.query(sql, [groupId]);
  return rows;
};

/**
 * Get Category By CategoryId
 *
 * - Fetches single active category by CategoryId
 * - Returns category details with available product count
 *
 * @param {number} categoryId - Category ID
 */
exports.getCategoriesByCategoryId = async (categoryId) => {
  const sql = `
    SELECT c.categoryid,
           c.categoryname,
           COUNT(p.productid) AS availableproductcount
    FROM tbcategory c
    LEFT JOIN tbproduct p
      ON p.categoryid = c.categoryid
     AND p.isactive = true
     AND p.delflag = false
    WHERE c.categoryid = $1
      AND c.isactive = true
      AND c.delflag = 0
    GROUP BY c.categoryid, c.categoryname;
  `;

  const { rows } = await pool.query(sql, [categoryId]);
  return rows[0];
};


/**
 * UPDATE Category
 */
exports.updateCategory = async (id, data) => {
  const sql = `
    UPDATE tbcategory
    SET categoryname = $1,
        modifiedon = NOW()
    WHERE categoryid = $2
    RETURNING categoryid, categoryname;
  `;
  const { rows } = await pool.query(sql, [
    data.categoryname,
    id
  ]);
  return rows[0];
};

/**
 * DELETE Category (Soft Delete)
 */
exports.deleteCategory = async (id) => {
  await pool.query(
    `UPDATE tbcategory SET delflag = 1 WHERE categoryid = $1`,
    [id]
  );
};
