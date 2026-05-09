import { Helmet } from 'react-helmet-async'

const Meta = ({
    title = 'Juicy Healthy | น้ำผลไม้สกัดเย็นเพื่อสุขภาพ 100%',
    description = 'จำหน่ายน้ำผลไม้สกัดเย็น สดใหม่ทุกวัน ออร์แกนิก ไร้สารเจือปน ดื่มง่ายได้สุขภาพ',
    keywords = 'น้ำผลไม้, สกัดเย็น, สุขภาพ, ออร์แกนิก, ดีท็อกซ์, juicy healthy',
}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </Helmet>
    )
}

export default Meta
