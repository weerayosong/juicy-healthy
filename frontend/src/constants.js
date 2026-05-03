// มองว่าเป็น สมุดหน้าเหลือง ก่อนละกัน ใครรู้จักนี่ไม่เด็กนะครับ 555

// ใช้ Proxy ใน vite.config.js อยู่แล้ว BASE_URL ปล่อยว่างไว้แบบนี้ได้เลย
export const BASE_URL = ''
export const PRODUCTS_URL = '/api/products'
export const USERS_URL = '/api/users'
export const ORDERS_URL = '/api/orders'
export const PAYPAL_URL = '/api/config/paypal'

// RTK Query (Redux Toolkit Query) เป็นเครื่องมือเสริมที่มาพร้อมกับ Redux Toolkit ครับ หน้าที่ของมันคือ "จัดการเรื่องการยิง API และแคช (Cache) ข้อมูล"
// RTK Query เข้ามา "รวบตึง" ทุกอย่างนี้ให้เหลือแค่บรรทัดเดียวครับ! แถมยังฉลาดพอที่จะจำข้อมูลไว้ (Cache) ถ้าเปลี่ยนหน้าแล้วกลับมาหน้าเดิม มันจะไม่ยิง API ซ้ำให้เปลืองเน็ต

// ส่วนไหนในโค้ดคือ RTK Query?
// ไฟล์ที่ลงท้ายด้วย ApiSlice ทั้งหมดเลย(ตอนนี้มี 3 เส้นอยู่) ได้แก่:

// apiSlice.js (ยานแม่ >> สำหรับตั้งค่าเริ่มต้น)
// productsApiSlice.js (สายดึงข้อมูลสินค้า >> จัดการ API สินค้า)
// usersApiSlice.js (สายล็อกอิน >> จัดการ API ผู้ใช้ (ตอนนี้มีแค่ Login))

// ส่วนไฟล์ที่ลงท้ายด้วย Slice เฉยๆ เช่น cartSlice.js(จำของในตะกร้า) หรือ authSlice.js(จำข้อมูลลูกค้าที่ล็อกอินแล้ว) จะเป็น Redux แบบปกติ เอาไว้เก็บข้อมูลในเครื่อง (เหมือนเปิดลิ้นชักความจำ) ไม่ได้ยิง API
