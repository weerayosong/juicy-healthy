import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import {
    useGetProductDetailsQuery,
    useUpdateProductMutation,
} from '../../slices/productsApiSlice'

const ProductEditScreen = () => {
    const { id: productId } = useParams()
    const navigate = useNavigate()

    // 1. ดึงข้อมูลสินค้าจาก API
    const {
        data: product,
        isLoading,
        error,
        refetch,
    } = useGetProductDetailsQuery(productId)

    // 2. สร้าง State สำหรับฟอร์ม เยอะ เพราะสินค้ามีหลายช่อง
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')

    // 3. Trick ป้องกัน Cascading Renders
    const [loadedProductId, setLoadedProductId] = useState(null)

    if (product && loadedProductId !== product._id) {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
        setLoadedProductId(product._id)
    }

    const [updateProduct, { isLoading: loadingUpdate }] =
        useUpdateProductMutation()

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                brand,
                category,
                countInStock,
                description,
            })
            toast.success('อัปเดตข้อมูลสินค้าสำเร็จ! 🎉')
            refetch()
            navigate('/admin/productlist')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 font-sans max-w-3xl">
            <Link
                to="/admin/productlist"
                className="text-gray-600 hover:text-black transition mb-6 inline-block font-medium"
            >
                &larr; กลับไปหน้ารายการสินค้า
            </Link>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider text-gray-800 border-b pb-4">
                    แก้ไขข้อมูลสินค้า (Edit Product)
                </h2>

                {loadingUpdate && <Loader />}

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <form
                        onSubmit={submitHandler}
                        className="space-y-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
                    >
                        {/* ชื่อสินค้า */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ชื่อสินค้า
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        {/* ราคา */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ราคา (บาท)
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        {/* จำนวนในสต็อก */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                จำนวนในสต็อก
                            </label>
                            <input
                                type="number"
                                value={countInStock}
                                onChange={(e) =>
                                    setCountInStock(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        {/* หมวดหมู่ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                หมวดหมู่ (Category)
                            </label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        {/* แบรนด์ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                แบรนด์ (Brand)
                            </label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>

                        {/* รูปภาพ ทำระบบอัปโหลดทีหลัง */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                รูปภาพ (URL หรือ Path)
                            </label>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-gray-50"
                            />
                        </div>

                        {/* รายละเอียด */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                รายละเอียดสินค้า (Description)
                            </label>
                            <textarea
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            ></textarea>
                        </div>

                        {/* ปุ่ม Submit */}
                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={loadingUpdate}
                                className="w-full bg-black text-white font-medium py-3 rounded-sm hover:bg-secondary transition disabled:bg-gray-400"
                            >
                                {loadingUpdate
                                    ? 'กำลังอัปเดต...'
                                    : 'บันทึกการแก้ไขสินค้า'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ProductEditScreen
