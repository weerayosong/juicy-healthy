import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice'
import Message from '../components/Message'
import Loader from '../components/Loader'

const OrderScreen = () => {
    const { id: orderId } = useParams()
    const { userInfo } = useSelector((state) => state.auth)

    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId)

    if (!isLoading && !error && order && userInfo) {
        // ถ้าไม่ใช่เจ้าของออเดอร์ และไม่ใช่ Admin ให้แสดงข้อความเตือน
        if (order.user._id !== userInfo._id && !userInfo.isAdmin) {
            return (
                <Message variant="danger">
                    คุณไม่มีสิทธิ์เข้าดูออเดอร์นี้
                </Message>
            )
        }
    }

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">
            {error?.data?.message || error.error}
        </Message>
    ) : (
        <div className="container mx-auto py-8 px-4 font-sans">
            <h1 className="text-2xl font-bold mb-6 uppercase tracking-wider">
                Order ID:{' '}
                <span className="text-gray-500 text-lg font-normal">
                    {order._id}
                </span>
            </h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* ฝั่งซ้าย: ข้อมูลลูกค้าและรายการสินค้า */}
                <div className="md:col-span-2 space-y-6">
                    {/* 1. ข้อมูลการจัดส่ง */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-3 uppercase">
                            Shipping
                        </h2>
                        <p className="mb-1">
                            <strong>Name: </strong> {order.user.name}
                        </p>
                        <p className="mb-1">
                            <strong>Email: </strong> {order.user.email}
                        </p>
                        <p className="mb-4 text-gray-600">
                            <strong>Address: </strong>
                            {order.shippingAddress.address},{' '}
                            {order.shippingAddress.city},{' '}
                            {order.shippingAddress.postalCode}
                        </p>
                        {order.isDelivered ? (
                            <Message variant="success">
                                Delivered on {order.deliveredAt}
                            </Message>
                        ) : (
                            <Message variant="danger">Not Delivered</Message>
                        )}
                    </div>

                    {/* 2. วิธีชำระเงิน */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-3 uppercase">
                            Payment Method
                        </h2>
                        <p className="mb-4 text-gray-600">
                            <strong>Method: </strong> {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message variant="success">
                                Paid on {order.paidAt}
                            </Message>
                        ) : (
                            <Message variant="danger">Not Paid</Message>
                        )}
                    </div>

                    {/* 3. รายการสินค้า */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 uppercase">
                            Order Items
                        </h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border-b pb-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-sm border"
                                        />
                                        <Link
                                            to={`/product/${item.product}`}
                                            className="hover:text-secondary transition font-medium"
                                        >
                                            {item.name}
                                        </Link>
                                    </div>
                                    <div className="text-gray-600">
                                        {item.qty} x {item.price}฿ ={' '}
                                        <span className="text-black font-semibold">
                                            {(
                                                item.qty * item.price
                                            ).toLocaleString()}
                                            ฿
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ฝั่งขวา: สรุปราคาทั้งหมด */}
                <div className="h-fit">
                    <div className="border border-gray-100 p-6 rounded-sm shadow-sm bg-white">
                        <h2 className="text-xl font-semibold mb-6 text-center uppercase tracking-widest border-b pb-4">
                            Order Summary
                        </h2>
                        <div className="space-y-3 text-gray-600">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>{order.itemsPrice}฿</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{order.shippingPrice}฿</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (7%)</span>
                                <span>{order.taxPrice}฿</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-black border-t pt-4 mt-4">
                                <span>Total</span>
                                <span>{addDecimals(order.totalPrice)}฿</span>
                            </div>
                        </div>

                        {/* ปุ่มชำระเงิน (เฟสถัดไป) จะมาวางตรงนี้ครับ */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderScreen
