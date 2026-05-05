import express from 'express'
const router = express.Router()

// นำเข้า Controller ทั้งหมดที่เราเพิ่งสร้าง
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js'

// นำเข้า Middleware ป้องกัน (ยาม)
import { protect, admin } from '../middleware/authMiddleware.js'

// ----------------------------------------------------
// ผูก Route เข้ากับ Controller
// ----------------------------------------------------

// Route: /api/products
router
    .route('/')
    .get(getProducts) // ดึงสินค้าทั้งหมด (คนทั่วไป)
    .post(protect, admin, createProduct) // สร้างสินค้า (ต้องเป็น Admin)

// Route: /api/products/:id
router
    .route('/:id')
    .get(getProductById) // ดูรายละเอียดสินค้า (คนทั่วไป)
    .put(protect, admin, updateProduct) // แก้ไขสินค้า (ต้องเป็น Admin)
    .delete(protect, admin, deleteProduct) // ลบสินค้า (ต้องเป็น Admin)

export default router
