import cors from 'cors'
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const port = process.env.PORT || 5000
connectDB()
const app = express()

// ตั้งค่า CORS แบบจัดเต็มเพื่อให้ Vercel คุยกับ Render ได้
app.use(
    cors({
        origin: 'https://juicy-healthy.vercel.app',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, // สำคัญมาก! เพื่อให้ส่ง Cookie/Token ข้ามบ้านได้
    }),
)

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

const __dirname = path.resolve()
// ชี้ไปที่โฟลเดอร์ uploads ที่อยู่ Root นอกสุด
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
