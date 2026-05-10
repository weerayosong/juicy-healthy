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

// 1. เชื่อมต่อฐานข้อมูล MongoDB
connectDB()

const port = process.env.PORT || 5000
const app = express()

// 2. ตั้งค่า CORS
app.use(
    cors({
        origin: 'https://juicy-healthy.vercel.app', // URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, // อนุญาตให้ส่ง Cookie/Token ข้ามบ้านได้
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
)

// 3. Middlewares สำหรับจัดการข้อมูล
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// 4. API Routes (ท่อส่งข้อมูลหลัก)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// API สำหรับระบบชำระเงิน PayPal
app.get('/api/config/paypal', (req, res) =>
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID }),
)

// 5. จัดการโฟลเดอร์รูปภาพสินค้า (Uploads)
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// 6. Route พื้นฐานเช็คสถานะ API
app.get('/', (req, res) => {
    res.send('API is running...')
})

// 7. Error Middleware (ต้องอยู่ท้ายสุดเสมอ)
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
