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
    }),
})

export const { useGetProductsQuery, useGetProductDetailsQuery } =
    productsApiSlice
