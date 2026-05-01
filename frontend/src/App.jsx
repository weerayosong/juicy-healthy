import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
    return (
        <>
            <Header />
            {/* ดัน Footer ลงไปข้างล่าง main อาจแก้เป็น h-dvh ทีหลัง */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-200px)]">
                {/* Outlet คือจุดที่จะเอา page Component หน้าต่าง ๆ มาเสียบ */}
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default App
