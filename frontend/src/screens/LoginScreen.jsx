import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'

const LoginScreen = () => {
    // 1. สร้าง State ไว้เก็บค่าที่ลูกค้าพิมพ์ในช่อง Email และ Password
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // 2. ดึงฮุกสำหรับยิง API Login และดึงข้อมูล userInfo จาก Redux ว่ามีคนล็อกอินอยู่ไหม
    const [login, { isLoading }] = useLoginMutation()
    const { userInfo } = useSelector((state) => state.auth)

    // 3. เช็ค URL ว่ามีพ่วงคำว่า ?redirect=... มาด้วยไหม (เช่น โดนเตะมาจากหน้าตะกร้า)
    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    // 4. ถ้ามีข้อมูลล็อกอินอยู่แล้ว ให้เด้งไปหน้าแรก (หรือหน้า redirect) ทันที ไม่ต้องมาหน้าล็อกอินซ้ำ
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    // 5. ฟังก์ชันเมื่อกดปุ่ม "เข้าสู่ระบบ"
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            // ยิง API ไปที่ Backend (ใช้ .unwrap() เพื่อให้จับ Error ได้ง่ายขึ้น)
            const res = await login({ email, password }).unwrap()

            // ถ้าสำเร็จ เอาข้อมูลไปเก็บใน Redux และ Local Storage
            dispatch(setCredentials({ ...res }))

            // เปลี่ยนหน้าไปยัง URL ที่ตั้งไว้
            navigate(redirect)
        } catch (err) {
            // ถ้าผิดพลาด (เช่น รหัสผิด) ให้แจ้งเตือนชั่วคราวด้วย alert ก่อน (เดี๋ยวเราค่อยติด Toast ทีหลัง)
            alert(err?.data?.message || err.error)
        }
    }

    return (
        <div className="flex justify-center items-center py-12">
            {/* Form */}
            <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    เข้าสู่ระบบ
                </h1>

                <form onSubmit={submitHandler} className="space-y-5">
                    {/* ช่องกรอก Email */}
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
                            required
                        />
                    </div>

                    {/* ช่องกรอก Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            รหัสผ่าน
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="กรอกรหัสผ่าน"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                            required
                        />
                    </div>

                    {/* ปุ่ม Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white font-medium py-2.5 rounded-sm hover:bg-secondary transition disabled:bg-gray-400"
                    >
                        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                {/* ลิงก์ไปหน้าสมัครสมาชิก (พ่วง redirect ไปด้วยถ้ามี) */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    ยังไม่มีบัญชีใช่ไหม?{' '}
                    <Link
                        to={
                            redirect
                                ? `/register?redirect=${redirect}`
                                : '/register'
                        }
                        className="text-secondary font-semibold hover:underline"
                    >
                        สมัครสมาชิกที่นี่
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen
