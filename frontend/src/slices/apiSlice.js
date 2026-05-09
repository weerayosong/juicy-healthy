// สร้าง "ยานแม่" สำหรับต่อ API

import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants'

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' })

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Product', 'Order', 'User'], // ประเภทของข้อมูลที่ต้องการจัดการ Cache
    endpoints: () => ({}), // ปล่อยว่างไว้ก่อน เดี๋ยวให้ตัวอื่นมา inject (เสียบปลั๊ก) เข้าไป
})

// Backend (generateToken.js): ต้องมี sameSite: 'none' และ secure: true
// Backend (server.js): ตรง cors ต้องมี credentials: true และระบุ origin เป็น URL Vercel
// Frontend (apiSlice.js): ต้องมี credentials: 'include'
