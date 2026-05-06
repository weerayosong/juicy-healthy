// สายโทรศัพท์ดึงสินค้า ไฟล์ที่เราใช้ดึงข้อมูลสินค้ามาโชว์หน้าแรก

import { PRODUCTS_URL, UPLOAD_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            // 1. ใส่ = {} เผื่อโดนเรียกใช้แบบไม่มี keyword จะได้ไม่แครช
            query: ({ keyword, pageNumber } = {}) => ({
                url: PRODUCTS_URL,
                // 2. เช็คก่อนว่ามี keyword ส่งมาไหม ถ้ามีค่อยแปลงเป็น params
                params: { keyword, pageNumber }, // ส่ง pageNumber แนบไปกับ URL
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
        // endpoint upload รูปภาพ backend
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: UPLOAD_URL,
                method: 'POST',
                body: data,
            }),
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadProductImageMutation,
} = productsApiSlice
