import { Link, useParams } from 'react-router-dom'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { useGetOrdersQuery } from '../../slices/ordersApiSlice'

import Paginate from '../../components/Paginate'

const OrderListScreen = () => {
    const { pageNumber } = useParams()
    const { data, isLoading, error } = useGetOrdersQuery({ pageNumber }) // ส่งทั้งก้อน data ไม่ได้เอาแค่ data:orders ละ

    return (
        <div className="container mx-auto py-8 px-4 font-sans">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider text-gray-800 border-b pb-4">
                จัดการคำสั่งซื้อ (Orders)
            </h2>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="overflow-x-auto bg-white rounded-sm shadow-sm border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white uppercase text-sm tracking-wider">
                                <th className="p-4 rounded-tl-sm">ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Paid</th>
                                <th className="p-4">Delivered</th>
                                <th className="p-4 rounded-tr-sm"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* เจาะทะลุ data.orders */}
                            {data.orders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 text-gray-500 font-mono text-sm">
                                        {order._id.substring(0, 10)}...
                                    </td>
                                    <td className="p-4 font-medium text-gray-700">
                                        {order.user && order.user.name}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {order.createdAt.substring(0, 10)}
                                    </td>
                                    <td className="p-4 font-semibold text-black">
                                        {order.totalPrice.toLocaleString()}฿
                                    </td>
                                    <td className="p-4">
                                        {order.isPaid ? (
                                            <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-sm text-xs font-medium">
                                                {order.paidAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded-sm text-xs font-medium">
                                                ❌ รอชำระเงิน
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {order.isDelivered ? (
                                            <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-sm text-xs font-medium">
                                                {order.deliveredAt.substring(
                                                    0,
                                                    10,
                                                )}
                                            </span>
                                        ) : (
                                            <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded-sm text-xs font-medium">
                                                ❌ ยังไม่จัดส่ง
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link to={`/order/${order._id}`}>
                                            <button className="bg-gray-100 text-gray-700 hover:bg-black hover:text-white px-4 py-2 rounded-sm text-sm font-medium transition">
                                                รายละเอียด
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Paginate พร้อมบอกว่านี่คือหน้า Order*/}
                    <Paginate
                        pages={data.pages}
                        page={data.page}
                        isAdmin={true}
                        isOrder={true}
                    />
                </div>
            )}
        </div>
    )
}

export default OrderListScreen
