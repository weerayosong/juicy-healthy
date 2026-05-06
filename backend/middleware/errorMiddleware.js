// 1. ดักจับกรณีหา Route ไม่เจอ (เช่น พิมพ์ /api/yosongthejedimaster)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error) // โยน error ไปให้ตัวข้างล่างจัดการต่อ
}

// 2. ตัวจัดการ Error หลัก (แปลง Error ยึกยือของ Express ให้เป็น JSON)
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message

    // ถ้าเป็น Error ของ Mongoose (เช่น ส่ง ID ปลอมมาหาข้อมูล)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found'
        statusCode = 404
    }

    res.status(statusCode).json({
        message,
        // โชว์ stack trace เฉพาะตอนที่เรากำลัง dev อยู่เท่านั้น
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    })
}

export { notFound, errorHandler }
