import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice' // นำเข้ายานแม่
import cartSliceReducer from './slices/cartSlice'
import authReducer from './slices/authSlice' // นำเข้าลิ้นชัก auth

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, // เพิ่ม reducer ของยานแม่
        cart: cartSliceReducer,
        auth: authReducer, // เพิ่มลิ้นชัก auth
    },
    // ต้องเพิ่ม middleware ของ apiSlice ด้วย เพื่อให้ระบบ Cache และ Fetching ทำงานได้สมบูรณ์
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})

export default store
