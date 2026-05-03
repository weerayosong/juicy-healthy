import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useProfileMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'

const ProfileScreen = () => {
    const dispatch = useDispatch()
    // ดึงข้อมูลผู้ใช้ปัจจุบันจาก Redux
    const { userInfo } = useSelector((state) => state.auth)

    // เมื่อเข้ามาหน้านี้ ให้ดึงชื่อและอีเมลที่มีอยู่แล้วมาใส่รอไว้ในช่องเลย
    // ในเมื่อข้อมูล userInfo ของเรามันอยู่ใน Redux (ซึ่งโหลดเสร็จตั้งแต่ตอนเปิดเว็บแล้ว) เราไม่จำเป็นต้องรอให้ useEffect มาอัปเดตให้ เราสามารถ ยัดค่าเริ่มต้นเข้าไปตอนสร้าง useState ได้เลย
    const [name, setName] = useState(userInfo?.name || '') // ใช้ ?. และ || '' เพื่อดัก Error ในกรณีที่ลูกค้ายังไม่ได้ล็อกอิน
    const [email, setEmail] = useState(userInfo?.email || '')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [updateProfile, { isLoading }] = useProfileMutation()

    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้งครับ')
            return
        }

        try {
            // ส่งข้อมูลไปอัปเดตที่ Backend
            const res = await updateProfile({
                _id: userInfo._id,
                name,
                email,
                password,
            }).unwrap()

            // อัปเดตข้อมูลใหม่ลงใน Redux และ LocalStorage
            dispatch(setCredentials({ ...res }))

            alert('อัปเดตข้อมูลโปรไฟล์สำเร็จ! 🎉')
            // เคลียร์ช่องรหัสผ่านให้ว่างหลังอัปเดตเสร็จ
            setPassword('')
            setConfirmPassword('')
        } catch (err) {
            alert(err?.data?.message || err.error)
        }
    }

    return (
        <div className="flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
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

                    <div className="border-t border-gray-100 pt-4 mt-2">
                        <p className="text-sm text-gray-500 mb-4">
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
                                onChange={(e) => setPassword(e.target.value)}
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
                        disabled={isLoading}
                        className="w-full bg-black text-white font-medium py-2.5 rounded-sm hover:bg-secondary transition disabled:bg-gray-400 mt-4"
                    >
                        {isLoading ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูล'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ProfileScreen
