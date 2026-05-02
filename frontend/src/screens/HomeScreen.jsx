import { useState, useEffect } from 'react'
import axios from 'axios'

import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'

const HomeScreen = () => {
    const [products, setProducts] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // เริ่มการดึงข้อมูล ให้สถานะ isLoading เป็นจริง
                setIsLoading(true)

                const { data } = await axios.get('/api/products') //get ดึง จากหลังบ้าน

                setProducts(data) // เอาข้อมูลที่ได้ (data) ไปเก็บไว้ใน  useState >> products
                //ดึงเสร็จแล้ว isLoading ไหม? ไม่ล่ะ เท็จ ปิดเลย
                setIsLoading(false)
            } catch (err) {
                // ถ้าพัง (เช่น ปิดเซิร์ฟเวอร์หลังบ้านทิ้งไว้) ให้เก็บข้อความ Error
                setError(
                    err.response && err.response.data.message
                        ? err.response.data.message
                        : err.message,
                )
                setIsLoading(false) //ตรงนีก็ต้องทอกเกิลด้วย ไม่ได้กำลังโหลด แล้ว ปิดแล้ว
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
            {/* เช็คเงื่อนไข: ถ้าโหลดอยู่โชว์ Loader ถ้าพังโชว์ Message ถ้าปกติโชว์สินค้า */}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message>{error}</Message>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* products (จาก useState) มาวนลูป .map() แทนของเดิม */}
                    {products.map((product) => (
                        <Product key={product._id} product={product} />
                    ))}
                </div>
            )}
            {/* ก้อนเช็คเงื่อนไข ครอบส่วนที่แมปสินค้ามาแสดง ทั้งหมด */}
        </>
    )
}

export default HomeScreen
