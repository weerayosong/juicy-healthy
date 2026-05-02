const baseDrinks = [
    {
        name: 'น้ำผักใบเขียวสกัดเย็น (Green Detox)',
        category: 'Detox',
        price: 120,
        image: 'https://placehold.co/400x500/f8fafc/0f172a?text=Green+Detox',
    },
    {
        name: 'เบอร์รี่รวมต้านอนุมูลอิสระ (Berry Blend)',
        category: 'Antioxidant',
        price: 150,
        image: 'https://placehold.co/400x500/f8fafc/0f172a?text=Berry+Blend',
    },
    {
        name: 'น้ำส้มคั้นสดบริสุทธิ์ (C-Boost)',
        category: 'Vitamin C',
        price: 90,
        image: 'https://placehold.co/400x500/f8fafc/0f172a?text=C-Boost',
    },
    {
        name: 'สมูทตี้มะม่วงโปรตีนสูง (Mango Protein)',
        category: 'Protein',
        price: 180,
        image: 'https://placehold.co/400x500/f8fafc/0f172a?text=Mango+Protein',
    },
]

const productsLocal = []
for (let i = 1; i <= 8; i++) {
    const base = baseDrinks[(i - 1) % baseDrinks.length]
    productsLocal.push({
        _id: i.toString(), // จำลอง ID ของ MongoDB
        name: `${base.name} - No.${i} (Local)`,
        image: base.image,
        description: `เครื่องดื่มสุขภาพ ${base.category} คุณภาพพรีเมียม สูตร No.${i}`,
        brand: 'Juicy Healthy',
        category: base.category,
        price: base.price,
        countInStock: Math.floor(Math.random() * 30),
        rating: Number((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)),
        numReviews: Math.floor(Math.random() * 120),
    })
}

export default productsLocal
