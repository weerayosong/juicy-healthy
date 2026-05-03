import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'

// @desc    เข้าสู่ระบบ (Auth user & get token)
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    res.send('ล็อกอินสำเร็จ (เดี๋ยวมาเขียนต่อ)')
})

// @desc    สมัครสมาชิก (Register user)
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    res.send('สมัครสมาชิกสำเร็จ (เดี๋ยวมาเขียนต่อ)')
})

// @desc    ออกจากระบบ (Logout user / clear cookie)
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    res.send('ออกจากระบบสำเร็จ (เดี๋ยวมาเขียนต่อ)')
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
// 🛡️ โซนของ Admin (ผู้ดูแลระบบ)
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
