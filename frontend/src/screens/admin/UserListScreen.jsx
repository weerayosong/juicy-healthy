import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import {
    useGetUsersQuery,
    useDeleteUserMutation,
} from '../../slices/usersApiSlice'

const UserListScreen = () => {
    // ดึงข้อมูลผู้ใช้มาแสดง (พร้อมฟังก์ชัน refetch เพื่อโหลดข้อมูลใหม่ตอนลบเสร็จ)
    const { data: users, refetch, isLoading, error } = useGetUsersQuery()

    // ดึงฟังก์ชันลบผู้ใช้มาเตรียมไว้
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation()

    const deleteHandler = async (id) => {
        if (
            window.confirm(
                'คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้รายนี้? (การกระทำนี้ย้อนกลับไม่ได้)',
            )
        ) {
            try {
                await deleteUser(id)
                toast.success('ลบผู้ใช้สำเร็จ')
                refetch() // โหลดตารางใหม่ทันทีที่ลบเสร็จ
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 font-sans">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider text-gray-800 border-b pb-4">
                จัดการผู้ใช้งาน (Users)
            </h2>

            {loadingDelete && <Loader />}

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
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4 text-center">Admin</th>
                                <th className="p-4 rounded-tr-sm text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 text-gray-500 font-mono text-sm">
                                        {user._id.substring(0, 10)}...
                                    </td>
                                    <td className="p-4 font-medium text-gray-700">
                                        {user.name}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <a
                                            href={`mailto:${user.email}`}
                                            className="hover:text-secondary transition"
                                        >
                                            {user.email}
                                        </a>
                                    </td>
                                    <td className="p-4 text-center">
                                        {user.isAdmin ? (
                                            <span className="text-green-600 font-bold">
                                                ✓
                                            </span>
                                        ) : (
                                            <span className="text-red-500 font-bold">
                                                ✕
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center flex justify-center gap-2">
                                        {/* ปุ่มแก้ไข (เดี๋ยวเราค่อยไปทำหน้า Edit ต่อ) */}
                                        <Link
                                            to={`/admin/user/${user._id}/edit`}
                                        >
                                            <button className="bg-gray-100 text-gray-700 hover:bg-black hover:text-white px-3 py-1.5 rounded-sm text-sm transition">
                                                แก้ไข
                                            </button>
                                        </Link>

                                        {/* ปุ่มลบ (ซ่อนปุ่มลบถ้าเป็นแอดมิน เพื่อป้องกันการเผลอกดลบตัวเอง) */}
                                        {!user.isAdmin && (
                                            <button
                                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-sm text-sm transition"
                                                onClick={() =>
                                                    deleteHandler(user._id)
                                                }
                                            >
                                                ลบ
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default UserListScreen
