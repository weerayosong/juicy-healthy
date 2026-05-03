import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js' // อย่าลืม!! ต้องใส่ .js เพราะระบุ "type": "module" ไว้
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

// เชื่อมต่อฐานข้อมูล
connectDB()

const app = express()
const port = process.env.PORT || 5000

// Body Parser middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie Parser เปิดใช้งานให้ Express อ่านคุกกี้ได้
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Juicy Healthy API is running...')
})

// บอกให้ Express 'useใช้งาน' productRoutes เมื่อเรียก URL ที่ขึ้นต้นด้วย /api/products
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes) // เปิดใช้เส้น ยูเซอร์ ด้วย

app.listen(port, () => {
    console.log(
        `Server is running in ${process.env.NODE_ENV} mode on port ${port}`,
    )
})

// 1. เบราว์เซอร์เคาะประตู (The Request): ตอนที่พิมพ์ http://localhost:5000/api/products เบราว์เซอร์ได้ส่งคำสั่งประเภท GET ไปหาเซิร์ฟเวอร์ Express ที่หลังบ้าน (พอร์ต 5000)
// 2. Express รับเรื่องและส่งต่อ (The Router): ไฟล์ server.js เห็นว่ามีคนเรียก URL นี้ เลยบอกว่า "อ๋อ เส้นทางนี้ฉันฝากให้ productRoutes.js จัดการแล้ว" แล้วโยนงานให้
// 3. Mongoose ค้นหาข้อมูล (The Query): ใน Route เรามีโค้ดคำสั่ง await Product.find({}) โค้ดบรรทัดนี้แหละ มันจะทำหน้าที่วิ่งไปหา MongoDB แล้วบอกว่า "ขอข้อมูลสินค้าทั้งหมดที่มีใน Collection หน่อย!"
// 4. MongoDB คายข้อมูล (The Database): ฐานข้อมูลรับทราบคำสั่ง จึงจัดการหยิบสินค้า Juicy Healthy ทั้ง 48 รายการ ส่งกลับมาให้ Mongoose ในรูปแบบ Object ของ JavaScript
// 5. Express แปลงร่างและส่งกลับ (The Response): เมื่อได้ข้อมูลมาแล้ว คำสั่ง res.json(products) จะนำ Object ทั้งหมดมาแปลงร่างให้อยู่ในรูปแบบ JSON (JavaScript Object Notation) ซึ่งเปรียบเสมือน "ภาษากลาง" ที่ระบบไหนๆ ในโลกก็อ่านเข้าใจ แล้วยิงกลับไปแสดงผลที่เบราว์เซอร์
