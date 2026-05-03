import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
    // 1. สร้าง Token โดยฝัง userId ไว้ข้างใน พร้อมใส่รหัสลับ (Secret) และกำหนดวันหมดอายุ
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // บัตรผ่านมีอายุ 30 วัน
    })

    // 2. เอา Token ยัดใส่ Cookie ส่งกลับไปให้เบราว์เซอร์ลูกค้า
    res.cookie('jwt', token, {
        httpOnly: true, // ป้องกันไม่ให้ฝั่ง Frontend (JavaScript) แอบมาอ่าน Cookie นี้ได้ (กันโดนแฮ็ก)
        secure: process.env.NODE_ENV !== 'development', // ถ้าเป็น Production ให้บังคับใช้ HTTPS
        sameSite: 'strict', // ป้องกันการโจมตีแบบ CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // อายุ 30 วัน (หน่วยเป็นมิลลิวินาที)
    })
}

export default generateToken
