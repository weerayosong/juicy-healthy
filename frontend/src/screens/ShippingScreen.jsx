import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'
import thaiData from '../data/thai_provinces.json'

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    // ฟังก์ชันช่วยดึงชื่อ จังหวัด/อำเภอ/ตำบล ออกจาก String ที่เราเคยบันทึกไว้ (เช่น "ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ")
    const getInitialValue = (key) => {
        if (!shippingAddress?.city) return ''
        const parts = shippingAddress.city.split(' ')
        if (key === 'province') return parts[2]?.replace('จ.', '') || ''
        if (key === 'district') return parts[1]?.replace('อ.', '') || ''
        if (key === 'subDistrict') return parts[0]?.replace('ต.', '') || ''
        return ''
    }

    // 💡 ตั้งค่า State เริ่มต้นโดยดึงข้อมูลจาก Redux/LocalStorage[cite: 1]
    const [addressInfo, setAddressInfo] = useState(
        shippingAddress?.address || '',
    )
    const [province, setProvince] = useState(getInitialValue('province'))
    const [district, setDistrict] = useState(getInitialValue('district'))
    const [subDistrict, setSubDistrict] = useState(
        getInitialValue('subDistrict'),
    )
    const [postalCode, setPostalCode] = useState(
        shippingAddress?.postalCode || '',
    )

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // 💡 ดึงรายชื่อจังหวัด[cite: 1]
    const provincesList = useMemo(() => thaiData, [])

    // 💡 ดึงรายชื่ออำเภอตามจังหวัดที่เลือก[cite: 1]
    const districtsList = useMemo(() => {
        if (!province) return []
        const foundProv = thaiData.find((p) => p.name_th === province)
        return foundProv ? foundProv.districts : []
    }, [province])

    // 💡 ดึงรายชื่อตำบลตามอำเภอที่เลือก[cite: 1]
    const subDistrictsList = useMemo(() => {
        if (!district) return []
        const foundProv = thaiData.find((p) => p.name_th === province)
        if (!foundProv) return []
        const foundDist = foundProv.districts.find(
            (d) => d.name_th === district,
        )
        return foundDist ? foundDist.sub_districts : []
    }, [province, district])

    const handleProvinceChange = (e) => {
        setProvince(e.target.value)
        setDistrict('')
        setSubDistrict('')
        setPostalCode('')
    }

    const handleDistrictChange = (e) => {
        setDistrict(e.target.value)
        setSubDistrict('')
        setPostalCode('')
    }

    const handleSubDistrictChange = (e) => {
        const selectedSub = e.target.value
        setSubDistrict(selectedSub)
        const foundSub = subDistrictsList.find((s) => s.name_th === selectedSub)
        if (foundSub) {
            setPostalCode(foundSub.zip_code)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const fullCity = `ต.${subDistrict} อ.${district} จ.${province}`
        dispatch(
            saveShippingAddress({
                address: addressInfo,
                city: fullCity,
                postalCode,
                country: 'ประเทศไทย',
            }),
        )
        navigate('/payment')
    }

    return (
        <div className="flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                <CheckoutSteps step1 step2 />

                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center uppercase tracking-wide">
                    ข้อมูลการจัดส่ง
                </h2>

                <form onSubmit={submitHandler} className="space-y-4">
                    {/* 1. ช่องที่อยู่ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ที่อยู่ (บ้านเลขที่, หมู่, ซอย, ถนน)
                        </label>
                        <textarea
                            rows="2"
                            value={addressInfo}
                            onChange={(e) => setAddressInfo(e.target.value)}
                            placeholder="กรอกที่อยู่ของคุณ"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition resize-none"
                            required
                        ></textarea>
                    </div>

                    {/* 2. จังหวัด */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            จังหวัด
                        </label>
                        <select
                            value={province}
                            onChange={handleProvinceChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white"
                            required
                        >
                            <option value="" disabled>
                                -- เลือกจังหวัด --
                            </option>
                            {provincesList.map((p) => (
                                <option key={p.id} value={p.name_th}>
                                    {p.name_th}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 3. อำเภอ และ ตำบล */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                อำเภอ / เขต
                            </label>
                            <select
                                value={district}
                                onChange={handleDistrictChange}
                                disabled={!province}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                required
                            >
                                <option value="" disabled>
                                    -- เลือกอำเภอ --
                                </option>
                                {districtsList.map((d) => (
                                    <option key={d.id} value={d.name_th}>
                                        {d.name_th}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ตำบล / แขวง
                            </label>
                            <select
                                value={subDistrict}
                                onChange={handleSubDistrictChange}
                                disabled={!district}
                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                required
                            >
                                <option value="" disabled>
                                    -- เลือกตำบล --
                                </option>
                                {subDistrictsList.map((s) => (
                                    <option key={s.id} value={s.name_th}>
                                        {s.name_th}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 4. รหัสไปรษณีย์ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            รหัสไปรษณีย์
                        </label>
                        <input
                            type="text"
                            value={postalCode}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-medium py-2.5 rounded-sm hover:bg-secondary transition mt-6 uppercase tracking-wider"
                    >
                        ดำเนินการต่อ
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ShippingScreen
