import { createSlice } from '@reduxjs/toolkit'

// ฟังก์ชันสำหรับคำนวณราคาทุกอย่างในตะกร้า
const updateCart = (state) => {
    // 1. คำนวณราคาสินค้าทั้งหมด (Items Price)
    state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0,
    )

    // 2. คำนวณค่าจัดส่ง (Shipping Price)[cite: 1]
    // ตัวอย่าง: ถ้ายอดซื้อเกิน 1,000฿ ส่งฟรี ถ้าไม่ถึงคิด 100฿
    state.shippingPrice = state.itemsPrice > 1000 ? 0 : 100

    // 3. คำนวณภาษี (Tax Price) - สมมติที่ 7%[cite: 1]
    state.taxPrice = Number((0.07 * state.itemsPrice).toFixed(2))

    // 4. คำนวณราคารวมสุทธิ (Total Price)[cite: 1]
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2)

    // บันทึกลง LocalStorage[cite: 1]
    localStorage.setItem('cart', JSON.stringify(state))

    return state
}

// 1. กำหนดค่าเริ่มต้น (Initial State)
// ความเจ๋งคือเราดักเช็ค LocalStorage ไว้เลย! เวลากด F5 รีเฟรชหน้าเว็บ ของในตะกร้าจะได้ไม่หาย
const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : { cartItems: [], shippingAddress: {} }

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

            return updateCart(state)
        },
        // ฟังก์ชันลบสินค้า
        removeFromCart: (state, action) => {
            // ใช้ .filter() กรองเอาเฉพาะตัวที่ ID "ไม่ตรง" กับที่ส่งมา (แปลว่าตัวที่ตรงจะถูกคัดทิ้ง) สร้างอาร์เรย์ใหม่
            state.cartItems = state.cartItems.filter(
                (x) => x._id !== action.payload,
            )

            return updateCart(state)
        },
        // เพิ่มฟังก์ชันจดจำที่อยู่จัดส่งตรงนี้ครับ
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
            return updateCart(state)
        },
        // เพิ่มฟังก์ชันจดจำวิธีชำระเงินตรงนี้
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
            return updateCart(state)
        },
        clearCartItems: (state) => {
            state.cartItems = [] // เคลียร์สินค้าใน State
            // อัปเดตราคาทั้งหมดให้เป็น 0 (ใช้ฟังก์ชัน updateCart ที่คุณอ๋องมีอยู่แล้ว)
            return updateCart(state)
        },
    },
})

// ส่งออกแอคชัน (ฟังก์ชัน) ไปให้ไฟล์อื่นกดเรียกใช้
// อย่าลืม Export
export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
} = cartSlice.actions

// ส่งออกตัวลิ้นชัก ไปเสียบในโกดังใหญ่
export default cartSlice.reducer
