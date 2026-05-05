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
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`, // ยิงไปที่ /api/users/profile
                method: 'PUT',
                body: data,
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
            }),
            providesTags: ['User'], // ให้ Redux รู้จักแท็กนี้ จะได้สั่ง Refetch ง่ายๆ
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            }),
        }),
        getUserDetails: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            // คำสั่งนี้จะบอกให้ Redux รู้ว่า "ข้อมูล User เปลี่ยนแล้วนะ ให้ไปโหลดหน้าลิสต์มาใหม่ด้วย"
            invalidatesTags: ['User'],
        }),
    }),
})

// RTK Query จะสร้าง Hook ให้เราอัตโนมัติ แค่เติม use...Mutation เข้าไป
export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} = usersApiSlice
