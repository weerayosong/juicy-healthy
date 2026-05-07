import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1
    // ถ้ารับ keyword มาจาก URL ให้สร้างเงื่อนไขค้นหาด้วย Regex
    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } }
        : {}

    const count = await Product.countDocuments({ ...keyword })

    // เพิ่ม .sort({ _id: 1 }) เข้าไปเพื่อบังคับให้เรียงตามคิว 1-50
    // ดึงข้อมูลสินค้าโดยใช้ .limit() และ .skip() เพื่อข้ามไปหน้าที่ต้องการ
    const products = await Product.find({ ...keyword })
        .sort({ _id: 1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1))

    // ส่งข้อมูลกลับไปแบบแพ็กเกจใหญ่ (มีทั้งสินค้า, เลขหน้าปัจจุบัน, และจำนวนหน้าทั้งหมด)
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public (ใครก็ดูได้)
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('ไม่พบสินค้าที่ต้องการ')
    }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    // ค้นหาสินค้าทั้งหมด เรียงตามเรตติ้ง (มากไปน้อย) และหยิบมาแค่ 3 อันดับแรก
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)
    res.json(products)
})

// @desc    Create new review (สร้างรีวิวสินค้า)
// @route   POST /api/products/:id/reviews
// @access  Private (ต้อง Login ถึงจะรีวิวได้)
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        // 1. เช็คว่า User คนนี้เคยรีวิวสินค้านี้ไปแล้วหรือยัง
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString(),
        )

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('คุณได้รีวิวสินค้านี้ไปแล้ว')
        }

        // 2. สร้างออบเจ็กต์รีวิวใหม่
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        // 3. เพิ่มรีวิวใหม่เข้าไปใน Array
        product.reviews.push(review)

        // 4. อัปเดตจำนวนคนรีวิว
        product.numReviews = product.reviews.length

        // 5. คำนวณคะแนนเฉลี่ยใหม่ (เอาคะแนนทั้งหมดบวกกัน หารด้วยจำนวนคน)
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length

        await product.save()
        res.status(201).json({ message: 'เพิ่มรีวิวสำเร็จแล้ว' })
    } else {
        res.status(404)
        throw new Error('ไม่พบสินค้าที่ต้องการรีวิว')
    }
})

// ==========================================
// 🔴 โซนของ ADMIN
// ==========================================

// @desc    Create a product (สร้างสินค้าจำลอง)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id, // แอดมินคนที่สร้าง
        image: '/images/sample.jpg',
        brand: 'Juicy Healthy',
        category: 'Drinks',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc    Update a product (แก้ไขข้อมูลสินค้า)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } =
        req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('ไม่พบสินค้าที่ต้องการแก้ไข')
    }
})

// @desc    Delete a product (ลบสินค้า)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await Product.deleteOne({ _id: product._id })
        res.status(200).json({ message: 'ลบสินค้าสำเร็จ' })
    } else {
        res.status(404)
        throw new Error('ไม่พบสินค้าที่ต้องการลบ')
    }
})

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getTopProducts,
    createProductReview,
}
