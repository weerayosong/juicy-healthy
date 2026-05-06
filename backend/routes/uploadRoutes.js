import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

// 1. ตั้งค่าโกดังเก็บของ (Storage)
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/') // เก็บไฟล์ไว้ในโฟลเดอร์ uploads/
    },
    filename(req, file, cb) {
        // ตั้งชื่อไฟล์ใหม่: ชื่อฟิลด์ - วันที่เวลา .นามสกุลไฟล์ (ป้องกันชื่อไฟล์ซ้ำกัน)
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
        )
    },
})

// 2. ด่านตรวจชนิดไฟล์ (กรองเอาเฉพาะรูปภาพ)
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/ // เอาแค่ 3 นามสกุลนี้ก่อน เดี๋ยวจิปวดกระบาลมากนะ
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
    )
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('อัปโหลดได้เฉพาะไฟล์รูปภาพ (jpg, jpeg, png) เท่านั้นครับ!')
    }
}

// 3. รวมร่าง Middleware
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
})

// 4. สร้าง Route รับไฟล์ (ใช้ POST)
router.post('/', upload.single('image'), (req, res) => {
    // ส่ง path ของรูปภาพกลับไปให้ Frontend เอาไปเซฟลง Database
    res.send({
        message: 'อัปโหลดรูปภาพสำเร็จ',
        image: `/${req.file.path.replace(/\\/g, '/')}`, // .replace() ช่วยแก้ปัญหา slash กลับด้านใน Windows
    })
})

export default router
