import { useState } from 'react'
import { FaCarrot } from 'react-icons/fa6'
import {
    FaSearch,
    FaShoppingBag,
    FaUser,
    FaSlidersH,
    FaTimes,
    FaBars,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

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
                                {/* 2. ไอคอนแครอท: เริ่มต้น fill เป็นสีขาว พอ Hover ให้เรียกใช้ url(#juice-gradient) */}
                                <FaCarrot className="text-6xl px-1 fill-white group-hover:fill-[url(#juice-gradient)] transition-all duration-300" />

                                <span className="text-2xl font-bold tracking-widest uppercase px-1">
                                    <span>Juicy</span>

                                    <span className="group-hover:text-teal-200">
                                        Healthy
                                    </span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <div className="flex bg-slate-900 rounded-sm overflow-hidden border border-slate-800 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition shadow-inner">
                            <input
                                type="text"
                                placeholder="ค้นหาสินค้า..."
                                className="w-full px-4 py-2 bg-transparent text-white placeholder-slate-400 focus:outline-none"
                            />
                            <button className="text-slate-300 px-5 py-3 hover:text-secondary hover:bg-slate-800 transition flex items-center justify-center">
                                <FaSearch />
                            </button>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <Link
                            to="/cart"
                            className="hover:text-secondary transition flex items-center group"
                        >
                            <FaShoppingBag className="text-lg mr-2 text-slate-300 group-hover:text-secondary transition" />
                            รถเข็น
                            <span className="ml-1.5 bg-secondary text-white text-xs px-2 py-0.5 rounded-sm shadow-sm">
                                3
                            </span>
                        </Link>

                        <Link
                            to="/login"
                            className="hover:text-secondary transition flex items-center group"
                        >
                            <FaUser className="text-lg mr-2 text-slate-300 group-hover:text-secondary transition" />
                            บัญชี
                        </Link>

                        <Link
                            to="/admin/orderlist"
                            className="hover:text-secondary transition flex items-center group"
                        >
                            <FaSlidersH className="text-lg mr-2 text-slate-300 group-hover:text-secondary transition" />
                            จัดการระบบ
                        </Link>
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
                    {/* Search Bar */}
                    <div className="flex bg-slate-950 rounded-sm overflow-hidden border border-slate-800 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition shadow-inner mb-6">
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า..."
                            className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-400 focus:outline-none"
                        />
                        <button className="text-slate-300 px-5 hover:text-secondary transition flex items-center justify-center">
                            <FaSearch />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <div className="flex flex-col space-y-5 text-base font-medium">
                        <Link
                            onClick={toggleMenu}
                            to="/cart"
                            className="hover:text-secondary transition flex items-center text-slate-200"
                        >
                            <FaShoppingBag className="text-xl mr-4 text-slate-400" />
                            รถเข็น
                            <span className="ml-2 bg-secondary text-white text-xs px-2 py-0.5 rounded-sm shadow-sm">
                                3
                            </span>
                        </Link>

                        <Link
                            onClick={toggleMenu}
                            to="/login"
                            className="hover:text-secondary transition flex items-center text-slate-200"
                        >
                            <FaUser className="text-xl mr-4 text-slate-400" />
                            บัญชี
                        </Link>

                        <Link
                            onClick={toggleMenu}
                            to="/admin/orderlist"
                            className="hover:text-secondary transition flex items-center text-slate-200"
                        >
                            <FaSlidersH className="text-xl mr-4 text-slate-400" />
                            จัดการระบบ
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

// แบบ && (Shorthand(Logical AND Short-circuit)) = นิยมสุด เขียนสั้น เหมาะกับกรณีที่ "ถ้าจริงให้โชว์ ถ้าเท็จไม่ต้องทำอะไร"
// แบบ || (Shorthand(Logical OR Short-circuit)) = นิยมสุด เขียนสั้น เหมาะกับกรณีที่ "ถ้าเท็จให้โชว์ ถ้าจริงไม่ต้องทำอะไร"
// แบบ ? : (Ternary) = เหมาะกับกรณีที่ "ถ้าจริงโชว์แบบ A ถ้าเท็จให้โชว์แบบ B"
// แบบ if = เหมาะกับเงื่อนไขที่ซับซ้อนมากๆ หรือมีการคำนวณหลายบรรทัดก่อนแสดงผลครับ

export default Header
