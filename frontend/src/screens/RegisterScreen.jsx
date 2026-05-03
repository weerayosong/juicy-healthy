import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [register, { isLoading }] = useRegisterMutation()
    const { userInfo } = useSelector((state) => state.auth)

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault()

        // ดักจับ: เช็คว่ารหัสผ่าน 2 ช่องตรงกันไหม
        if (password !== confirmPassword) {
            alert('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้งครับ')
            return
        }

        try {
            const res = await register({ name, email, password }).unwrap()
            dispatch(setCredentials({ ...res }))
            navigate(redirect)
        } catch (err) {
            alert(err?.data?.message || err.error)
        }
    }

    return (
        <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    สมัครสมาชิก
                </h1>

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
                            required
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
                            required
                        />
                    </div>

                    {/* รหัสผ่าน */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            รหัสผ่าน
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="ตั้งรหัสผ่าน"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                            required
                        />
                    </div>

                    {/* ยืนยันรหัสผ่าน */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ยืนยันรหัสผ่าน
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white font-medium py-2.5 rounded-sm hover:bg-secondary transition disabled:bg-gray-400 mt-2"
                    >
                        {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิกเลย'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    มีบัญชีอยู่แล้วใช่ไหม?{' '}
                    <Link
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}
                        className="text-secondary font-semibold hover:underline"
                    >
                        เข้าสู่ระบบที่นี่
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen
