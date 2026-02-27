const { pool } = require('../../config/database');

/**
 * ---------------------------------------------------------------------------
 * CATEGORY GROUP DATA ACCESS LAYER
 * ---------------------------------------------------------------------------
 * Handles CRUD operations for Category Groups.
 */

/**
 * Create a new Category Group
 *
 * @param {Object} data
 * @param {string} data.groupname
 * @param {string} [data.imagepath]
 * @param {number} data.createdby
 * @param {number} data.modifiedby
 * @returns {Promise<Object>} Newly created category group
 */
exports.createCategoryGroup = async (data) => {
  const imagepath =
    data.imagepath?.trim() ||
    'content/categorygroup/1/1-general-books.png';
  const createdby = data.createdby;
  const sql = `
    INSERT INTO tbcategorygroup (
      groupname,
      imagepath,
      isactive,
      createdby,
      modifiedby
    )
    VALUES (
      $1,
      $2,
      true,
      $3,
      $3
    )
    RETURNING
      groupid   AS "groupId",
      groupname AS "groupName",
      imagepath AS "imagePath";
  `;
  const values = [
    data.groupname,
    imagepath,
    createdby
  ];
  const { rows } = await pool.query(sql, values);
  return rows[0];
};


/**
 * Get all active Category Groups
 *
 * @returns {Promise<Array>} List of category groups with active category count
 */
exports.getAllCategoryGroups = async () => {
  const sql = `
    SELECT
        g.groupid,
        g.groupname,
        g.imagepath,
        COUNT(c.categoryid) AS activecategorycount
    FROM tbcategorygroup g
    LEFT JOIN tbcategory c
           ON c.groupid = g.groupid
          AND c.isactive = true
          AND c.delflag = 0
    WHERE g.isactive = true
      AND g.delflag = false
    GROUP BY g.groupid, g.groupname, g.imagepath
    ORDER BY g.groupname;
  `;

  const { rows } = await pool.query(sql);
  return rows;
};

/**
 * Get Category Group by ID
 *
 * @param {number} groupId
 * @returns {Promise<Object>} Category group details
 */
exports.getCategoryGroupById = async (groupId) => {
  const sql = `
    SELECT
        g.groupid,
        g.groupname,
        g.imagepath,
        COUNT(c.categoryid) AS activecategorycount
    FROM tbcategorygroup g
    LEFT JOIN tbcategory c
           ON c.groupid = g.groupid
          AND c.isactive = true
          AND c.delflag = 0
    WHERE g.isactive = true
      AND g.delflag = false
      AND g.groupid = $1
    GROUP BY g.groupid, g.groupname, g.imagepath
    ORDER BY g.groupname;
  `;

  const { rows } = await pool.query(sql, [groupId]);
  return rows[0];
};

/**
 * Update Category Group
 *
 * @param {number} groupId
 * @param {Object} data
 * @param {string} data.groupname
 * @param {string} data.imagepath
 * @param {number} data.modifiedby
 * @returns {Promise<Object>} Updated category group
 */
exports.updateCategoryGroup = async (groupId, data) => {
  const sql = `
    UPDATE tbcategorygroup
    SET groupname  = $1,
        imagepath  = $2,
        modifiedby = $3,
        modifiedon = NOW()
    WHERE groupid = $4
    RETURNING groupid, groupname, imagepath;
  `;

  const { rows } = await pool.query(sql, [
    data.groupname,
    data.imagepath,
    data.modifiedby,
    groupId
  ]);

  return rows[0];
};

/**
 * Soft delete Category Group
 *
 * @param {number} groupId
 * @param {number} deletedBy
 * @returns {Promise<void>}
 */
exports.deleteCategoryGroup = async (groupId, deletedBy) => {
  const sql = `
    UPDATE tbcategorygroup
    SET delflag   = true,
        isactive  = false,
        deletedby = $1,
        deletedon = NOW()
    WHERE groupid = $2;
  `;
  await pool.query(sql, [deletedBy, groupId]);
};
