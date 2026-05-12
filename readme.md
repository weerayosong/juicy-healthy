# Juicy Healthy | Full Stack MERN E-Commerce Website Project

### โปรเจคต์นี้จัดทำขึ้นเพื่อ เป็นการฝึกฝนการใช้เครื่องมือ เรียนรู้ให้เห็นภาพรวม และได้รู้จักการทำงานตั้งแต่ต้นจนจบของโปรเจคต์ E-Commerce

ตัวผมซึ่งเป็นผู้จัดทำ ขณะนี้ยังคงต้องไปศึกษาเพิ่มเติม ให้มีความเข้าใจอย่างถ่องแท้ ให้มีความสามารถเพียงพอในการ วางแผนและออกแบบระบบให้ได้ด้วยตนเองต่อไป รวมถึงสามารถดูแลรักษา และสามารถรองรับการขยายตัวของแอปพลิเคชั่นให้ได้ นั่นคือเป้าหมายหลักต่อไป

**Group 5 | Debug Impact Five**

" This is a Fighter Scout and Escort Mission (Side Project). I've been executing solo behind enemy lines (Operating in stealth on my `feat-dev` branch). The mothership and the rest of our squadron are scheduled to jump out of hyperspace and into the war zone next week (Sprint #2). But never underestimate the Dark Side—a lone TIE Fighter can obliterate the entire Rebel fleet, provided the pilot is Lord Vader's apprentice. 😈 "

**May the force be with you** 😈

- https://www.yosong.dev

---

## What did i learned via made this project?

### **Part 1: Backend Infrastructure & Database**

ขอแบ่งโครงสร้างการทำงานออกเป็นชั้นๆ (Layers) เพื่อให้เห็นภาพการไหลของข้อมูลได้ชัดเจน ดังนี้

#### **1. Server Initialization & Configuration (จุดศูนย์กลางของระบบ)**

สถาปัตยกรรมของระบบ Backend ถูกออกแบบตามมาตรฐาน RESTful API Architecture โดยใช้ Node.js เป็น Runtime Environment และ Express.js เป็น Web Framework หลัก โครงสร้างโค้ดใช้หลักการ Separation of Concerns (SoC) โดยแยกการทำงานออกเป็น Routes, Controllers, และ Models อย่างชัดเจน เพื่อให้ง่ายต่อการบำรุงรักษา (Maintainability) และการขยายระบบในอนาคต (Scalability) ข้อมูลทั้งหมดถูกจัดเก็บและประมวลผลผ่านฐานข้อมูลแบบ NoSQL อย่าง MongoDB เพื่อรองรับโครงสร้างข้อมูลที่มีความยืดหยุ่นสูง

ไฟล์ `server.js` ทำหน้าที่เป็น Entry Point หลักของโปรเจกต์ Juicy Healthy โดยมีการจัดลำดับความสำคัญ (Execution Order) อย่างเคร่งครัด:

- **Environment Setup (`dotenv`):** ตัวแปรสภาพแวดล้อมทั้งหมดถูกโหลดเข้าสู่ `process.env` เป็นลำดับแรกสุด เพื่อให้มั่นใจว่าการเชื่อมต่อ Database หรือการตั้งค่าพอร์ต จะได้รับค่าที่ถูกต้องจากฝั่ง Server (Render)
- **Dynamic Port Binding:** ระบบรองรับการทำงานทั้งในโหมด Development และ Production โดยรันบนพอร์ตที่ถูก Assign จาก Render แบบไดนามิก (`process.env.PORT`) หรือตกไปใช้พอร์ต `5000` เป็น Fallback
- **Static Assets Serving:** มีการใช้ `express.static` ร่วมกับโมดูล `path` เพื่อแปลงโฟลเดอร์ `/uploads` ให้กลายเป็น Public Directory ทำให้หน้าบ้านสามารถเข้าถึงรูปภาพสินค้าได้โดยตรงผ่าน URL

#### **2. Database Management & Integrity (การจัดการฐานข้อมูล)**

ระบบใช้ **MongoDB Atlas** เป็น Cloud Database และบริหารจัดการผ่าน **Mongoose (ODM)** \* **Connection Lifecycle:** ฟังก์ชัน `connectDB()` ถูกออกแบบให้ทำงานแบบ Asynchronous (`async/await`) เพื่อให้แน่ใจว่าเซิร์ฟเวอร์จะเชื่อมต่อกับฐานข้อมูลสำเร็จก่อนที่จะเริ่มรับ Request

- **The Database Name Target:** หัวใจสำคัญของการเชื่อมต่อที่ถูกต้องคือการระบุชื่อฐานข้อมูล (เช่น `/juicy-healthy`) ไว้ใน `MONGO_URI` อย่างเจาะจง หากละเว้นจุดนี้ MongoDB Driver จะทำการ Routing ข้อมูลไปที่ Default Cluster (ฐานข้อมูล `test`) โดยอัตโนมัติ ซึ่งนำไปสู่ปัญหา Data Not Found ในฝั่ง Production
- **Schema Validation:** Mongoose ถูกใช้เพื่อสร้าง Data Model (เช่น User, Product, Order) เพื่อบังคับใช้โครงสร้างข้อมูล (Data Types) และความสัมพันธ์ (Relationships) ภายในสภาพแวดล้อมแบบ NoSQL

#### **3. Cross-Origin Resource Sharing (CORS) Security**

การตั้งค่าความปลอดภัยสำหรับการสื่อสารข้ามโดเมน (Cross-Domain Communication) ระหว่าง Frontend (Vercel) และ Backend (Render):

- **Strict Origin Control:** ปฏิเสธการเข้าถึงแบบ Wildcard (`*`) และระบุ URL ของหน้าบ้านอย่างเจาะจง เพื่อป้องกันไม่ให้เว็บไซต์อื่นมายิง API ของเรา
- **Credential Handling:** เปิดใช้งาน `credentials: true` ซึ่งเป็นเงื่อนไขบังคับ (Mandatory) จากเบราว์เซอร์ เพื่ออนุญาตให้มีการแนบ HttpOnly Cookies ข้ามโดเมนได้ (จำเป็นอย่างยิ่งสำหรับระบบ Authentication)

#### **4. Routing & Middleware Pipeline (ท่อส่งข้อมูลและด่านตรวจ)**

ระบบ API ถูกออกแบบตามหลักการ **RESTful Architecture** โดยแบ่งแยกความรับผิดชอบ (Separation of Concerns) อย่างชัดเจน:

- **Resource Routing:** กระจายการทำงานไปยัง Routes ย่อย (เช่น `productRoutes.js`, `userRoutes.js`) เพื่อไม่ให้ `server.js` บวมเกินไป (Fat Server)
- **The Gatekeeper (Auth Middleware):** \* ฟังก์ชัน `protect`: ทำหน้าที่สกัดกั้น Request โดยใช้ `cookie-parser` อ่านค่า JWT จากคุกกี้ หาก Token ถูกต้อง จะถอดรหัสและแนบข้อมูลผู้ใช้เข้าไปใน `req.user`
- ฟังก์ชัน `admin`: ทำหน้าที่ตรวจสอบระดับสิทธิ์ (Role-based access control) ต่อจาก `protect` เพื่ออนุญาตให้เฉพาะผู้ดูแลระบบทำการเพิ่ม/แก้ไข/ลบสินค้าได้

- **Centralized Error Handling:** ด่านสุดท้ายของ Pipeline ทำหน้าที่ดักจับข้อผิดพลาดทั้งหมด:
- `notFound`: ดักจับ Request ที่พิมพ์ URL ผิด และบังคับส่งสถานะ 404
- `errorHandler`: แปลง Error Stack Trace ให้กลายเป็น JSON Response ที่อ่านง่าย และจะซ่อนรายละเอียดเชิงลึก (Stack) ไว้เมื่อระบบอยู่ในโหมด Production (`NODE_ENV === 'production'`) เพื่อความปลอดภัย

#### **5. Core Packages & Tools**

