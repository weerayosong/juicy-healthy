import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa' // ใช้ไอคอนแว่นขยายจาก react-icons

const SearchBox = () => {
    const navigate = useNavigate()
    const { keyword: urlKeyword } = useParams()
    const [keyword, setKeyword] = useState(urlKeyword || '')

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/search/${keyword.trim()}`) // ถ้าพิมพ์คำค้นหา ให้ยิงไปที่ URL /search/...
        } else {
            navigate('/')
        }
    }

    return (
        // 💡 หัวใจสำคัญคือต้องเป็น <form> และมี onSubmit ถึงจะกด Enter ได้
        <form
            onSubmit={submitHandler}
            className="relative flex items-center w-full max-w-sm"
        >
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="ค้นหาสินค้า..."
                className="w-full bg-[#1e293b] text-white px-4 py-2 pr-10 rounded-sm focus:outline-none focus:ring-1 focus:ring-secondary border border-gray-700 placeholder-gray-400"
            />
            {/* ปุ่มแว่นขยายต้องเป็น type="submit" ถึงจะกดคลิกแล้วค้นหาได้ */}
            <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-gray-400 hover:text-white transition cursor-pointer"
            >
                <FaSearch />
            </button>
        </form>
    )
}

export default SearchBox
