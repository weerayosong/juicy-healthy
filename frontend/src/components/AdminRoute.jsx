import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth)

    // ต้องมี userInfo และ userInfo.isAdmin ต้องเป็น true ถึงจะให้ผ่านไปที่ <Outlet />
    return userInfo && userInfo.isAdmin ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace />
    )
}

export default AdminRoute
