import express from 'express'
const router = express.Router()

import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} from '../controllers/userController.js'

import { protect } from '../middleware/authMiddleware.js'
// ผูกเส้นทาง (Route) เข้ากับฟังก์ชันใน Controller
// เส้นทางที่ใช้ตัวเดียวกันแต่คนละ Method (GET/POST/PUT) สามารถเขียนรวบกันได้ครับ
router.route('/').post(registerUser).get(getUsers)
router.post('/logout', logoutUser)
router.post('/auth', authUser) // ใช้ /auth ให้เป็นมาตรฐาน
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
router.route('/:id').delete(deleteUser).get(getUserById).put(updateUser)

export default router