- **`express`**: เฟรมเวิร์กหลักสำหรับสร้าง Web Server และจัดการ HTTP Request/Response
- **`mongoose`**: Object Data Modeling (ODM) library สำหรับทำ Schema Validation และเชื่อมโยงข้อมูลกับ MongoDB
- **`dotenv`**: จัดการข้อมูลความลับ (Secrets) โดยแยกออกจาก Source Code
- **`cors`**: Middleware สำหรับปลดล็อกและจัดการกฎความปลอดภัยเมื่อมีการเรียก API ข้ามโดเมน
- **`cookie-parser`**: เครื่องมือสำหรับสกัดข้อมูล Cookie ออกจาก HTTP Headers ให้อยู่ในรูปแบบ Object ที่เรียกใช้งานได้ทันที
- **`jsonwebtoken`**: ระบบสร้างและตรวจสอบ Token แบบ Stateless ทำให้เซิร์ฟเวอร์ไม่ต้องจำสถานะการล็อกอิน (Session) ของผู้ใช้ ช่วยให้ระบบขยายตัว (Scale) ได้ดีขึ้น

---

### **Part 2: The Security Bridge & Authentication**

ในส่วนนี้คือ "หัวใจสำคัญ" ของการทำให้ระบบที่อยู่คนละเซิร์ฟเวอร์ (Vercel และ Render) สามารถส่งข้อมูลยืนยันตัวตนหากันได้อย่างปลอดภัย ซึ่งเป็นด่านที่ท้าทายที่สุดของการทำสถาปัตยกรรมแบบ Microservices หรือ Decoupled Architecture

#### **1. Core Concepts**

ระบบยืนยันตัวตนของโปรเจกต์ Juicy Healthy ถูกออกแบบบนพื้นฐานของ **Stateless Authentication** ผ่าน **JSON Web Token (JWT)** โดยหลีกเลี่ยงการเก็บ Session ไว้ที่ฝั่งเซิร์ฟเวอร์ (Server-side Session) เพื่อลดภาระของหน่วยความจำและทำให้ระบบ Scale ได้ง่าย นอกจากนี้ยังมีการใช้เทคนิค **Cross-Domain Identity Management** เพื่อจัดการกับนโยบายความปลอดภัยของเบราว์เซอร์ (Browser Security Policies) อย่างเข้มงวด

#### **2. In-Depth Details (The Authentication Lifecycle)**

ระบบรักษาความปลอดภัยและการยืนยันตัวตนถูกแบ่งออกเป็น 5 เฟสการทำงาน (Phases) ดังนี้:

1. **Phase 1: The Cross-Origin Security Bridge (การสร้างสะพานเชื่อมโดเมน)**

- **Strict CORS Policy:** ในไฟล์ `server.js` มีการประกาศ `cors()` โดยหลีกเลี่ยงการใช้ Wildcard (`*`) แต่เจาะจง `origin: 'https://juicy-healthy.vercel.app'` อย่างชัดเจน
- **The Credentials Flag:** การเปิด `credentials: true` เป็นข้อบังคับระดับโปรโตคอล (Protocol Requirement) เพื่อแจ้งให้เบราว์เซอร์ทราบว่า "เซิร์ฟเวอร์นี้อนุญาตให้มีการแนบข้อมูลยืนยันตัวตน (Cookies/Authorization Headers) ข้ามโดเมนได้"

2. **Phase 2: Token Generation & Secure Cookie Injection (การสร้างและฝัง Token)**

- เมื่อผู้ใช้ล็อกอินสำเร็จ (`generateToken.js`) ระบบจะสร้าง JWT ด้วยอัลกอริทึม HMAC SHA256 (ผ่าน `JWT_SECRET`)
- **Cookie Attributes:** แทนที่จะส่ง Token กลับไปเป็น JSON ปกติ ระบบเลือกใช้วิธีฝังลงใน HTTP Response Header (`Set-Cookie`) ด้วยแอตทริบิวต์ความปลอดภัยสูงสุด:
- `httpOnly: true`: ป้องกันการโจมตีแบบ Cross-Site Scripting (XSS) โดยไม่อนุญาตให้ JavaScript ฝั่งหน้าบ้าน (เช่น `document.cookie`) เข้าถึงคุกกี้นี้ได้
- `secure: true`: บังคับให้คุกกี้นี้ส่งผ่านโปรโตคอลเข้ารหัส HTTPS เท่านั้น (สอดคล้องกับสภาพแวดล้อม Production ของ Render และ Vercel)
- `sameSite: 'none'`: **นี่คือหัวใจหลักที่แก้ปัญหาของโปรเจกต์นี้** เป็นการประกาศตัวแปรให้เบราว์เซอร์ยอมรับคุกกี้นี้แม้จะเป็นการร้องขอข้ามโดเมน (Cross-Site Request)

