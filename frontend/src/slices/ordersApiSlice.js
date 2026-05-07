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
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`,
            }),
            keepUnusedDataFor: 5,
        }),

        // สำหรับ Admin: ดึงออเดอร์ทั้งหมด refactored for paginate
        getOrders: builder.query({
            // รับ pageNumber เป็นพารามิเตอร์
            query: ({ pageNumber } = {}) => ({
                url: ORDERS_URL,
                params: { pageNumber }, // แนบไปกับ URL
            }),
            keepUnusedDataFor: 5,
        }),

        // สำหรับ Admin: อัปเดตสถานะว่าจัดส่งแล้ว
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),
    }),
})

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
} = ordersApiSlice
