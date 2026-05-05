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

// ==========================================
// @desc    ออกจากระบบ (Logout user / clear cookie)
// @route   POST /api/users/logout
// @access  Private
// ==========================================
const logoutUser = asyncHandler(async (req, res) => {
    // เอาคุกกี้ชื่อ 'jwt' มาเขียนทับด้วยค่าว่างๆ ('')
    // และตั้งเวลาหมดอายุ (expires) เป็น 0 เพื่อให้เบราว์เซอร์ลบทิ้งทันที
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })

    res.status(200).json({ message: 'ออกจากระบบสำเร็จ ลาก่อนคุกกี้!' })
})

// ==========================================
// @desc    ดูข้อมูลโปรไฟล์ตัวเอง (Get user profile)
// @route   GET /api/users/profile
// @access  Private
// ==========================================
const getUserProfile = asyncHandler(async (req, res) => {
    // หา User จาก ID ที่แนบมากับ Token
    const user = await User.findById(req.user._id)

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('ไม่พบข้อมูลผู้ใช้')
    }
})

// ==========================================
// @desc    แก้ไขข้อมูลโปรไฟล์ตัวเอง (Update user profile)
// @route   PUT /api/users/profile
// @access  Private
// ==========================================
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        // อัปเดตข้อมูล (ถ้าไม่ได้พิมพ์ของใหม่มา ให้ใช้ข้อมูลเดิม)
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        // ถ้ายูสเซอร์กรอกรหัสผ่านใหม่มาด้วย ถึงจะอัปเดตรหัสผ่าน
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        // ส่งกลับเป็น JSON เพื่อให้หน้าบ้านเอาไปอัปเดต "ลิ้นชัก" Redux ได้
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('ไม่พบข้อมูลผู้ใช้')
    }
})

// ==========================================
// ==========================================
// 😈 โซนของ Admin (ผู้ดูแลระบบ) 😈
// ==========================================
// ==========================================

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // ดึงข้อมูลผู้ใช้ทั้งหมดออกมา
    const users = await User.find({})
    res.status(200).json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        // ดักไว้ก่อน: ห้ามแอดมินลบแอดมินด้วยกันเอง!
        if (user.isAdmin) {
            res.status(400)
            throw new Error('ไม่สามารถลบผู้ดูแลระบบได้ครับ')
        }
        await User.deleteOne({ _id: user._id })
        res.status(200).json({ message: 'ลบผู้ใช้สำเร็จ' })
    } else {
        res.status(404)
        throw new Error('ไม่พบผู้ใช้รายนี้')
    }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    // ดึงข้อมูลผู้ใช้มา แต่ไม่เอารหัสผ่าน (-password) ส่งกลับไปให้แอดมินดู
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404)
        throw new Error('ไม่พบผู้ใช้งานรายนี้')
    }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        // อัปเดตสถานะแอดมิน (ใช้ Boolean เพื่อแปลงค่าที่ส่งมาให้เป็น true/false ชัวร์ๆ)
        user.isAdmin = Boolean(req.body.isAdmin)

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('ไม่พบผู้ใช้งานรายนี้')
    }
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
