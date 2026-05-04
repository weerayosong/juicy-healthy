import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = () => {
    const { userInfo } = useSelector((state) => state.auth)

    // ถ้ามี userInfo ให้แสดง Component ลูกที่อยู่ข้างใน (<Outlet />)
    // ถ้าไม่มี ให้บังคับเด้ง (Navigate) ไปที่หน้า /login
    return userInfo ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
