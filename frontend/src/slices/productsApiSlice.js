// สายโทรศัพท์ดึงสินค้า ไฟล์ที่เราใช้ดึงข้อมูลสินค้ามาโชว์หน้าแรก

import { PRODUCTS_URL } from '../constants' // 1. นำเข้า PRODUCTS_URL
import { apiSlice } from './apiSlice'

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL, // 2. เปลี่ยนมาใช้ตัวแปรตรงนี้
            }),
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`, // 3. และตรงนี้
            }),
            keepUnusedDataFor: 5,
        }),
        // หน้าจัดการ โปรดัก แอดมิน
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'POST',
            }),
            invalidatesTags: ['Product'], // สั่งให้ล้างแคช เพื่อโหลดข้อมูลสินค้าใหม่ทันที
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApiSlice
