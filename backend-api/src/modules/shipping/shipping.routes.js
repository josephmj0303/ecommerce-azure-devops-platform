const express = require('express');
const router = express.Router();
const controller = require('./shipping.controller');

/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: Shipping address management APIs
 */

/**
 * @swagger
 * /api/shipping:
 *   post:
 *     summary: Add new shipping address
 *     tags: [Shipping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - fullname
 *               - phone
 *               - addressline1
 *             properties:
 *               userid:
 *                 type: integer
 *                 example: 1
 *               fullname:
 *                 type: string
 *                 example: Arun Kumar
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               addressline1:
 *                 type: string
 *                 example: 12, MG Road
 *               addressline2:
 *                 type: string
 *                 example: Near Bus Stop
 *               city:
 *                 type: string
 *                 example: Chennai
 *               state:
 *                 type: string
 *                 example: Tamil Nadu
 *               postalcode:
 *                 type: string
 *                 example: "600001"
 *               country:
 *                 type: string
 *                 example: India
 *               isdefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Shipping address created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', controller.createAddress);

/**
 * @swagger
 * /api/shipping/{userid}:
 *   get:
 *     summary: Get shipping addresses by user id
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Shipping addresses fetched successfully
 *       404:
 *         description: No address found
 *       500:
 *         description: Server error
 */
router.get('/:userid', controller.getAddressByUser);

/**
 * @swagger
 * /api/shipping/{id}:
 *   put:
 *     summary: Update shipping address
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modifiedby
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Arun Kumar
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               addressline1:
 *                 type: string
 *                 example: 45, Anna Nagar
 *               addressline2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postalcode:
 *                 type: string
 *               country:
 *                 type: string
 *               isdefault:
 *                 type: boolean
 *               modifiedby:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Shipping address updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.put('/:id', controller.updateAddress);

/**
 * @swagger
 * /api/shipping/{id}:
 *   delete:
 *     summary: Delete shipping address (soft delete)
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deletedby
 *             properties:
 *               deletedby:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Shipping address deleted successfully
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', controller.deleteAddress);

module.exports = router;
