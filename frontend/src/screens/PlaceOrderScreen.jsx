import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'

import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'
import { toast } from 'react-toastify'

const PlaceOrderScreen = () => {
    const navigate = useNavigate()
    const cart = useSelector((state) => state.cart)

    // ตรวจสอบว่าถ้าไม่มีที่อยู่หรือวิธีชำระเงิน ให้ดีดกลับไปกรอกใหม่
    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping')
        } else if (!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate])

    const [createOrder, { isLoading }] = useCreateOrderMutation()
    const dispatch = useDispatch()

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap()

            dispatch(clearCartItems()) // ล้างตะกร้าเมื่อสั่งซื้อสำเร็จ
            navigate(`/order/${res._id}`) // ส่งไปหน้าดูรายละเอียด Order
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    return (
        <div className="container mx-auto mt-8 px-4">
            <CheckoutSteps step1 step2 step3 step4 />

            <div className="grid md:grid-cols-3 gap-8">
                {/* ฝั่งซ้าย: รายละเอียดที่อยู่, วิธีชำระเงิน, รายการสินค้า */}
                <div className="md:col-span-2 space-y-6">
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-2">
                            ที่อยู่จัดส่ง
                        </h2>
                        <p>
                            <strong>ที่อยู่: </strong>
                            {cart.shippingAddress.address},{' '}
                            {cart.shippingAddress.city},{' '}
                            {cart.shippingAddress.postalCode}
                        </p>
                    </div>

                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-2">
                            วิธีชำระเงิน
                        </h2>
                        <p>
                            <strong>วิธี: </strong>
                            {cart.paymentMethod}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            รายการสินค้า
                        </h2>
                        {cart.cartItems.length === 0 ? (
                            <p>ตะกร้าของคุณว่างเปล่า</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between border-b pb-2"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <Link
                                                to={`/product/${item._id}`}
                                                className="hover:underline"
                                            >
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div>
                                            {item.qty} x {item.price}฿ ={' '}
                                            {item.qty * item.price}฿
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ฝั่งขวา: สรุปราคาทั้งหมด */}
                <div className="border p-6 rounded shadow-sm bg-gray-50 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        สรุปคำสั่งซื้อ
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>ยอดรวมสินค้า:</span>
                            <span>{cart.itemsPrice}฿</span>
                        </div>
                        <div className="flex justify-between">
                            <span>ค่าจัดส่ง:</span>
                            <span>{cart.shippingPrice}฿</span>
                        </div>
                        <div className="flex justify-between">
                            <span>ภาษี (VAT 7%):</span>
                            <span>{cart.taxPrice}฿</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                            <span>ยอดชำระสุทธิ:</span>
                            <span>{addDecimals(cart.totalPrice)}฿</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="w-full bg-black text-white py-3.5 mt-8 hover:bg-secondary transition disabled:bg-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                        // 💡 1. ปิดการใช้งานปุ่มถ้าตะกร้าว่าง หรือ กำลังโหลดข้อมูล (isLoading)
                        disabled={cart.cartItems.length === 0 || isLoading}
                        onClick={placeOrderHandler}
                    >
                        {/* 💡 2. แสดงข้อความตามสถานะการโหลด */}
                        {isLoading ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                กำลังประมวลผล...
                            </>
                        ) : (
                            'ยืนยันการสั่งซื้อ'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrderScreen
