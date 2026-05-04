import express from 'express'
const router = express.Router()
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders, // นำเข้าฟังก์ชันของ Admin
    updateOrderToDelivered, // นำเข้าฟังก์ชันของ Admin
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js' // อย่าลืม import admin มาด้วย

// ปรับ Route '/' ให้รับ GET requests จาก Admin ได้ด้วย
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)

router.route('/mine').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)

// เพิ่ม Route สำหรับอัปเดตสถานะจัดส่ง (Admin Only)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

export default router

// ข้อควรระวังระดับ 10 กะโหลก: ต้องวาง Route /mine ไว้เหนือ Route /:id เสมอ! ไม่งั้น Express จะสับสน คิดว่าคำว่า "mine" คือ "id" ของออเดอร์ (มองเป็น /api/orders/id) แล้วระบบจะพัง
