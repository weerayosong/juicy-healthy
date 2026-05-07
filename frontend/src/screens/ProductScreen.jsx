// <Link>: มันทำงานเหมือนแท็ก <a> ใน HTML หน้าที่ของมันคือ "คลิกปุ๊บ เปลี่ยนหน้าปั๊บ" ทันที
// useNavigate: มันคือการ "เปลี่ยนหน้าด้วยการเขียนโปรแกรม (Programmatic Navigation)"
// เหตุผลการเลือกใช้ = "ลำดับการทำงาน (Flow of Execution)"
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { FaArrowLeft } from 'react-icons/fa'

import Loader from '../components/Loader'
import Message from '../components/Message'
import Rating from '../components/Rating' // เพิ่มคอมโพเนนต์ Rating สำหรับโชว์ดาว

import { addToCart } from '../slices/cartSlice'
// นำเข้า RTK Query ทั้งตัวดึงข้อมูล และตัวส่งรีวิว
import {
    useGetProductDetailsQuery,
    useCreateReviewMutation,
} from '../slices/productsApiSlice'

const ProductScreen = () => {
    const { id: productId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // --- State สำหรับจำนวนสินค้า และ ฟอร์มรีวิว ---
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    // ดึงข้อมูล User (เพื่อเช็คว่า Login หรือยัง)
    const { userInfo } = useSelector((state) => state.auth)

    // ดึงข้อมูลสินค้าผ่าน Redux แทน axios เดิม
    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId)

    // ท่อสำหรับส่งรีวิว
    const [createReview, { isLoading: loadingProductReview }] =
        useCreateReviewMutation()

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        navigate('/cart')
    }

    // ฟังก์ชันจัดการตอนกดส่งรีวิว
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap()
            refetch()
            toast.success('ส่งรีวิวสำเร็จแล้ว! ขอบคุณครับ 🥕')
            setRating(0)
            setComment('')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    if (isLoading) return <Loader />
    if (error)
        return (
            <Message variant="danger">
                {error?.data?.message || error.error}
            </Message>
        )

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link
                to="/"
                className="inline-flex items-center text-slate-500 hover:text-secondary transition duration-300 mb-8"
            >
                <FaArrowLeft className="mr-2" /> กลับไปหน้าหลัก
            </Link>

            {/* โซนรายละเอียดสินค้า */}
            <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-sm shadow-elegant mb-10">
                <div className="md:w-1/2">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-cover rounded-sm border border-slate-100"
                    />
                </div>

                <div className="md:w-1/2 flex flex-col">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        {product.name}
                    </h1>

                    {/* โชว์ดาวรวมและจำนวนคนรีวิวตรงนี้ */}
                    <div className="mb-4">
                        <Rating
                            value={product.rating}
                            text={`${product.numReviews} รีวิว`}
                        />
                    </div>

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
                        onClick={addToCartHandler}
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

            {/* โซนรีวิวสินค้า */}
            <div className="mt-16 border-t border-gray-200 pt-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    รีวิวจากลูกค้า
                </h2>

                {product.reviews?.length === 0 && (
                    <Message variant="info">
                        ยังไม่มีรีวิวสำหรับสินค้านี้ มารีวิวเป็นคนแรกกันเถอะ!
                    </Message>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* ฝั่งซ้าย: แสดงรายการรีวิว */}
                    <div className="space-y-6">
                        {product.reviews?.map((review) => (
                            <div
                                key={review._id}
                                className="bg-slate-50 p-4 rounded-sm shadow-sm border border-gray-100"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <strong className="text-slate-800">
                                        {review.name}
                                    </strong>
                                    <Rating value={review.rating} />
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                    {review.createdAt.substring(0, 10)}
                                </p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ฝั่งขวา: ฟอร์มเขียนรีวิว */}
                    <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm h-fit">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">
                            เขียนรีวิวของคุณ
                        </h3>

                        {loadingProductReview && <Loader />}

                        {userInfo ? (
                            <form
                                onSubmit={submitHandler}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        ให้คะแนนความอร่อย
                                    </label>
                                    <select
                                        value={rating}
                                        onChange={(e) =>
                                            setRating(Number(e.target.value))
                                        }
                                        className="w-full border border-gray-300 rounded-sm p-2 focus:ring-secondary focus:border-secondary"
                                    >
                                        <option value="">เลือกคะแนน...</option>
                                        <option value="1">
                                            1 - 🤢 ต้องปรับปรุง
                                        </option>
                                        <option value="2">
                                            2 - 😐 พอใช้ได้
                                        </option>
                                        <option value="3">
                                            3 - 😌 ปานกลาง
                                        </option>
                                        <option value="4">
                                            4 - 😋 อร่อยเลย
                                        </option>
                                        <option value="5">
                                            5 - 😍 อร่อยเหาะ!
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        ความคิดเห็น
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-sm p-2 focus:ring-secondary focus:border-secondary"
                                        placeholder="บอกเราหน่อยว่ารสชาติเป็นยังไงบ้าง..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    disabled={loadingProductReview}
                                    type="submit"
                                    className="w-full bg-slate-900 text-white px-4 py-2 rounded-sm hover:bg-secondary transition font-medium"
                                >
                                    ส่งรีวิว
                                </button>
                            </form>
                        ) : (
                            <Message>
                                กรุณา{' '}
                                <Link
                                    to="/login"
                                    className="text-secondary font-bold underline"
                                >
                                    เข้าสู่ระบบ
                                </Link>{' '}
                                เพื่อเขียนรีวิว
                            </Message>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductScreen
