const { pool } = require('../../config/database');


/**
 * Get Products by CategoryId with Images
 */
exports.getFlashSaleProducts = async () => {
  const sql = `
    WITH today_orders AS (
      SELECT 
          oi.productid,
          p.productname,
          p.productcode,
          COALESCE(i.imagepath, '/images/default.jpg') AS productimage,
		  cg.groupid,
		  cg.groupname,
          c.categoryid,
          c.categoryname,
          s.subcategoryid,
          s.subcategoryname,
          d.deptid,
          d.deptname,
          st.storeid,
          st.storename,
          pp.mrp,
          pp.wholesaleprice,
          SUM(oi.quantity) AS total_sold
      FROM tborderitem oi
      INNER JOIN tborder o ON oi.orderid = o.orderid
      INNER JOIN tbproduct p ON oi.productid = p.productid
      LEFT JOIN tbproductprice pp ON p.productid = pp.productid
      INNER JOIN tbcategory c ON p.categoryid = c.categoryid AND c.isactive = true
	  INNER JOIN tbcategorygroup cg ON c.groupid = cg.groupid AND cg.isactive = true
      INNER JOIN tbsubcategory s ON p.subcategoryid = s.subcategoryid AND s.isactive = true
      INNER JOIN tbdepartment d ON p.deptid = d.deptid
      INNER JOIN tbstore st ON p.storeid = st.storeid
      LEFT JOIN tbproductimage i ON p.productid = i.productid AND i.isprimary = true AND i.isactive = true
      WHERE 
          o.orderdate::date = CURRENT_DATE
          AND p.isactive = true
          AND p.delflag = false
      GROUP BY oi.productid, p.productname, p.productcode, i.imagepath,
	  		   cg.groupid, cg.groupname,
               c.categoryid, c.categoryname,
               s.subcategoryid, s.subcategoryname,
               d.deptid, d.deptname,
               st.storeid, st.storename,
               pp.mrp, pp.wholesaleprice
    ),
    fallback_products AS (
      SELECT *
      FROM (
        SELECT 
          p.productid,
          p.productname,
          p.productcode,
          COALESCE(i.imagepath, '/images/default.jpg') AS productimage,
		  cg.groupid,
		  cg.groupname,
          c.categoryid,
          c.categoryname,
          s.subcategoryid,
          s.subcategoryname,
          d.deptid,
          d.deptname,
          st.storeid,
          st.storename,
          pp.mrp,
          pp.wholesaleprice,
          ROW_NUMBER() OVER (PARTITION BY cg.groupid ORDER BY cg.groupname) AS rn
        FROM tbproduct p
        LEFT JOIN tbproductprice pp ON p.productid = pp.productid
        INNER JOIN tbcategory c ON p.categoryid = c.categoryid AND c.isactive = true
		INNER JOIN tbcategorygroup cg ON c.groupid = cg.groupid AND cg.isactive = true
        INNER JOIN tbsubcategory s ON p.subcategoryid = s.subcategoryid AND s.isactive = true
        INNER JOIN tbdepartment d ON p.deptid = d.deptid
        INNER JOIN tbstore st ON p.storeid = st.storeid
        LEFT JOIN tbproductimage i ON p.productid = i.productid AND i.isprimary = true AND i.isactive = true
        WHERE p.isactive = true AND p.delflag = false 
      ) t
      WHERE rn <= 5
    )
    SELECT *
    FROM today_orders
    UNION ALL
    SELECT *
    FROM fallback_products
    WHERE NOT EXISTS (SELECT 1 FROM today_orders)
    ORDER BY productname;
  `;

  const { rows } = await pool.query(sql, []);
  return rows;
};
