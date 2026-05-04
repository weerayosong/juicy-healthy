import express from 'express'
const router = express.Router()
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid, // ดึงฟังก์ชันใหม่เข้ามา
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/').post(protect, addOrderItems)
router.route('/:id').get(protect, getOrderById)
// เพิ่มเส้นทางสำหรับรับการจ่ายเงิน (ต้องเป็น .put ตามที่ FE ยิงมา)
router.route('/:id/pay').put(protect, updateOrderToPaid)

export default router
