import mongoose from 'mongoose'
import dotenv from 'dotenv'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import connectDB from './config/db.js'

// โหลดตัวแปรจากไฟล์ .env (เช่น MONGO_URI)
dotenv.config()

// เชื่อมต่อ Database
connectDB()

const importData = async () => {
    try {
        // 1. ล้างข้อมูลเก่าทิ้งให้หมดก่อน (เพื่อป้องกันข้อมูลซ้ำซ้อน)
        await Product.deleteMany()
        await User.deleteMany()

        // 2. นำเข้าข้อมูล User ลง Database
        const createdUsers = await User.insertMany(users)

        // 3. ดึง ID ของแอดมินคนแรกออกมา (เพื่อเอาไปผูกกับสินค้า)
        const adminUser = createdUsers[0]._id

        // 4. เอา ID แอดมิน ไปยัดใส่สินค้าทุกชิ้นในฟิลด์ 'user'
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser }
        })

        // 5. นำเข้าข้อมูลสินค้าทั้งหมดลง Database
        await Product.insertMany(sampleProducts)

        console.log('Import Done! (Data Imported!)')
        process.exit()
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        // ล้างข้อมูลทิ้งทั้งหมด
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Delete Done! (Data Destroyed!)')
        process.exit()
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

// เช็คคำสั่งที่พิมพ์ผ่าน Terminal ว่าจะให้ Import หรือ Destroy
if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}
// npm run data:import >> รันคำสั่งยิงข้อมูล
