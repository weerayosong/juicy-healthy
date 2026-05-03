import { createSlice } from '@reduxjs/toolkit'

// 1. เช็คก่อนว่ามีข้อมูล userInfo ค้างอยู่ใน localStorage ไหม ถ้ามีก็ดึงมาใช้ ถ้าไม่มีก็ให้เป็น null
const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // ฟังก์ชันตอนล็อกอินสำเร็จ: รับข้อมูลมาเก็บใน Redux และเซฟลง localStorage
        setCredentials: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        // ฟังก์ชันตอนออกจากระบบ: ล้างข้อมูลออกจาก Redux และลบทิ้งจาก localStorage
        logout: (state) => {
            state.userInfo = null
            localStorage.removeItem('userInfo')
        },
    },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
