import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import productsLocal from './productsLocal'

const App = () => {
    return (
        // ทำ container div ให้ทุกคอมโพเนนท์อยู่ใน responsive ด้วย
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
console.log(productsLocal)

export default App
