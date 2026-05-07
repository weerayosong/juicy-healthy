import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const Rating = ({ value, text }) => {
    return (
        <div className="flex items-center">
            <div className="flex text-yellow-400 text-sm gap-0.5">
                <span>
                    {value >= 1 ? (
                        <FaStar />
                    ) : value >= 0.5 ? (
                        <FaStarHalfAlt />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
                <span>
                    {value >= 2 ? (
                        <FaStar />
                    ) : value >= 1.5 ? (
                        <FaStarHalfAlt />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
                <span>
                    {value >= 3 ? (
                        <FaStar />
                    ) : value >= 2.5 ? (
                        <FaStarHalfAlt />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
                <span>
                    {value >= 4 ? (
                        <FaStar />
                    ) : value >= 3.5 ? (
                        <FaStarHalfAlt />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
                <span>
                    {value >= 5 ? (
                        <FaStar />
                    ) : value >= 4.5 ? (
                        <FaStarHalfAlt />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
            </div>

            {/* ถ้ามีการส่ง text มา (เช่น "3 รีวิว") ให้โชว์ตรงนี้ */}
            {text && (
                <span className="ml-2 text-sm text-slate-600 font-medium">
                    {text}
                </span>
            )}
        </div>
    )
}

export default Rating
