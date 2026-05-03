import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModel.js'

// 👮‍♀️ ยามตรวจบัตร: ต้องล็อกอินถึงจะผ่านได้ (Protect routes)
const protect = asyncHandler(async (req, res, next) => {
    let token

    // 1. ลองล้วงกระเป๋าหาบัตรผ่าน (อ่านจากคุกกี้ที่ชื่อ jwt)
    token = req.cookies.jwt

    if (token) {
        try {
            // 2. ถ้าเจอบัตร เอาไปสแกนเทียบกับรหัสลับของเรา
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // 3. เอา ID ที่ซ่อนในบัตร ไปค้นหาข้อมูลลูกค้าใน DB (แต่สั่งว่า '-password' คือไม่เอารหัสผ่านติดมาด้วยนะ)
            // แล้วเอาข้อมูลลูกค้าไปแปะไว้ที่ตัวแปร req.user เพื่อให้ด่านต่อไปเอาไปใช้ได้
            req.user = await User.findById(decoded.userId).select('-password')

            next() // อนุญาตให้ผ่านด่านได้!
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error(
                'Not authorized, token failed (บัตรผ่านปลอมหรือหมดอายุ)',
            )
        }
    } else {
        res.status(401)
        throw new Error('Not authorized, no token (ไม่มีบัตรผ่าน กรุณาล็อกอิน)')
    }
})

// 👸 ยาม VIP: ต้องเป็น Admin เท่านั้นถึงจะผ่านได้
const admin = (req, res, next) => {
    // เช็คว่ามีข้อมูล user และ user คนนั้นมีสถานะ isAdmin เป็น true ไหม
    if (req.user && req.user.isAdmin) {
        next() // ผ่านได้!
    } else {
        res.status(401)
        throw new Error('Not authorized as admin (คุณไม่ใช่ผู้ดูแลระบบ)')
    }
}

export { protect, admin }
