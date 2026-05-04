import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { setCredentials } from '../slices/authSlice'
import { useProfileMutation } from '../slices/usersApiSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'

const ProfileScreen = () => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)

    // ยัดค่าเริ่มต้นจาก Redux เข้าไปตอนสร้าง useState เลย ไม่มี Error Cascading render แน่นอน
    const [name, setName] = useState(userInfo?.name || '')
    const [email, setEmail] = useState(userInfo?.email || '')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Mutations & Queries จาก Redux Slices
    const [updateProfile, { isLoading: loadingUpdateProfile }] =
        useProfileMutation()
    const {
        data: orders,
        isLoading: loadingOrders,
        error: errorOrders,
    } = useGetMyOrdersQuery()

    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้งครับ')
            return
        }

        try {
            const res = await updateProfile({
                _id: userInfo._id,
                name,
                email,
                password,
            }).unwrap()

            dispatch(setCredentials({ ...res }))

            toast.success('อัปเดตข้อมูลโปรไฟล์สำเร็จ! 🎉')
            setPassword('')
            setConfirmPassword('')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="grid md:grid-cols-4 gap-8">
                {/* ================= ฝั่งซ้าย: แก้ไขโปรไฟล์ ================= */}
                <div className="md:col-span-1 bg-white p-6 rounded-sm shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center border-b pb-4">
                        โปรไฟล์ของฉัน
                    </h2>

                    <form onSubmit={submitHandler} className="space-y-4">
                        {/* ชื่อ-นามสกุล */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ชื่อ - นามสกุล
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="กรอกชื่อของคุณ"
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                            />
                        </div>

                        {/* อีเมล */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                อีเมล
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="กรอกอีเมลของคุณ"
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-4">
                            <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-sm border border-gray-100">
                                * ปล่อยช่องรหัสผ่านว่างไว้
                                หากไม่ต้องการเปลี่ยนรหัสผ่าน
                            </p>

                            {/* รหัสผ่านใหม่ */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    รหัสผ่านใหม่
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="ตั้งรหัสผ่านใหม่"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                                />
                            </div>

                            {/* ยืนยันรหัสผ่านใหม่ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ยืนยันรหัสผ่านใหม่
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingUpdateProfile}
                            className="w-full bg-black text-white font-medium py-2.5 rounded-sm hover:bg-secondary transition disabled:bg-gray-400 mt-6"
                        >
                            {loadingUpdateProfile
                                ? 'กำลังอัปเดต...'
                                : 'อัปเดตข้อมูล'}
                        </button>
                    </form>
                </div>

                {/* ================= ฝั่งขวา: ประวัติการสั่งซื้อ ================= */}
                <div className="md:col-span-3 bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 uppercase tracking-wider border-b pb-4">
                        ประวัติการสั่งซื้อ (My Orders)
                    </h2>

                    {loadingOrders ? (
                        <Loader />
                    ) : errorOrders ? (
                        <Message variant="danger">
                            {errorOrders?.data?.message || errorOrders.error}
                        </Message>
                    ) : orders.length === 0 ? (
                        <Message>
                            คุณยังไม่มีประวัติการสั่งซื้อครับ ไปช้อปกันเลย! 🛒
                        </Message>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b text-gray-600 text-sm tracking-wider">
                                        <th className="p-4 font-medium uppercase">
                                            Order ID
                                        </th>
                                        <th className="p-4 font-medium uppercase">
                                            Date
                                        </th>
                                        <th className="p-4 font-medium uppercase">
                                            Total
                                        </th>
                                        <th className="p-4 font-medium uppercase">
                                            Paid
                                        </th>
                                        <th className="p-4 font-medium uppercase">
                                            Delivered
                                        </th>
                                        <th className="p-4 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="p-4 text-gray-500 font-mono text-sm">
                                                {order._id.substring(0, 10)}...
                                            </td>
                                            <td className="p-4 text-gray-700">
                                                {order.createdAt.substring(
                                                    0,
                                                    10,
                                                )}
                                            </td>
                                            <td className="p-4 font-medium text-black">
                                                {order.totalPrice.toLocaleString()}
                                                ฿
                                            </td>
                                            <td className="p-4">
                                                {order.isPaid ? (
                                                    <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-sm text-xs font-medium">
                                                        {order.paidAt.substring(
                                                            0,
                                                            10,
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded-sm text-xs font-medium">
                                                        รอชำระเงิน
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
                                                        กำลังดำเนินการ
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link
                                                    to={`/order/${order._id}`}
                                                >
                                                    <button className="bg-gray-100 text-gray-700 hover:bg-secondary hover:text-white px-4 py-2 rounded-sm text-sm font-medium transition">
                                                        รายละเอียด
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileScreen
