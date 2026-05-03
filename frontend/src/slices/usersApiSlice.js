// สร้างสายโทรศัพท์สำหรับ User

import { USERS_URL } from '../constants'
import { apiSlice } from './apiSlice' // นำเข้ายานแม่ API

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // สร้างคำสั่งชื่อ login
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`, // จะได้เป็น /api/users/auth
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`, // ยิงไปที่ /api/users/logout
                method: 'POST',
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`, // ยิงไปที่ /api/users (ไม่มี /auth)
                method: 'POST',
                body: data,
            }),
        }),
    }),
})

// RTK Query จะสร้าง Hook ให้เราอัตโนมัติ แค่เติม use...Mutation เข้าไป
export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
    usersApiSlice
