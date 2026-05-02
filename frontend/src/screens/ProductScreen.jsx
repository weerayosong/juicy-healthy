import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'

const ProductScreen = () => {
    // รับค่า id จาก URL (เช่น /product/1)
    const { id: productId } = useParams()

    // 1. สร้าง State มารับข้อมูลสินค้า 1 ชิ้น (ค่าเริ่มต้นให้เป็น Object ว่างๆ หรือ null)
    const [product, setProduct] = useState({})

    // 2. ใช้ useEffect ดึงข้อมูลจาก API เมื่อเปิดหน้านี้ (หรือเมื่อ productId เปลี่ยน)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // ยิงไปที่ /api/products/:id เพื่อดึงข้อมูลชิ้นเดียว
                const { data } = await axios.get(`/api/products/${productId}`)
                setProduct(data)
            } catch (error) {
                console.error('Error fetching product:', error)
            }
        }

        fetchProduct()
    }, [productId]) // ใส่ productId ไว้ตรงนี้ เพื่อบอกว่าถ้า ID เปลี่ยน ให้ดึงข้อมูลใหม่นะ

    // ดักไว้ก่อนว่าถ้ายังไม่มีข้อมูล (กำลังโหลด) ไม่ต้องแสดง UI ที่พังๆ
    if (!product._id) {
        return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link
                to="/"
                className="inline-flex items-center text-slate-500 hover:text-secondary transition duration-300 mb-8"
            >
                <FaArrowLeft className="mr-2" /> กลับไปหน้าหลัก
            </Link>

            <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-sm shadow-elegant">
                {/* รูปภาพสินค้า */}
                <div className="md:w-1/2">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-cover rounded-sm border border-slate-100"
                    />
                </div>

                {/* รายละเอียดสินค้า */}
                <div className="md:w-1/2 flex flex-col">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        {product.name}
                    </h1>
                    <p className="text-secondary font-medium mb-4">
                        {product.category}
                    </p>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="text-3xl font-bold text-slate-800 mb-8">
                        ฿{product.price}
                    </div>

                    <div className="flex items-center mb-8 pb-8 border-b border-slate-100">
                        <span className="text-slate-600 mr-4">สถานะ:</span>
                        <span
                            className={`px-3 py-1 rounded-sm text-sm font-medium ${product.countInStock > 0 ? 'bg-teal-100 text-teal-400' : 'bg-teal-100 text-red-400'}`}
                        >
                            {product.countInStock > 0
                                ? 'มีสินค้าพร้อมส่ง'
                                : 'สินค้าหมด'}
                        </span>
                    </div>

                    <button
                        className={`w-full py-4 rounded-sm font-bold text-lg transition duration-300 ${
                            product.countInStock === 0
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-900 text-white hover:bg-secondary'
                        }`}
                        disabled={product.countInStock === 0}
                    >
                        เพิ่มลงรถเข็น
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductScreen
