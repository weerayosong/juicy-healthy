import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
} from '../../slices/productsApiSlice'

import { useParams } from 'react-router-dom'
import Paginate from '../../components/Paginate'

const ProductListScreen = () => {
    const { pageNumber } = useParams()

    // ดึงข้อมูลสินค้าทั้งหมดมาแสดง
    const { data, isLoading, error, refetch } = useGetProductsQuery({
        pageNumber,
    })

    // ฟังก์ชันสร้างและลบสินค้า
    const [createProduct, { isLoading: loadingCreate }] =
        useCreateProductMutation()
    const [deleteProduct, { isLoading: loadingDelete }] =
        useDeleteProductMutation()

    const createProductHandler = async () => {
        if (
            window.confirm(
                'คุณต้องการสร้างสินค้าจำลอง (Sample Product) ใหม่ใช่หรือไม่?',
            )
        ) {
            try {
                await createProduct()
                refetch()
                toast.success('สร้างสินค้าใหม่สำเร็จ! ไปกดแก้ไขข้อมูลต่อได้เลย')
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    const deleteHandler = async (id) => {
        if (
            window.confirm(
                'แน่ใจหรือไม่ว่าต้องการลบสินค้านี้? (ลบแล้วกู้คืนไม่ได้นะ!)',
            )
        ) {
            try {
                await deleteProduct(id)
                refetch()
                toast.success('ลบสินค้าสำเร็จ')
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 font-sans">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-800">
                    จัดการสินค้า (Products)
                </h2>
                <button
                    className="bg-black text-white px-4 py-2 rounded-sm hover:bg-secondary transition flex items-center gap-2"
                    onClick={createProductHandler}
                >
                    <span className="text-xl">+</span> สร้างสินค้าใหม่
                </button>
            </div>

            {loadingCreate && <Loader />}
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
                                <th className="p-4">Price</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Brand</th>
                                <th className="p-4 rounded-tr-sm text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="p-4 text-gray-500 font-mono text-sm">
                                        {product._id.substring(0, 10)}...
                                    </td>
                                    <td className="p-4 font-medium text-gray-700">
                                        {product.name}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        ฿{product.price}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {product.category}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {product.brand}
                                    </td>
                                    <td className="p-4 text-center flex justify-center gap-2">
                                        {/* ปุ่มแก้ไข */}
                                        <Link
                                            to={`/admin/product/${product._id}/edit`}
                                        >
                                            <button className="bg-gray-100 text-gray-700 hover:bg-black hover:text-white px-3 py-1.5 rounded-sm text-sm transition">
                                                แก้ไข
                                            </button>
                                        </Link>

                                        {/* ปุ่มลบ */}
                                        <button
                                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-sm text-sm transition"
                                            onClick={() =>
                                                deleteHandler(product._id)
                                            }
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Paginate พร้อมเปิดโหมด isAdmin={true} */}
                    <Paginate
                        pages={data.pages}
                        page={data.page}
                        isAdmin={true}
                    />
                </div>
            )}
        </div>
    )
}

export default ProductListScreen