3. **Phase 3: Frontend Credential Inclusion (การแนบบัตรผ่านจากหน้าบ้าน)**

- ในฝั่ง Frontend (`apiSlice.js`) การใช้ Redux Toolkit Query (RTK Query) จำเป็นต้องตั้งค่า `credentials: 'include'` ใน `fetchBaseQuery`
- คำสั่งนี้เปรียบเสมือนการสั่งให้ `fetch` API ของเบราว์เซอร์ "หยิบ" คุกกี้ที่ได้จาก Phase 2 แนบใส่ HTTP Request Headers ทุกครั้งที่จะยิงกลับไปหา Backend

4. **Phase 4: The Browser Security Policy (การจัดการนโยบาย Third-Party Cookie)**

- **ปัญหาที่พบ:** เกิด Error 401 (Unauthorized) แม้โค้ดจะถูกต้องสมบูรณ์
- **Root Cause Analysis:** เนื่องจาก Vercel และ Render อยู่คนละ Root Domain เบราว์เซอร์ชั้นนำ (เช่น Chrome ในโหมด Incognito, Safari, Brave) จะประเมินว่าคุกกี้ JWT นี้เป็น **Third-Party Cookie** และทำการ "บล็อก" การส่งคุกกี้นี้กลับไปยังเซิร์ฟเวอร์เพื่อป้องกันการติดตาม (Cross-Site Tracking)
- **Resolution:** ต้องอนุญาตการใช้งาน Third-Party Cookie ชั่วคราวที่ฝั่งเบราว์เซอร์ หรือในสถาปัตยกรรมขั้นสูง (Future Scale) อาจต้องย้าย API มาอยู่ภายใต้ Subdomain เดียวกัน (เช่น `api.juicy-healthy.com` และ `www.juicy-healthy.com`) เพื่อเปลี่ยนสถานะเป็น First-Party Cookie

- **Phase 5: The Gatekeeper Verification (การตรวจสอบและยืนยันสิทธิ์)**
- เมื่อ Request เดินทางมาถึงเส้นทางที่ได้รับการป้องกัน (Protected Routes) Middleware `protect` ใน `authMiddleware.js` จะทำงาน
- ใช้ `cookie-parser` สกัดค่า JWT ออกจาก HTTP Request หาก Token ถูกต้องและยังไม่หมดอายุ ระบบจะทำการ Query ข้อมูล User ทิ้งรหัสผ่าน (`select('-password')`) และแนบ Object นั้นเข้ากับ `req.user` เพื่อส่งต่อให้ Controller นำไปใช้งานต่อไป

#### **3. Tools & Packages (The Stack)**

- **`jsonwebtoken` (JWT)**: มาตรฐานเปิด (RFC 7519) สำหรับสร้าง Access Token ที่กะทัดรัดและปลอดภัย (URL-safe) เพื่อใช้ในการอ้างอิงสิทธิ์ระหว่างสองฝ่าย (Claims).
- **`cors`**: Express Middleware สำหรับจัดการ HTTP Headers ควบคุมนโยบาย Same-Origin Policy (SOP) ของเบราว์เซอร์.
- **`cookie-parser`**: Middleware สำหรับแปลง (Parse) ข้อมูลสายอักขระใน HTTP Cookie Header ให้กลายเป็น JavaScript Object (`req.cookies`) ทำให้ฝั่ง Backend ดึงค่า `req.cookies.jwt` ได้โดยตรง.
- **`bcryptjs`** _(เกี่ยวข้องในกระบวนการ Auth)_: ไลบรารีสำหรับทำ Hashing รหัสผ่านก่อนจัดเก็บลงฐานข้อมูล ป้องกันข้อมูลรั่วไหลในกรณีที่ Database ถูกโจมตี (Data Breach).
- **`RTK Query` (Frontend)**: เครื่องมือสำหรับจัดการ Data Fetching และ Caching ซึ่งรองรับการทำ Interceptors และปรับแต่ง HTTP Request (เช่น การใส่ credentials) ได้อย่างละเอียด.

