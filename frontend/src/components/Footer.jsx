import { FaCarrot } from 'react-icons/fa6'

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-400 py-6 mt-16 shadow-inner">
            <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
                <div className="flex justify-center items-center text-white mb-4">
                    <FaCarrot className="text-6xl px-1 fill-[url(#juice-gradient)]" />
                    <span className="text-2xl font-bold tracking-widest  uppercase px-1">
                        Juicy Healthy
                    </span>
                </div>

                <p className="text-sm mb-2">
                    Copyright &copy; 2026. All rights reserved.
                </p>
                <p className="text-xs text-slate-500">
                    Full Stack MERN E-Commerce Website
                </p>
            </div>
        </footer>
    )
}

export default Footer
