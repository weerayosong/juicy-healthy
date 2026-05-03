import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa6' // 👈 นำเข้าลูกศรจาก react-icons

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    const getStyle = (isCurrent, isCompleted) => {
        if (isCurrent) {
            return 'text-slate-900 border-b-2 border-secondary pb-1 transition-all duration-300'
        } else if (isCompleted) {
            return 'text-secondary hover:text-secondary/80 transition-colors'
        } else {
            return 'text-slate-400'
        }
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-2 mb-10 text-sm font-medium text-slate-400">
            {/* Step 1: Login */}
            <div>
                {step1 ? (
                    <Link
                        to="/login"
                        className={getStyle(step1 && !step2, step1 && step2)}
                    >
                        เข้าสู่ระบบ
                    </Link>
                ) : (
                    <span className={getStyle(false, false)}>เข้าสู่ระบบ</span>
                )}
            </div>

            {/* 🚨 เปลี่ยนมาใช้คอมโพเนนต์ลูกศรแทน i tag */}
            <FaChevronRight className="text-[10px]" />

            {/* Step 2: Shipping */}
            <div>
                {step2 ? (
                    <Link
                        to="/shipping"
                        className={getStyle(step2 && !step3, step2 && step3)}
                    >
                        จัดส่ง
                    </Link>
                ) : (
                    <span className={getStyle(false, false)}>จัดส่ง</span>
                )}
            </div>

            <FaChevronRight className="text-[10px]" />

            {/* Step 3: Payment */}
            <div>
                {step3 ? (
                    <Link
                        to="/payment"
                        className={getStyle(step3 && !step4, step3 && step4)}
                    >
                        ชำระเงิน
                    </Link>
                ) : (
                    <span className={getStyle(false, false)}>ชำระเงิน</span>
                )}
            </div>

            <FaChevronRight className="text-[10px]" />

            {/* Step 4: Place Order */}
            <div>
                {step4 ? (
                    <Link to="/placeorder" className={getStyle(step4, false)}>
                        ยืนยันสั่งซื้อ
                    </Link>
                ) : (
                    <span className={getStyle(false, false)}>
                        ยืนยันสั่งซื้อ
                    </span>
                )}
            </div>
        </div>
    )
}

export default CheckoutSteps
