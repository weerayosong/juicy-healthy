import { apiSlice } from './apiSlice'
import { ORDERS_URL } from '../constants'

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: { ...order },
            }),
        }),
        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
        }),
        // เพื่อดึง PayPal Client ID จาก Backend
        getPayPalClientId: builder.query({
            query: () => ({
                url: '/api/config/paypal',
            }),
            keepUnusedDataFor: 5,
        }),

        // สำหรับอัปเดตสถานะว่าจ่ายเงินแล้ว
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `/api/orders/${orderId}/pay`,
                method: 'PUT',
                body: { ...details },
            }),
        }),
    }),
})

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
} = ordersApiSlice
