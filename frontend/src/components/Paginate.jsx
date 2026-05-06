import { Link } from 'react-router-dom'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    // ถ้ามีหน้าเดียว ไม่ต้องโชว์ปุ่ม
    if (pages <= 1) return null

    return (
        <div className="flex justify-center mt-10 mb-6">
            <nav
                className="inline-flex rounded-sm shadow-sm -space-x-px"
                aria-label="Pagination"
            >
                {[...Array(pages).keys()].map((x) => {
                    // สร้าง URL ปลายทาง ว่ากดแล้วจะไปไหน
                    let destination
                    if (isAdmin) {
                        destination = `/admin/productlist/${x + 1}`
                    } else if (keyword) {
                        destination = `/search/${keyword}/page/${x + 1}`
                    } else {
                        destination = `/page/${x + 1}`
                    }

                    return (
                        <Link
                            key={x + 1}
                            to={destination}
                            className={`relative inline-flex items-center px-5 py-2 border text-sm font-medium transition-colors ${
                                x + 1 === page
                                    ? 'z-10 bg-secondary border-teal-200 text-white' // หน้าปัจจุบัน สีsecond
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100' // หน้าอื่นๆ สีขาว
                            } ${x === 0 ? 'rounded-l-sm' : ''} ${
                                x === pages - 1 ? 'rounded-r-sm' : ''
                            }`}
                        >
                            {x + 1}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

export default Paginate
