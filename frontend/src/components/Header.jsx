import { useState } from 'react'
import { FaCarrot } from 'react-icons/fa6'
import {
    FaShoppingBag,
    FaUser,
    FaSlidersH,
    FaTimes,
    FaBars,
    FaSignOutAlt,
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logout } from '../slices/authSlice'

import SearchBox from './SearchBox'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const { cartItems } = useSelector((state) => state.cart)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    // --- ส่วนของระบบ Auth ---
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userInfo } = useSelector((state) => state.auth)
    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/login')
            setIsMenuOpen(false) // ปิดเมนูมือถือตอนกดออก
        } catch (err) {
            console.error(err)
        }
    }
    // ----------------------

    return (
        <header className="bg-slate-950 text-white sticky top-0 z-50 shadow-elegant">
            <svg width="0" height="0" className="absolute">
                <linearGradient
                    id="juice-gradient"
                    x1="0%"
                    y1="75%"
                    x2="75%"
                    y2="0%"
                >
                    <stop stopColor="#f97316" offset="75%" />
                    <stop stopColor="#a3e635" offset="75%" />
                </linearGradient>
            </svg>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="shrink-0 font-bold text-2xl tracking-widest uppercase">
                        <Link to="/" className="group transition duration-300">
                            <div className="flex justify-center items-center text-white">
                                <FaCarrot className="text-6xl px-1 fill-white group-hover:fill-[url(#juice-gradient)] transition-all duration-300" />
                                <span className="text-2xl font-bold tracking-widest uppercase px-1">
                                    <span>Juicy</span>
                                    <span className="group-hover:text-secondary">
                                        Healthy
                                    </span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <SearchBox />
                    </div>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <Link
                            to="/cart"
                            className="hover:text-secondary transition flex items-center group"
                        >
                            <FaShoppingBag className="text-lg mr-2 text-slate-300 group-hover:text-secondary transition" />
                            รถเข็น
                            {/* เงื่อนไข: ถ้ามีของในตะกร้า ค่อยโชว์จำนวน desktop-view */}
                            {cartItems.length > 0 && (
                                <span className="ml-2 bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                                    {cartItems.reduce(
                                        (a, c) => a + Number(c.qty),
                                        0,
                                    )}
                                </span>
                            )}
                        </Link>

                        {/* โลจิกเช็คการ Login (Desktop) */}
                        {userInfo ? (
                            <div className="flex items-center space-x-6">
                                <Link
                                    to="/profile"
                                    className="hover:text-secondary transition flex items-center group text-secondary"
                                >
                                    <FaUser className="text-lg mr-2 transition" />
                                    {userInfo.name}
                                </Link>
                                <button
                                    onClick={logoutHandler}
                                    className="hover:text-red-400 transition flex items-center group text-slate-300"
                                >
                                    <FaSignOutAlt className="text-lg mr-2 group-hover:text-red-400 transition" />
                                    ออก
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hover:text-secondary transition flex items-center group"
                            >
                                <FaUser className="text-lg mr-2 text-slate-300 group-hover:text-secondary transition" />
                                บัญชี
                            </Link>
                        )}

                        {/* โลจิกเช็ค Admin (Desktop) */}
                        {userInfo && userInfo.isAdmin && (
                            <Link
                                to="/admin/orderlist"
                                className="hover:text-secondary transition flex items-center group"
                            >
                                <FaSlidersH className="text-lg mr-2 text-slate-300 group-hover:text-secondary transition" />
                                จัดการระบบ
                            </Link>
                        )}
                    </div>

                    {/* Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-slate-300 hover:text-white focus:outline-none text-2xl p-2"
                        >
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-4 pb-6 space-y-4 shadow-inner absolute w-full">
                    {/* Search Bar (Mobile) */}
                    <SearchBox />

                    {/* Nav Links (Mobile) */}
                    <div className="flex flex-col space-y-5 text-base font-medium">
                        <Link
                            onClick={toggleMenu}
                            to="/cart"
                            className="hover:text-secondary transition flex items-center text-slate-200"
                        >
                            <FaShoppingBag className="text-xl mr-4 text-slate-400" />
                            รถเข็น
                            {/* เงื่อนไข: ถ้ามีของในตะกร้า ค่อยโชว์จำนวน */}
                            {cartItems.length > 0 && (
                                <span className="ml-2 bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                                    {cartItems.reduce(
                                        (a, c) => a + Number(c.qty),
                                        0,
                                    )}
                                </span>
                            )}
                        </Link>

                        {/* โลจิกเช็คการ Login (Mobile) */}
                        {userInfo ? (
                            <>
                                <Link
                                    onClick={toggleMenu}
                                    to="/profile"
                                    className="hover:text-secondary transition flex items-center text-secondary"
                                >
                                    <FaUser className="text-xl mr-4" />
                                    โปรไฟล์ ({userInfo.name})
                                </Link>
                                <button
                                    onClick={logoutHandler}
                                    className="hover:text-red-400 transition flex items-center text-slate-200 text-left"
                                >
                                    <FaSignOutAlt className="text-xl mr-4 text-slate-400" />
                                    ออกจากระบบ
                                </button>
                            </>
                        ) : (
                            <Link
                                onClick={toggleMenu}
                                to="/login"
                                className="hover:text-secondary transition flex items-center text-slate-200"
                            >
                                <FaUser className="text-xl mr-4 text-slate-400" />
                                บัญชี
                            </Link>
                        )}

                        {/* โลจิกเช็ค Admin (Mobile) */}
                        {userInfo && userInfo.isAdmin && (
                            <Link
                                onClick={toggleMenu}
                                to="/admin/orderlist"
                                className="hover:text-secondary transition flex items-center text-slate-200"
                            >
                                <FaSlidersH className="text-xl mr-4 text-slate-400" />
                                จัดการระบบ
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header

// แบบ && (Shorthand(Logical AND Short-circuit)) = นิยมสุด เขียนสั้น เหมาะกับกรณีที่ "ถ้าจริงให้โชว์ ถ้าเท็จไม่ต้องทำอะไร"
// แบบ || (Shorthand(Logical OR Short-circuit)) = นิยมสุด เขียนสั้น เหมาะกับกรณีที่ "ถ้าเท็จให้โชว์ ถ้าจริงไม่ต้องทำอะไร"
// แบบ ? : (Ternary) = เหมาะกับกรณีที่ "ถ้าจริงโชว์แบบ A ถ้าเท็จให้โชว์แบบ B"
// แบบ if = เหมาะกับเงื่อนไขที่ซับซ้อนมากๆ หรือมีการคำนวณหลายบรรทัดก่อนแสดงผลครับ
