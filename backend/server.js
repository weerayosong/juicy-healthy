import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

// 1. เชื่อมต่อฐานข้อมูล
connectDB()

const port = process.env.PORT || 5000
const app = express()

// 2. ตั้งค่า CORS แบบเจาะจง (แก้ปัญหาหน้าขาว/CORS Error)
const allowedOrigins = [
    'https://juicy-healthy.vercel.app',
    'https://juicy-healthy-seven.vercel.app',
    'http://localhost:3000', // เผื่อรันเทสในเครื่อง
]

app.use(
    cors({
        origin: function (origin, callback) {
            // อนุญาตถ้า origin ตรงกับลิสต์ด้านบน หรือไม่มี origin (เช่นมาจาก Postman)
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, // อนุญาตให้ส่ง Cookie/Token ข้ามบ้านได้
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
)

// 3. Middlewares พื้นฐาน
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// 4. API Routes (จุดนี้สำคัญ ห้ามสลับลำดับกับ Error Middleware)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// API สำหรับ PayPal
app.get('/api/config/paypal', (req, res) =>
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID }),
)

// 5. จัดการไฟล์ Static (เช่น รูปภาพสินค้า)
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// 6. Route พื้นฐานสำหรับเช็คสถานะ API
app.get('/', (req, res) => {
    res.send('API is running...')
})

// 7. Error Handling Middlewares (ต้องอยู่ท้ายสุดเสมอ)
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
