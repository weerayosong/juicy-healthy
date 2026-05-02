import { FaSpinner } from 'react-icons/fa6'

const Loader = () => {
    return (
        <div className="flex flex-col justify-center items-center my-20">
            <div className="text-center py-4">กำลังโหลดข้อมูล...</div>
            <FaSpinner className="animate-spin text-4xl text-teal-400" />
        </div>
    )
}

export default Loader
