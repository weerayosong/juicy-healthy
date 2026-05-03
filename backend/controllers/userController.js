// 1. นำเข้าบอดี้การ์ด (asyncHandler) และพิมพ์เขียว (User Model)
import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'
// 2. นำเข้าโรงงานผลิตบัตรผ่าน (generateToken) ที่เราเพิ่งสร้าง
import generateToken from '../utils/generateToken.js'

// ==========================================
// @desc    เข้าสู่ระบบ (Auth user & get token)
// @route   POST /api/users/auth
// @access  Public
// ==========================================
const authUser = asyncHandler(async (req, res) => {
    // รับ Email และ Password จากหน้าเว็บ
    const { email, password } = req.body

    // หา User ใน Database ด้วย Email
    const user = await User.findOne({ email })

    // ถ้าเจอ User และ รหัสผ่านตรงกัน (เช็คด้วย matchPassword ที่เราทำไว้ใน Model)
    if (user && (await user.matchPassword(password))) {
        // สั่งสร้าง Token และฝังลงใน Cookie ทันที
        generateToken(res, user._id)

        // ส่งข้อมูลผู้ใช้ (ที่ไม่ใช่รหัสผ่าน) กลับไปให้หน้าบ้าน
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        // ถ้ารหัสผิด หรือไม่มีอีเมลนี้ ให้เตะออกและแจ้ง Error
        res.status(401)
        throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
})

// ==========================================
// @desc    สมัครสมาชิก (Register user)
// @route   POST /api/users
// @access  Public
// ==========================================
const registerUser = asyncHandler(async (req, res) => {
    // 1. รับข้อมูลที่ลูกค้ากรอกมา (ชื่อ, อีเมล, รหัสผ่าน)
    const { name, email, password } = req.body

    // 2. เช็คก่อนว่ามีใครใช้อีเมลนี้ไปหรือยัง?
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400) // 400 Bad Request
        throw new Error('อีเมลนี้ถูกใช้งานแล้ว')
    }

    // 3. ถ้าอีเมลว่าง ก็สร้างบัญชีใหม่เลย! (รหัสผ่านจะถูกเข้ารหัสอัตโนมัติจากไฟล์ userModel)
    const user = await User.create({
        name,
        email,
        password,
    })

    // 4. ถ้าสร้างสำเร็จ
    if (user) {
        // ออกบัตรผ่าน JWT ให้เลย สมัครปุ๊บ ล็อกอินให้ปั๊บ!
        generateToken(res, user._id)

        res.status(201).json({
            // 201 Created
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        // ถ้ามีปัญหาตอนบันทึก
        res.status(400)
        throw new Error('ข้อมูลผู้ใช้ไม่ถูกต้อง')
    }
})

// @desc    ออกจากระบบ (Logout user / clear cookie)
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    // เอาคุกกี้ชื่อ 'jwt' มาเขียนทับด้วยค่าว่างๆ ('')
    // และตั้งเวลาหมดอายุ (expires) เป็น 0 เพื่อให้เบราว์เซอร์ลบทิ้งทันที
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })

    res.status(200).json({ message: 'ออกจากระบบสำเร็จ ลาก่อนคุกกี้!' })
})

// @desc    ดูข้อมูลโปรไฟล์ตัวเอง (Get user profile)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    res.send('ข้อมูลโปรไฟล์ (เดี๋ยวมาเขียนต่อ)')
})

// @desc    แก้ไขข้อมูลโปรไฟล์ตัวเอง (Update user profile)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    res.send('อัปเดตโปรไฟล์สำเร็จ (เดี๋ยวมาเขียนต่อ)')
})

// ==========================================
// 😈 โซนของ Admin (ผู้ดูแลระบบ) 😈
// ==========================================

// @desc    ดูรายชื่อผู้ใช้ทั้งหมด (Get users)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    res.send('รายชื่อผู้ใช้ทั้งหมด (Admin)')
})

// @desc    ลบผู้ใช้ (Delete user)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    res.send('ลบผู้ใช้สำเร็จ (Admin)')
})

// @desc    ดูข้อมูลผู้ใช้ 1 คน (Get user by ID)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    res.send('ข้อมูลผู้ใช้ตาม ID (Admin)')
})

// @desc    แก้ไขข้อมูลผู้ใช้ (Update user)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    res.send('อัปเดตข้อมูลผู้ใช้สำเร็จ (Admin)')
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
}
