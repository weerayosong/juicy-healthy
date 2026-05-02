import { Link } from 'react-router-dom'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'

const Product = ({ product }) => {
    return (
        <div className="bg-white rounded-sm shadow-elegant-sm hover:shadow-elegant border border-slate-100 group transition-all duration-300 flex flex-col h-full">
            <div className="overflow-hidden bg-slate-100 aspect-w-4 aspect-h-5 rounded-t-sm relative block">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover object-center group-hover:scale-105 transition duration-700"
                    />
                </Link>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <Link to={`/product/${product._id}`}>
                    <h2 className="text-lg font-medium text-slate-800 group-hover:text-secondary transition line-clamp-2">
                        {product.name}
                    </h2>
                </Link>
                <div className="flex items-center mt-2 text-secondary text-xs">
                    {/* Star by Copy/Paste, for test local only */}
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalfAlt />
                    <span className="text-slate-400 ml-2">
                        ({product.numReviews})
                    </span>
                </div>
                <p className="text-xl font-semibold text-slate-900 mt-auto pt-4">
                    ฿{product.price}
                </p>
            </div>
        </div>
    )
}

export default Product
