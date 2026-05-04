import express from 'express'
const router = express.Router()
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/').post(protect, addOrderItems)

// วาง /mine ไว้ตรงนี้ (ต้องอยู่บน /:id)
router.route('/mine').get(protect, getMyOrders)

router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)

export default router

// ข้อควรระวังระดับ 10 กะโหลก: ต้องวาง Route /mine ไว้เหนือ Route /:id เสมอ! ไม่งั้น Express จะสับสน คิดว่าคำว่า "mine" คือ "id" ของออเดอร์ (มองเป็น /api/orders/id) แล้วระบบจะพัง
