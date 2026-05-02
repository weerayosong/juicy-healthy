import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaTrash } from 'react-icons/fa6'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../slices/cartSlice' // เดี๋ยวจะเอามาใช้ตอนเปลี่ยนจำนวนชิ้นในตะกร้า

const CartScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // 1. ใช้ useSelector เดินไปเปิดโกดัง Redux แล้วหยิบข้อมูล "cart" ออกมา
    const cart = useSelector((state) => state.cart)
    const { cartItems } = cart

    // ฟังก์ชันสแตนด์บายรอไว้สำหรับไป >> หน้าชำระเงิน
    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping')
    }

    // เพิ่มฟังก์ชันจัดการการลบ รอรับคลิก
    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">
                ตะกร้าสินค้าของคุณ
            </h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* คอลัมน์ซ้าย: รายการสินค้า */}
                <div className="md:w-2/3">
                    {cartItems.length === 0 ? (
                        <Message>
                            ตะกร้าของคุณยังว่างเปล่า{' '}
                            <Link
                                to="/"
                                className="text-teal-600 font-bold ml-2 hover:underline"
                            >
                                กลับไปเลือกซื้อสินค้า
                            </Link>
                        </Message>
                    ) : (
                        <div className="bg-white rounded-sm shadow-sm border border-slate-100">
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-slate-100 last:border-0"
                                >
                                    {/* รูปภาพ */}
                                    <div className="w-24 h-24 shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover rounded-sm"
                                        />
                                    </div>

                                    {/* ชื่อสินค้า */}
                                    <div className="grow">
                                        <Link
                                            to={`/product/${item._id}`}
                                            className="text-lg font-bold text-slate-800 hover:text-teal-600 transition"
                                        >
                                            {item.name}
                                        </Link>
                                    </div>

                                    {/* ราคา */}
                                    <div className="text-lg font-bold text-slate-800 w-24 text-right">
                                        ฿{item.price}
                                    </div>

                                    {/* ดรอปดาวน์เปลี่ยนจำนวน */}
                                    <div className="w-24">
                                        <select
                                            value={item.qty}
                                            onChange={(e) =>
                                                dispatch(
                                                    addToCart({
                                                        ...item,
                                                        qty: Number(
                                                            e.target.value,
                                                        ),
                                                    }),
                                                )
                                            }
                                            className="p-2 border border-slate-200 rounded-sm bg-slate-50 w-full text-center focus:outline-none focus:border-teal-600"
                                        >
                                            {[
                                                ...Array(
                                                    Math.min(
                                                        item.countInStock,
                                                        5,
                                                    ),
                                                ).keys(),
                                            ].map((x) => (
                                                <option
                                                    key={x + 1}
                                                    value={x + 1}
                                                >
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* ปุ่มลบสินค้า ผูกonClick */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeFromCartHandler(item._id)
                                        }
                                        className="p-2 text-slate-400 hover:text-red-500 transition"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* คอลัมน์ขวา: สรุปยอดสั่งซื้อ */}
                <div className="md:w-1/3">
                    <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-100 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                            สรุปคำสั่งซื้อ
                        </h2>

                        <div className="flex justify-between items-center mb-6 text-lg">
                            <span className="text-slate-600">
                                จำนวนทั้งหมด (
                                {cartItems.reduce(
                                    (acc, item) => acc + item.qty,
                                    0,
                                )}{' '}
                                ชิ้น)
                            </span>
                            <span className="font-bold text-2xl text-slate-800">
                                ฿
                                {cartItems
                                    .reduce(
                                        (acc, item) =>
                                            acc + item.qty * item.price,
                                        0,
                                    )
                                    .toFixed(2)}
                            </span>
                        </div>

                        <button
                            type="button"
                            className={`w-full py-4 rounded-sm font-bold text-lg transition duration-300 ${
                                cartItems.length === 0
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    : 'bg-slate-950 text-white hover:bg-secondary'
                            }`}
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            ดำเนินการชำระเงิน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartScreen
