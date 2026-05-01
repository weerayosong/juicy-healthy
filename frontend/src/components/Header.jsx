import { FaSearch, FaShoppingBag, FaUser, FaSlidersH } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className="bg-slate-950 text-white sticky top-0 z-50 shadow-elegant">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="shrink-0 font-bold text-2xl tracking-widest uppercase">
                        <Link
                            to="/"
                            className="hover:text-secondary transition duration-300"
                        >
                            Juicy Healthy
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
                    <div className="flex items-center space-x-8 text-sm font-medium">
                        <Link
                            to="/cart"
                            className="hover:text-secondary transition flex items-center group"
                        >
                            <FaShoppingBag className="text-lg mr-2 text-slate-300 group-hover:text-secondary transition" />
                            รถเข็น
                            <span className="ml-1.5 bg-secondary text-white text-[10px] px-2 py-0.5 rounded-sm shadow-sm">
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

                        {/* Admin Menu อย่าลืมซ่อนตอนไม่เทสแล้ว */}
                        <Link
                            to="/admin/orderlist"
                            className="hover:text-secondary transition flex items-center group"
                        >
                            <FaSlidersH className="text-lg mr-2 text-slate-300 group-hover:text-secondary transition" />
                            จัดการระบบ
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
