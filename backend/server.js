import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import connectDB from './config/db.js'

// นำเข้า Routes
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const port = process.env.PORT || 5000

// 1. ย้ายการต่อ DB มาไว้ในจุดที่ปลอดภัย
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// API Routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID }),
)

// 2. ปรับการตั้งค่า Path ให้รองรับทั้งในเครื่องและ Vercel
const __dirname = path.resolve()
// ใช้การเช็คโฟลเดอร์แบบสัมพัทธ์ที่ปลอดภัยกว่า
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.use(notFound)
app.use(errorHandler)

// 3. ส่งออก app ทันทีเพื่อให้ Vercel จัดการ
export default app

// Listen เฉพาะตอนรันในคอม (Local)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server running on port ${port}`))
}
