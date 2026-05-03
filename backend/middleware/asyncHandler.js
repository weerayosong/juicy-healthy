const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler
// my middleware #1 เพื่อมาช่วยครอบโค้ดให้ทำงานแบบไม่ต้องเขียน try...catch ซ้ำซากทุกอัน
// เวลาเราคุยกับ Database (เช่น Mongoose) มันจะเป็นการทำงานแบบ Asynchronous (รอกระบวนการ)
// ถ้ามีอะไรพัง (เช่น เน็ตหลุด) ปกติเราต้องคอยเขียน try { ... } catch (error) { ... } ดักไว้ทุกๆ ฟังก์ชัน
// การใช้ asyncHandler จะมาครอบฟังก์ชันของเราไว้ ถ้ามี Error ปุ๊บ มันจะโยนไปให้ระบบจัดการ Error กลางของ Express ทันที
