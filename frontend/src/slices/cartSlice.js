import { createSlice } from '@reduxjs/toolkit'

// 1. กำหนดค่าเริ่มต้น (Initial State)
// ความเจ๋งคือเราดักเช็ค LocalStorage ไว้เลย! เวลากด F5 รีเฟรชหน้าเว็บ ของในตะกร้าจะได้ไม่หาย
const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : { cartItems: [] }

const cartSlice = createSlice({
    name: 'cart', // ชื่อลิ้นชัก
    initialState, // ค่าเริ่มต้นที่เราตั้งไว้ด้านบน
    reducers: {
        // ฟังก์ชันสำหรับ "เพิ่มสินค้าลงตะกร้า"
        addToCart: (state, action) => {
            const item = action.payload // payload คือ "ตัวสินค้า" ที่เราจะส่งเข้ามาตอนกดปุ่ม

            // เช็คก่อนว่า สินค้าชิ้นนี้เคยถูกกดใส่ตะกร้ามาแล้วหรือยัง? (เช็คจาก ID)
            const existItem = state.cartItems.find((x) => x._id === item._id)

            if (existItem) {
                // ถ้ามีอยู่แล้ว ให้อัปเดตข้อมูลของชิ้นนั้น (ทับของเดิม)
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x,
                )
            } else {
                // ถ้ายังไม่เคยมีในตะกร้าเลย ก็เพิ่มต่อท้ายเข้าไปใหม่
                state.cartItems = [...state.cartItems, item]
            }

            // สุดท้าย: เอาข้อมูลตะกร้าล่าสุด ไปเซฟฝังไว้ในเบราว์เซอร์ (LocalStorage)
            localStorage.setItem('cart', JSON.stringify(state))
        },
    },
})

// ส่งออกแอคชัน (ฟังก์ชัน) ไปให้ไฟล์อื่นกดเรียกใช้
export const { addToCart } = cartSlice.actions

// ส่งออกตัวลิ้นชัก ไปเสียบในโกดังใหญ่
export default cartSlice.reducer
