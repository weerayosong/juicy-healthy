import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGetTopProductsQuery } from '../slices/productsApiSlice'
import Loader from './Loader'
import Message from './Message'

const ProductCarousel = () => {
    // Redux ดูด Top Products มา
    const { data: products, isLoading, error } = useGetTopProductsQuery()
    const [currentIndex, setCurrentIndex] = useState(0)

    // สั่งให้สไลด์เลื่อนเองอัตโนมัติทุก 5 วินาที
    useEffect(() => {
        if (products && products.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex(
                    (prevIndex) => (prevIndex + 1) % products.length,
                )
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [products])

    if (isLoading) return <Loader />
    if (error)
        return (
            <Message variant="danger">
                {error?.data?.message || error.error}
            </Message>
        )
    // ถ้าไม่มีสินค้าให้โชว์ ก็คืนค่า null ไปเลย ไม่ต้องแสดงอะไร
    if (!products || products.length === 0) return null

    return (
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-[#1a1a1a] rounded-sm overflow-hidden mb-10 group shadow-md">
            {products.map((product, index) => (
                <div
                    key={product._id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex
                            ? 'opacity-100 z-10'
                            : 'opacity-0 z-0'
                    }`}
                >
                    <Link to={`/product/${product._id}`}>
                        {/* รูปภาพสินค้า */}
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-100 hover:opacity-90 transition-opacity duration-500"
                        />
                        {/* แถบข้อความด้านล่าง */}
                        <div className="absolute bottom-0 left-0 right-0 bg-secondary/20 backdrop-blur-sm text-white p-2 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h2 className="text-sm md:text-xl font-bold uppercase tracking-widest drop-shadow-md">
                                {product.name}
                            </h2>
                            <p className="text-secondary font-medium mt-1 text-lg">
                                {product.price} ฿
                            </p>
                        </div>
                    </Link>
                </div>
            ))}

            {/* ปุ่มกดซ้าย-ขวา */}
            <button
                className="absolute top-1/2 left-4 z-20 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/80 w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={() =>
                    setCurrentIndex(
                        (currentIndex - 1 + products.length) % products.length,
                    )
                }
            >
                &#10094;
            </button>
            <button
                className="absolute top-1/2 right-4 z-20 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/80 w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={() =>
                    setCurrentIndex((currentIndex + 1) % products.length)
                }
            >
                &#10095;
            </button>
        </div>
    )
}

export default ProductCarousel
