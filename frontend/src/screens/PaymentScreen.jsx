import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal') // ตั้งค่าเริ่มต้นเป็น PayPal

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    // ดักจับ: ถ้าลูกค้ายังไม่ได้กรอกที่อยู่ ให้เตะกลับไปหน้า Shipping ก่อน
    useEffect(() => {
        if (!shippingAddress?.address) {
            navigate('/shipping')
        }
    }, [navigate, shippingAddress])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder') // เลือกเสร็จปุ๊บ ไปหน้าสรุปยอดต่อเลย
    }

    return (
        <div className="flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                {/* แถบสถานะการสั่งซื้อ */}
                <CheckoutSteps step1 step2 step3 />

                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    วิธีการชำระเงิน
                </h2>

                <form onSubmit={submitHandler}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            เลือกช่องทางการชำระเงิน
                        </label>
                        <div className="space-y-3">
                            {/* PayPal */}
                            <label className="flex items-center p-4 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition">
                                <input
                                    type="radio"
                                    className="form-radio h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                                    id="PayPal"
                                    name="paymentMethod"
                                    value="PayPal"
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                />
                                <span className="ml-3 text-gray-800 font-medium">
                                    PayPal
                                </span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-medium py-2.5 rounded-sm hover:bg-secondary transition mt-4"
                    >
                        ดำเนินการต่อ
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PaymentScreen
