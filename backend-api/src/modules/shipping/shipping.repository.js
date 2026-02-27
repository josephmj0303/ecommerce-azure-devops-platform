const { pool } = require('../../config/database');

/**
 * Shipping Address Repository
 *
 * - Handles database operations for shipping addresses
 * - Only responsible for DB queries
 */

/**
 * Create Shipping Address
 *
 * - Inserts a new shipping address for a user
 * - @param {Object} data - { userid, fullname, phone, addressline1, city }
 * @returns {Object} Created address
 */
exports.createAddress = async (data) => {
  const sql = `
    INSERT INTO tbshippingaddress (
      userid,
      fullname,
      phone,
      addressline1,
      addressline2,
      city,
      state,
      postalcode,
      country,
      isdefault,
      isactive,
      createdby,
      createdon,
      delflag,
      modifiedby,
      deletedby
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9,
      $10,
      true,
      $11,
      NOW(),
      0,
      0,
      0
    )
    RETURNING *;
  `;

  const { rows } = await pool.query(sql, [
    data.userid,
    data.fullname,
    data.phone,
    data.addressline1,
    data.addressline2,
    data.city,
    data.state,
    data.postalcode,
    data.country,
    data.isdefault,      // ✅ now used
    data.userid          // createdby
  ]);

  return rows[0];
};


/**
 * Get Addresses By User
 *
 * - Fetches all active shipping addresses for a user
 * - @param {number} userid - User ID
 * @returns {Array} List of addresses
 */
exports.getAddressByUser = async (userid) => {
  const { rows } = await pool.query(
    `SELECT 
        addressid,
        userid,
        fullname,
        phone,
        addressline1,
        addressline2,
        city,
        state,
        postalcode,
        country
      FROM tbshippingaddress
      WHERE userid = $1 AND delflag = 0 AND isactive = true 
      ORDER BY addressid DESC`,
    [userid]
  );
  return rows;
};

/**
 * Update Shipping Address
 *
 * - Updates address details by address ID
 * - @param {number} id - Address ID
 * - @param {Object} data - { fullname, phone, addressline1, city }
 * @returns {Object} Updated address
 */
exports.updateAddress = async (id, data) => {
  const sql = `
      UPDATE tbshippingaddress
      SET fullname = $1,
          phone = $2,
          addressline1 = $3,
          addressline2 = $4,
          city = $5,
          state = $6,
          postalcode = $7,
          country = $8,
          isdefault = $9,
          modifiedon = NOW()
      WHERE addressid = $10
      RETURNING *;
    `;

    const values = [
      data.fullname,
      data.phone,
      data.addressline1,
      data.addressline2,
      data.city,
      data.state,
      data.postalcode,
      data.country,
      data.isdefault,
      id
    ];

    // ✅ LOG
    console.log('SQL:', sql);
    console.log('VALUES:', values);
    const { rows } = await pool.query(sql, values);
    return rows[0];

};

/**
 * Delete Shipping Address (Soft Delete)
 *
 * - Marks address as deleted (delflag = 1)
 * - @param {number} id - Address ID
 */
exports.deleteAddress = async (id) => {
  await pool.query(
    `UPDATE tbshippingaddress SET delflag = 1 WHERE addressid = $1`,
    [id]
  );
};
