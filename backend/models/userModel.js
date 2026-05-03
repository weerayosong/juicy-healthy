import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // อีเมลห้ามซ้ำกัน
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false, // ค่าเริ่มต้น >> ลูกค้าธรรมดา ไม่ใช่แอดมิน
        },
    },
    {
        timestamps: true, // Mongoose สร้าง createdAt และ updatedAt ให้อัตโนมัติ
    },
)

// ฟังก์ชันเช็ครหัสผ่านตอนล็อกอิน (เอาไว้เทียบรหัสที่พิมพ์มา กับรหัสที่สับแหลกแล้วใน DB)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// ดักจับก่อนเซฟ (Pre-save hook): สับรหัสผ่านให้แหลกก่อนเอาลง Database
userSchema.pre('save', async function () {
    // ถ้าไม่ได้มีการแก้ไขรหัสผ่าน (เช่น แค่เปลี่ยนชื่อ) ก็ให้ข้ามขั้นตอนนี้ไปเลย
    if (!this.isModified('password')) {
        return
    }

    // สร้างค่าเกลือ (Salt) ความเข้มข้นระดับ 10 แล้วเอามารวมกับรหัสผ่านเพื่อเข้ารหัส
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User

// matchPassword: พอเราไปทำหน้า Login เราจะเรียกใช้ฟังก์ชันนี้เพื่อถามว่า "รหัสผ่านที่ลูกค้ากรอกมาเนี่ย ตรงกับในระบบไหม?"
// pre('save'): เป็นระบบอัตโนมัติ ทุกครั้งที่สั่งสร้างบัญชีผู้ใช้ใหม่ มันจะทำการสับรหัสผ่านเข้ารหัสให้ทันที โดยที่ไม่ต้องมานั่งเขียนคำสั่งเข้ารหัสซ้ำๆ ใน Controller เลย
