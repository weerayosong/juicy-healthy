import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './store.js'

import './index.css'
import App from './App.jsx'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import OrderListScreen from './screens/admin/OrderListScreen'

import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'

// สร้าง Router จำลองโครงสร้างไว้ก่อน เดี๋ยวเพิม route ตาม page-level components
// ฝึกใช้แบบ data mode ไปเลย ถึงแม้ routes/route จะง่ายกว่าก็เถอะ
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            {/* 🟢 โซนทั่วไป: ใครก็เข้าได้ */}
            <Route index={true} path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />

            {/* 🟡 โซนสมาชิก: ต้องผ่านด่าน PrivateRoute ก่อน */}
            <Route path="" element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/shipping" element={<ShippingScreen />} />
                <Route path="/payment" element={<PaymentScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/order/:id" element={<OrderScreen />} />
            </Route>

            {/* 🔴 โซนผู้ดูแลระบบ: ต้องผ่านด่าน AdminRoute ก่อน */}
            <Route path="" element={<AdminRoute />}>
                <Route path="/admin/orderlist" element={<OrderListScreen />} />
            </Route>
        </Route>,
    ),
)
// console.log({ router })
// console.log(typeof { router })

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            {/* หุ้ม RouterProvider ด้วย PayPalScriptProvider */}
            {/* deferLoading={true} หมายถึงยังไม่ต้องโหลดจนกว่าเราจะสั่ง เพื่อประหยัดทรัพยากรครับ */}
            <PayPalScriptProvider deferLoading={true}>
                <RouterProvider router={router} />
            </PayPalScriptProvider>
        </Provider>
    </StrictMode>,
)

// Gen F
// Dynamic Rendering
// <Outlet />
// พิมพ์ localhost:5173/cart -> React Router จะเอาหน้า <CartScreen/> ไปยัดใส่ตรง <Outlet/> แทนที่อันเดิมทันที
// ภาพเราท์แบบง่าย และนี่คือสิ่งที่ <Outlet /> นำไปใส่
// const router = createBrowserRouter(
//     createRoutesFromElements(
//         // 🏠 Route แม่ (Parent Route)
//         <Route path="/" element={<App />}>
//             // 👶 Route ลูก (Child Routes)
//             <Route index={true} path="/" element={<HomeScreen />} />
//             <Route path="/product/:id" element={<ProductScreen />} />
//             <Route path="/cart" element={<CartScreen />} />
//         </Route>,
//     ),
// )
{
    /* <Outlet/> = "ช่องใส่รูปในกรอบรูป" (Placeholder)  ส่วน URL = "ผืนรูปภาพวาด ที่จะเอามาใส่" ที่จะบอกว่าให้ Component(Page-level) ตัวไหน ผืนภาพรูปตัวไหนที่จะเอามาใส่ ใน ช่องใส่รูปในกรอบรูป (กรอบรูป คือ <App />) */
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

// Children อธิบายยาก แต่มันแทบไม่มีอะไรเลย เหมือนพร๊อพ แต่ส่งสิ่งทีถูกห่อหุ้ม

// App.jsx
// import NormalChildComponent from './components/NormalChildComponent'
// import Card from './components/Card'
// function App() {
//     return (
//         <>
//             <NormalChildComponent banana="This is Props" />
//             <Card title="This is Props(h2)">
//                 <p>This is Children(p)</p>
//             <Card />
//         </>
//     )
// }

// // Card.jsx
// function Card({ title, children }) {
//     return (
//         <>
//         {/* ใช้พรอพที่ชื่อ title */}
//             <h2>{title}</h2>
//         {/* ใช้ children ของ Card */}
//             <p>{children}</p>
//         </>
//     )
// }

// children เป็น props ชนิดพิเศษที่ติดมากับ React
// ให้มองว่า Component ของเราคือ "ขนมปังแฮมเบอร์เกอร์ (บน-ล่าง)" ส่วน children คือ "ไส้ตรงกลาง" ที่คนเรียกใช้จะยัดอะไรลงไปก็ได้
// การเรียกใช้
{
    /* <Message> 
    ตะกร้าของคุณยังว่างเปล่า <Link to="/">กลับไปซื้อของ</Link> 
</Message> */
}
// ทำไมต้องใช้?
// เพราะมันทำให้ Component ของเรายืดหยุ่นโคตรๆ สมมติ สร้างกล่องการ์ด <Card> ขึ้นมาใบหนึ่ง โดยออกแบบแค่กรอบสีขาวกับเงาสวยๆ (className="bg-white shadow-md...") ส่วนตรงกลางจะเขียนโค้ด รับ {children} เอาไว้ พอเอาไปใช้งานจริง เราจะเอา <Card> ไปครอบรูปภาพ, ครอบตัวหนังสือ หรือครอบฟอร์มล็อกอินก็ได้หมดเลย ไม่ต้องไปเขียน Component ใหม่หลายๆ ตัว

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

// useParams
// เป็น Hook ที่เอาไว้ "ดูดข้อมูลจาก URL" (ช่องพิมพ์ที่อยู่เว็บด้านบน) >> ใช้ตอนที่เราทำหน้าเว็บแบบ Dynamic (ใช้โครงร่างหน้าเดิม แต่เปลี่ยนข้อมูลข้างในตามลิงก์)
// ตัวอย่าง: หน้า ProductScreen มีโครงสร้างเดียวกันหมด (มีรูปซ้าย ขวาเป็นราคา) แต่เราจะรู้ได้ไงว่าต้องดึงข้อมูล "น้ำส้ม" หรือ "น้ำทับทิม" มาโชว์?
// คำตอบคือเราดูจาก URL เช่น localhost:5173/product/64abc...
// อธิบายโค้ด:
// const { id: productId } = useParams()
// คำสั่งนี้แปลว่า "ไปล้วงเอาค่าตัวแปรที่ชื่อ id จาก URL มานะ แล้วขอเปลี่ยนชื่อเรียกมันใหม่เป็น productId เพื่อให้โค้ดอ่านง่ายขึ้น" เราก็จะได้รหัส 64abc... เอาไปยิงหา Database ต่อได้เลย

// useParams ต่างจาก props ยังไง?
// ทั้งสองตัวทำหน้าที่ "เอาข้อมูลเข้ามาใน Component" เหมือนกันเป๊ะครับ แต่ต่างกันที่ "แหล่งที่มาของข้อมูล"

// props (รับของจากแม่): ข้อมูลจะถูกส่งต่อกันมาเป็นทอดๆ จาก Component ตัวแม่ ยื่นให้ตัวลูก เหมือนแม่ส่งรายการซื้อของให้ลูกไปตลาด
// ตัวอย่าง: <ProductCard title="น้ำส้ม" price="{50}"/> (ตัวลูกจะได้รับ title กับ price ผ่าน props)
// useParams (ล้วงกระเป๋าหยิบเองจาก URL): ไม่ต้องรอให้ใครส่งมาให้ Component สามารถเอื้อมมือไปหยิบค่าจาก URL มาใช้ได้เองเลยครับ มักจะใช้กับหน้าจอหลักๆ (Screen) ที่ถูกเรียกผ่าน Router โดยตรง เพราะมันไม่มี "ตัวแม่" มาคอยส่ง props ให้นั่นเอง

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
