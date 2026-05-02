// Mock Data ไว้รอ seedเข้าDB 48 รายการ จาก 6 เบส
const baseDrinks = [
    {
        name: 'น้ำผักใบเขียวสกัดเย็น (Green Detox)',
        category: 'Detox',
        price: 120,
        bgColor: 'dcffd4',
        baseText: 'Green+Detox',
    },
    {
        name: 'เบอร์รี่รวมต้านอนุมูลอิสระ (Berry Blend)',
        category: 'Antioxidant',
        price: 150,
        bgColor: 'f2d4ff',
        baseText: 'Berry+Blend',
    },
    {
        name: 'น้ำส้มคั้นสดบริสุทธิ์ (C-Boost)',
        category: 'Vitamin C',
        price: 90,
        bgColor: 'ffe5d4',
        baseText: 'C-Boost',
    },
    {
        name: 'สมูทตี้มะม่วงโปรตีนสูง (Mango Protein)',
        category: 'Protein',
        price: 180,
        bgColor: 'fffcd4',
        baseText: 'Mango+Protein',
    },
    {
        name: 'น้ำทับทิมสกัดเย็นพรีเมียม (Ruby Red)',
        category: 'Antioxidant',
        price: 200,
        bgColor: 'ffd4d4',
        baseText: 'Ruby+Red',
    },
    {
        name: 'น้ำมะพร้าวออร์แกนิกผสมอัลมอนด์ (Coco Nutty)',
        category: 'Refresh',
        price: 110,
        bgColor: 'd4e9ff',
        baseText: 'Coco+Nutty',
    },
]

const products = []

// วนลูปสร้าง 48 จาก 6 เบส
for (let i = 1; i <= 48; i++) {
    const base = baseDrinks[(i - 1) % baseDrinks.length]

    // random, fast easy and so powerful 😈
    const randomStock = Math.floor(Math.random() * 30) // stock 0-29
    const randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1) // เรทดาว 3.5 - 5.0
    const randomReviews = Math.floor(Math.random() * 120) // รีวิวสุ่ม 0-119

    // สร้าง URL รูปภาพแบบไดนามิก: ใช้ %0A เพื่อขึ้นบรรทัดใหม่ และใส่ Formula+No.i
    const dynamicImage = `https://placehold.co/600x600/${base.bgColor}/0d9488?text=${base.baseText}%0AFormula+No.${i}`

    products.push({
        name: `${base.name} - สูตร No.${i}`,
        image: dynamicImage,
        description: `เครื่องดื่มสุขภาพ ${base.category} คุณภาพพรีเมียม สกัดสดใหม่ทุกวัน ปราศจากน้ำตาลทรายและวัตถุกันเสีย (รหัสสูตรเฉพาะ No.${i}) ช่วยบำรุงร่างกายและให้ความสดชื่น เหมาะสำหรับทุกเพศทุกวัย`,
        brand: 'Juicy Healthy',
        category: base.category,
        price: base.price,
        countInStock: randomStock,
        rating: Number(randomRating),
        numReviews: randomReviews,
    })
}

export default products
