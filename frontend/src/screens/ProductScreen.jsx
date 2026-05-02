import { useState, useEffect } from 'react'
// <Link>: มันทำงานเหมือนแท็ก <a> ใน HTML หน้าที่ของมันคือ "คลิกปุ๊บ เปลี่ยนหน้าปั๊บ" ทันที
// useNavigate: มันคือการ "เปลี่ยนหน้าด้วยการเขียนโปรแกรม (Programmatic Navigation)"
import { useParams, Link, useNavigate } from 'react-router-dom' // เหตุผลการเลือกใช้ = "ลำดับการทำงาน (Flow of Execution)"
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { FaArrowLeft } from 'react-icons/fa'

import Loader from '../components/Loader'
import Message from '../components/Message'

import { addToCart } from '../slices/cartSlice'

const ProductScreen = () => {
    // รับค่า id จาก URL (เช่น /product/1)
    const { id: productId } = useParams()

    // เตรียมปืนใหญ่ (dispatch) สำหรับยิงข้อมูล และตัวนำทาง (navigate) สำหรับเปลี่ยนหน้า
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // 1. สร้าง State มารับข้อมูลสินค้า 1 ชิ้น (ค่าเริ่มต้นให้เป็น Object ว่างๆ หรือ null)
    const [product, setProduct] = useState({})

    // เพิ่ม State สำหรับเก็บ "จำนวนชิ้น" (เริ่มต้นที่ 1)
    const [qty, setQty] = useState(1)

    // สร้างฟังก์ชันสำหรับปุ่ม "เพิ่มลงรถเข็น"
    const addToCartHandler = () => {
        // ยิงข้อมูลสินค้า + จำนวนชิ้น (qty) เข้าไปใน Redux
        dispatch(addToCart({ ...product, qty }))

        // ยิงเสร็จ พาผู้ใช้กระโดดไปหน้าตะกร้า (ที่เดี๋ยวเราจะสร้าง)
        navigate('/cart')
    }

    // 2. ใช้ useEffect ดึงข้อมูลจาก API เมื่อเปิดหน้านี้ (หรือเมื่อ productId เปลี่ยน)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true)

                // ยิงไปที่ /api/products/:id เพื่อดึงข้อมูลชิ้นเดียว
                const { data } = await axios.get(`/api/products/${productId}`)
                setProduct(data)

                setIsLoading(false)
            } catch (err) {
                setError(
                    err.response && err.response.data.message
                        ? err.response.data.message
                        : err.message,
                )
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [productId]) // ใส่ productId ไว้ตรงนี้ เพื่อบอกว่าถ้า ID เปลี่ยน ให้ดึงข้อมูลใหม่นะ

    if (isLoading) return <Loader />
    if (error) return <Message>{error}</Message>

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

                    {/* เพิ่มบล็อกนี้ ถ้ามีของในสต็อก (countInStock > 0) ให้โชว์กล่องเลือกจำนวน */}
                    {product.countInStock > 0 && (
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                            <span className="text-slate-600 font-medium">
                                จำนวน:
                            </span>
                            <select
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                className="p-2 border border-slate-200 rounded-sm bg-slate-50 w-24 text-center focus:outline-none focus:border-teal-600"
                            >
                                {/* สร้าง Dropdown ตามจำนวนสต็อกที่มี ..แต่ จำกัดให้แสดงสูงสุดแค่ Math.min(จำนวนทั้งหมด,5) ชิ้น */}
                                {[
                                    ...Array(
                                        Math.min(product.countInStock, 5),
                                    ).keys(),
                                ].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        onClick={addToCartHandler} // << ผูกฟังก์ชันเข้ากับปุ่มตรงนี้!
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