---

### **Part 3: Frontend Deployment & State Management (Deep Dive Architecture)**

ส่วนนี้คือ "หน้าตาและสมองฝั่งลูกค้า" ซึ่งมีความสำคัญมากในการมอบประสบการณ์ใช้งาน (User Experience - UX) ที่ลื่นไหล และเป็นจุดที่รับมือกับการประมวลผลข้อมูลที่ส่งมาจาก Backend

#### **1. Core Concepts**

แอปพลิเคชันฝั่งหน้าบ้าน (Frontend) ถูกพัฒนาในรูปแบบ **Single Page Application (SPA)** โดยใช้ **React.js** เป็นไลบรารีหลัก โครงสร้างการทำงานมุ่งเน้นไปที่ความเร็วในการตอบสนอง (Reactivity) โดยมี **Redux Toolkit (RTK)** เป็นศูนย์กลางในการจัดการสถานะ (Global State) และใช้ **RTK Query** เป็นเครื่องมือขั้นสูงในการจัดการวงจรชีวิตของการเรียก API (Data Fetching, Caching, และ State Synchronization) เพื่อลดความซ้ำซ้อนของโค้ดและเพิ่มประสิทธิภาพการทำงานสูงสุด

#### **2. In-Depth Details (The Frontend Ecosystem)**

ระบบหน้าบ้านถูกแบ่งการทำงานออกเป็น 4 แกนหลัก ดังนี้:

1. **Phase 1: Component & Routing Architecture (สถาปัตยกรรมโครงสร้างหน้าเว็บ)**

- **Client-Side Routing:** ใช้ `react-router-dom` ในการจัดการเส้นทาง (Routes) ภายในแอปพลิเคชัน ทำให้ผู้ใช้สามารถเปลี่ยนหน้าเว็บได้ทันทีโดยไม่ต้องโหลดหน้าใหม่จากเซิร์ฟเวอร์ (No Page Reload)
- **Separation of Concerns (SoC):** โครงสร้างไฟล์ถูกแบ่งออกเป็น `Screens` (คอมโพเนนต์ระดับหน้าเพจ เช่น `OrderScreen`, `ProductScreen`) และ `Components` (คอมโพเนนต์ย่อยที่นำไปใช้ซ้ำได้ เช่น ปุ่ม, การ์ดสินค้า, ฟอร์ม)

2. **Phase 2: Advanced State Management (การจัดการสถานะส่วนกลางด้วยยานแม่)**

- **The Redux Store:** สร้าง Store ส่วนกลางเพื่อเก็บข้อมูลที่ต้องใช้ร่วมกันหลายหน้า เช่น สถานะการล็อกอินของผู้ใช้ (`userInfo`) หรือข้อมูลตะกร้าสินค้า (`cartItems`)
- **RTK Query (`apiSlice.js`):** ทำหน้าที่เป็น "ยานแม่" (Base API Service) ในการสื่อสารกับ Backend
- ใช้ `fetchBaseQuery` เป็น Wrapper ครอบการยิง HTTP Request
- **The Cross-Origin Handshake:** มีการตั้งค่า `credentials: 'include'` ไว้ที่ยานแม่ ซึ่งเป็นจิ๊กซอว์ชิ้นสำคัญที่ทำให้คำสั่ง `fetch` ยอมแนบ HttpOnly Cookie (JWT) ส่งข้ามโดเมนกลับไปยัง Render Backend ได้อย่างสมบูรณ์

3. **Phase 3: Cache Invalidation & Data Synchronization (การจัดการแคช)**

