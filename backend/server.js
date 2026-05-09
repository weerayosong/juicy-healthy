import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import connectDB from './config/db.js'
// นำเข้า Routes ต่างๆ
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
// นำเข้า Error Middleware ที่เพิ่งสร้าง
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const port = process.env.PORT || 5000

connectDB()

const app = express()

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser middleware
app.use(cookieParser())

// ผูก Routes ต่างๆ
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID }),
)

// ตั้งค่าโฟลเดอร์ uploads ให้เปิดแบบ Public
const __dirname = path.resolve()
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Deploy setup1: ให้ Backend ดึงไฟล์หน้าบ้าน (Frontend) มาโชว์ตอนอยู่บน Vercel
if (process.env.NODE_ENV === 'production') {
    // ให้เข้าถึงไฟล์ที่ Build เสร็จแล้วในโฟลเดอร์ frontend/dist
    app.use(express.static(path.join(__dirname, '/frontend/dist')))

    // ถ้าพิมพ์ URL หน้าเว็บอื่นๆ ให้โยนไปที่ไฟล์ index.html เสมอ
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')),
    )
} else {
    // ถ้าเพิ่งเปิด dev ในคอมเรา ให้โชว์ข้อความปกติ
    app.get('/', (req, res) => {
        res.send('API is running...')
    })
}

// วางตาข่ายดักจับ Error ไว้ "ล่างสุด" เสมอ (ต้องอยู่ใต้ Routes ทั้งหมด)
app.use(notFound)
app.use(errorHandler)

// Deploy setup2: ปรับเงื่อนไขการ Listen Port ให้ทำงานเฉพาะตอนเทสในคอม
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server running on port ${port}`))
}

// for local test
// app.listen(port, () => console.log(`Server running on port ${port}`))

// Deploy setup3: ส่งออก app ให้ Vercel เอาไปเป็น Serverless Function
export default app

// 1. เบราว์เซอร์เคาะประตู (The Request): ตอนที่พิมพ์ http://localhost:5000/api/products เบราว์เซอร์ได้ส่งคำสั่งประเภท GET ไปหาเซิร์ฟเวอร์ Express ที่หลังบ้าน (พอร์ต 5000)
// 2. Express รับเรื่องและส่งต่อ (The Router): ไฟล์ server.js เห็นว่ามีคนเรียก URL นี้ เลยบอกว่า "อ๋อ เส้นทางนี้ฉันฝากให้ productRoutes.js จัดการแล้ว" แล้วโยนงานให้
// 3. Mongoose ค้นหาข้อมูล (The Query): ใน Route เรามีโค้ดคำสั่ง await Product.find({}) โค้ดบรรทัดนี้แหละ มันจะทำหน้าที่วิ่งไปหา MongoDB แล้วบอกว่า "ขอข้อมูลสินค้าทั้งหมดที่มีใน Collection หน่อย!"
// 4. MongoDB คายข้อมูล (The Database): ฐานข้อมูลรับทราบคำสั่ง จึงจัดการหยิบสินค้า Juicy Healthy ทั้ง 48 รายการ ส่งกลับมาให้ Mongoose ในรูปแบบ Object ของ JavaScript
// 5. Express แปลงร่างและส่งกลับ (The Response): เมื่อได้ข้อมูลมาแล้ว คำสั่ง res.json(products) จะนำ Object ทั้งหมดมาแปลงร่างให้อยู่ในรูปแบบ JSON (JavaScript Object Notation) ซึ่งเปรียบเสมือน "ภาษากลาง" ที่ระบบไหนๆ ในโลกก็อ่านเข้าใจ แล้วยิงกลับไปแสดงผลที่เบราว์เซอร์
