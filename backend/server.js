import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js' // อย่าลืม!! ต้องใส่ .js เพราะระบุ "type": "module" ไว้

dotenv.config()

// เชื่อมต่อฐานข้อมูล
connectDB()

const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Juicy Healthy API is running...')
})

app.listen(port, () => {
    console.log(
        `Server is running in ${process.env.NODE_ENV} mode on port ${port}`,
    )
})