- **Automated Re-fetching:** RTK Query ใช้ระบบ **Tag System** (`tagTypes: ['Product', 'Order', 'User']`) ในการควบคุมแคช
- **ตัวอย่างการทำงาน:** เมื่อมีการยิง Mutation เพื่อสร้างออเดอร์ใหม่ (`createOrder`) ระบบจะทำการ Invalidate (ทำลาย) แคชของ `['Order']` เดิมทิ้ง ส่งผลให้ RTK Query วิ่งไปดึงข้อมูลออเดอร์อัปเดตล่าสุดจาก Backend มาแสดงผลที่หน้าจอโดยอัตโนมัติ (Reactive UI) โดยที่นักพัฒนาไม่ต้องเขียนโค้ดสั่ง Fetch ใหม่เอง

4. **Phase 4: Production Deployment & CI/CD (การนำขึ้นระบบจริง)**

- **Vercel Edge Network:** โค้ด Frontend ถูกนำไปโฮสต์บน **Vercel** ซึ่งมีระบบ Global CDN ช่วยให้โหลดหน้าเว็บได้เร็วที่สุดไม่ว่าผู้ใช้จะอยู่ที่ไหน
- **Continuous Integration / Continuous Deployment (CI/CD):** Vercel ถูกผูกเข้ากับ GitHub Repository ทำให้ทุกครั้งที่มีการ Push โค้ดขึ้น Branch หลัก (main) ระบบจะทำการ Build และ Deploy เวอร์ชันใหม่ให้โดยอัตโนมัติ
- **Environment Variables & Constants:** มีการแยกตัวแปร `BASE_URL` ไว้ในไฟล์ `constants.js` เพื่อชี้เป้าหมายการยิง API ไปที่ Production Backend (`https://juicy-healthy-api.onrender.com`) อย่างแม่นยำ

#### **3. Tools & Packages (The Stack)**

- **`react` & `react-dom**`: แกนหลักสำหรับการสร้าง User Interface แบบ Component-based.
- **`react-router-dom`**: ไลบรารีสำหรับจัดการ Navigation และ URL ภายใน Single Page Application.
- **`@reduxjs/toolkit`**: มาตรฐานใหม่ของ Redux ที่ช่วยลด Boilerplate Code ในการตั้งค่า Store และ Reducers.
- **`RTK Query`** _(อยู่ใน Redux Toolkit)_: สุดยอดเครื่องมือ Data Fetching และ Caching Architecture ที่มาช่วยจัดการ Loading State, Error State และการ Sync ข้อมูลระหว่างฝั่ง Client กับ Server.
- **`Tailwind CSS`**: UI Framework ที่ใช้ในการจัด Layout และ Styling ให้เป็น Responsive Design รองรับการแสดงผลทุกขนาดหน้าจอ.

---

### Conclusion 🚀🍏🍑

โปรเจกต์ **Juicy Healthy** เว็บ E-Commerce สำหรับผม มันคือการฝึกฝนและบททดสอบ เรื่องการผสานสถาปัตยกรรมแบบ **Decoupled (แยกหน้าบ้าน-หลังบ้าน)** ดังนี้:

1. การวางโครงสร้าง **MongoDB** และ **Express**
2. การเจาะทะลวงกำแพง **CORS** และวางระบบ **JWT HttpOnly Cookies**
3. การจัดการ **Global State** และนำหน้าบ้านขึ้นโชว์บน **Vercel** และติดต่อกับส่วนหลังบ้านบน **Render**

ผมทำระบบให้ Core Feature (CORS, Auth, Database) มันสมบูรณ์ที่สุดแล้ว ส่วนฟีเจอร์อื่นๆ ผมสามารถเรียนรู้และเติมได้ทีหลัง แต่ตอนนี้ผมขอโฟกัสที่การทำ Fundamental ให้แน่นปึ้กก่อนครับ"

> "Through the development of the **Juicy Healthy** project, I pushed my limits to demonstrate a solid grasp of **Architectural Understanding** and **Problem-Solving Skills**. While there are numerous features I am eager to implement to expand this platform, I have strategically chosen to prioritize my time. My current focus is to deeply invest in mastering the core foundations and fundamentals required to become a high-caliber Full Stack Developer.
> As I enter the final phase of the Generation Thailand Bootcamp, I am channeling all my energy into studying harder and refining my craft. I am driven by a strong growth mindset and the absolute conviction that I will become a highly proficient developer. In this journey, I hold on to one core belief: **Consistency always wins.**"
