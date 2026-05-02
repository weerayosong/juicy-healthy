import express from 'express'
const router = express.Router()
import Product from '../models/productModel.js'

// @desc    ดึงข้อมูลสินค้าทั้งหมด
// @route   GET /api/products
// @access  Public (ใครก็ดึงได้)
router.get('/', async (req, res) => {
    try {
        // .find({}) คือคำสั่ง Mongoose ให้ดึงข้อมูลมาทั้งหมด
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        res.status(500).json({
            message: 'Server Error: ไม่สามารถดึงข้อมูลสินค้าได้',
        })
    }
})

// @desc    ดึงข้อมูลสินค้าแค่ชิ้นเดียว (ตาม ID)
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // .findById() คือดึงข้อมูลตาม ID ที่ส่งมาใน URL
        const product = await Product.findById(req.params.id)

        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Not found product' })
        }
    } catch (error) {
        res.status(404).json({ message: 'ID type not correct' })
    }
})

export default router
