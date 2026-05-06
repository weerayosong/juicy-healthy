import { useParams, Link } from 'react-router-dom'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'

const HomeScreen = () => {
    // 1. ดึง keyword จาก URL ที่พิมพ์ในกล่องค้นหา
    const { keyword, pageNumber } = useParams()

    // 2. ใช้พลังของ Redux ดึงข้อมูลแทน axios แบบเดิม (และส่ง keyword เข้าไปกรองข้อมูลด้วย)
    // data มาทั้งก้อน (ซึ่งในก้อนนั้นจะมี products, page, pages ซ่อนอยู่)
    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
    })

    return (
        <>
            {/* ถ้ามีการค้นหา ให้มีปุ่มกดกลับหน้าแรก (เพื่อดึงสินค้าทั้งหมดกลับมา) */}
            {keyword && (
                <Link
                    to="/"
                    className="mb-4 inline-block text-gray-600 hover:text-black transition font-medium"
                >
                    &larr; กลับดูสินค้าทั้งหมด
                </Link>
            )}

            <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-wide">
                {keyword
                    ? `ผลการค้นหาสำหรับ: "${keyword}"`
                    : 'สินค้าสุขภาพล่าสุด'}
            </h1>
            <p className="text-md md:text-xl font-bold text-slate-600 mb-8 mt-2">
                Fetch ผ่าน Redux ขนส่งสดใหม่จาก Backend
            </p>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {/* 💡 เปลี่ยนเป็น data.products.map เพื่อเจาะทะลุเข้าไปเอา Array สินค้า */}
                        {data.products.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>

                    {/* 💡 เอาปุ่ม Paginate มาวางตรงนี้ครับ */}
                    <Paginate
                        pages={data.pages}
                        page={data.page}
                        keyword={keyword ? keyword : ''}
                    />
                </>
            )}
        </>
    )
}

export default HomeScreen
