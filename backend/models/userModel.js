import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // อีเมลห้ามซ้ำ
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false, // เริ่มต้น Userธรรมดา
        },
    },
    {
        timestamps: true, // Mongoose สร้างฟิลด์ createdAt และupdatedAt ให้อัตโนมัติ
    },
)

const User = mongoose.model('User', userSchema)

export default User
