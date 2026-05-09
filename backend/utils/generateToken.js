import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })

    // ✅ ปรับการตั้งค่า Cookie สำหรับ Cross-Site (Vercel + Render)
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // ต้องเป็น true เสมอใน Production (https)
        sameSite: 'none', // 👈 หัวใจสำคัญ: อนุญาตให้ส่งคุกกี้ข้ามโดเมนได้
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 วัน
    })
}

export default generateToken
