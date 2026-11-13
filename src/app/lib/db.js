// นำเข้าไลบรารี mysql2 เวอร์ชัน Promise เพื่อใช้งานร่วมกับ async/await ได้
import mysql from 'mysql2/promise';

// สร้างอ็อบเจกต์สำหรับเก็บค่าตั้งต้นในการเชื่อมต่อฐานข้อมูล
const poolConfig = {
  host: process.env.DB_HOST,                 // ที่อยู่เซิร์ฟเวอร์ฐานข้อมูล (จากไฟล์ .env)
  port: Number(process.env.DB_PORT) || 3306, // พอร์ตเชื่อมต่อ (แปลงเป็นตัวเลข ถ้าไม่ระบุให้ใช้ 3306)
  user: process.env.DB_USER,                 // ชื่อผู้ใช้งานฐานข้อมูล
  password: process.env.DB_PASS,             // รหัสผ่านฐานข้อมูล
  database: process.env.DB_NAME,             // ชื่อฐานข้อมูลที่ต้องการใช้งาน
  waitForConnections: true,                  // หาก Connection เต็ม ให้เข้าคิวรอแทนการโยน Error ทันที
  connectionLimit: 10,                       // จำกัดจำนวน Connection สูงสุดพร้อมกันไม่เกิน 10 ช่องทาง
};

// อ้างอิงตัวแปรระดับ Global ของระบบ (ไม่ถูกรีเซ็ตเมื่อไฟล์ถูกโหลดซ้ำ)
const globalForMySQL = globalThis;

// ตรวจสอบว่ามี Connection Pool เดิมในระบบหรือยัง ถ้าไม่มีให้สร้างใหม่จาก poolConfig
const db = globalForMySQL.mysqlPool || mysql.createPool(poolConfig);

// หากกำลังรันในโหมดพัฒนา (Development) ให้บันทึก Pool เก็บไว้ในตัวแปร Global
// เพื่อป้องกันการสร้าง Connection ซ้ำซ้อนทุกครั้งที่เซฟโค้ดแล้ว Next.js ทำ Hot Reload
if (process.env.NODE_ENV !== 'production') {
  globalForMySQL.mysqlPool = db;
}

// ส่งออกตัวแปร db เพื่อให้นำไป import และสั่ง Query ในไฟล์อื่นได้
export default db;