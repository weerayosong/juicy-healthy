import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import {
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} from '../../slices/usersApiSlice'

const UserEditScreen = () => {
    const { id: userId } = useParams()
    const navigate = useNavigate()

    // 1. ดึงข้อมูลจาก API
    const {
        data: user,
        isLoading,
        error,
        refetch,
    } = useGetUserDetailsQuery(userId)

    // 2. สร้าง State ฟอร์ม
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    // 3. React 18+ Trick: ใช้ State เช็ค ID เพื่อเซ็ตค่าเริ่มต้นแทน useEffect
    const [loadedUserId, setLoadedUserId] = useState(null)

    // ถ้าดึงข้อมูล user มาแล้ว และยังไม่ได้โหลดใส่ฟอร์ม (ID ไม่ตรงกัน) ให้ใส่ข้อมูลและจำ ID ไว้
    if (user && loadedUserId !== user._id) {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
        setLoadedUserId(user._id) // จำไว้ว่าโหลดคนนี้ใส่ฟอร์มแล้ว จะได้ไม่ไปทับตอนที่เรากำลังพิมพ์แก้
    }

    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation()

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await updateUser({ userId, name, email, isAdmin })
            toast.success('อัปเดตข้อมูลผู้ใช้สำเร็จ')
            refetch()
            navigate('/admin/userlist')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 font-sans max-w-2xl">
            <Link
                to="/admin/userlist"
                className="text-gray-600 hover:text-black transition mb-6 inline-block font-medium"
            >
                &larr; กลับไปหน้ารายชื่อผู้ใช้
            </Link>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider text-gray-800 border-b pb-4">
                    แก้ไขข้อมูลผู้ใช้ (Edit User)
                </h2>

                {loadingUpdate && <Loader />}

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <form onSubmit={submitHandler} className="space-y-5">
                        {/* ชื่อ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ชื่อ - นามสกุล
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="กรอกชื่อ"
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
                                placeholder="กรอกอีเมล"
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                            />
                        </div>

                        {/* สถานะ Admin (Checkbox) */}
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                id="isAdmin"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded-sm cursor-pointer"
                            />
                            <label
                                htmlFor="isAdmin"
                                className="ml-2 block text-sm text-gray-900 font-medium cursor-pointer"
                            >
                                ให้สิทธิ์เป็นผู้ดูแลระบบ (Admin)
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingUpdate}
                            className="w-full bg-black text-white font-medium py-3 rounded-sm hover:bg-secondary transition disabled:bg-gray-400 mt-6"
                        >
                            {loadingUpdate ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูล'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default UserEditScreen
