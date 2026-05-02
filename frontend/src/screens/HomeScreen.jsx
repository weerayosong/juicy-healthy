import products from '../productsLocal'
import Product from '../components/Product'

const HomeScreen = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-medium text-slate-900 tracking-wide">
                    สินค้ามาใหม่
                </h1>
            </div>

            {/* Grid products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default HomeScreen
