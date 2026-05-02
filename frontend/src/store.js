import { configureStore } from '@reduxjs/toolkit'
import cartSliceReducer from './slices/cartSlice' // 1. นำเข้าลิ้นชักตะกร้า

const store = configureStore({
    reducer: {
        // เดี๋ยวเราจะเอา "ตะกร้าสินค้า" (Cart) มาเสียบปลั๊กตรงนี้
        cart: cartSliceReducer, // 2. เสียบปลั๊ก! บอกว่าลิ้นชักชื่อ "cart" ให้ใช้ระบบของ cartSlice
    },
    // devTools: process.env.NODE_ENV !== 'production',
    devTools: true,
})

export default store
