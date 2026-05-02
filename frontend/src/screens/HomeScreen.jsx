import { useState, useEffect } from 'react'
import axios from 'axios'

import Product from '../components/Product'

const HomeScreen = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products') //get ดึง จากหลังบ้าน

                setProducts(data) // เอาข้อมูลที่ได้ (data) ไปเก็บไว้ใน  useState >> products
            } catch (error) {
                console.error('Error fetching products:', error)
            }
        }
        fetchProducts() // เรียกใช้
    }, []) // ทำรอบเดียว

    return (
        <>
            <h1 className="text-3xl font-bold text-slate-800">
                สินค้าสุขภาพล่าสุด
            </h1>
            <p className="text-md md:text-2xl font-bold text-slate-800 mb-8">
                Fetch ตรงจาก Backend ขนส่งสดใหม่จากสวน Database
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* products (จาก useState) มาวนลูป .map() แทนของเดิม */}
                {products.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </>
    )
}

export default HomeScreen
