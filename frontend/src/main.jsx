import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// สร้าง Router จำลองโครงสร้างไว้ก่อน เดี๋ยวเพิม route ตาม page-level components
// ฝึกใช้แบบ data mode ไปเลย ถึงแม้ routes/route จะง่ายกว่าก็เถอะ
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            {/* test Home */}
            <Route
                index={true}
                path="/"
                element={
                    <div className="text-center text-2xl mt-10">
                        Okay, Frontend, Backend setup, Done <br />
                        It's time to first deploy for test UI
                    </div>
                }
            />
        </Route>,
    ),
)
console.log({ router })
console.log(typeof { router })

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
