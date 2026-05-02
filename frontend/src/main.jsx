import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import ProductScreen from './screens/ProductScreen.jsx'

// สร้าง Router จำลองโครงสร้างไว้ก่อน เดี๋ยวเพิม route ตาม page-level components
// ฝึกใช้แบบ data mode ไปเลย ถึงแม้ routes/route จะง่ายกว่าก็เถอะ
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            {/* หน้าแรก (Index) ให้แสดง HomeScreen */}
            <Route index={true} path="/" element={<HomeScreen />} />
            {/* หน้าสินค้า ให้แสดง ProductScreen และรับพารามิเตอร์ชื่อ id */}
            <Route path="/product/:id" element={<ProductScreen />} />
        </Route>,
    ),
)
// console.log({ router })
// console.log(typeof { router })

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
