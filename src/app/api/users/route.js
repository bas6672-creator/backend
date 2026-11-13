// นำเข้า NextResponse จาก next/server เพื่อใช้จัดการและส่งค่า HTTP Response กลับไปยังไคลเอนต์
import { NextResponse } from "next/server";
// นำเข้าโมดูลเชื่อมต่อฐานข้อมูลจาก @/lib/db
import db from "../../lib/db";

//================================================================================
// GET Function (/src/app/api/users/route.js)
//================================================================================
/**
 * Route Handler สำหรับ HTTP Method: GET
 * ทำหน้าที่ดึงข้อมูลผู้ใช้ทั้งหมดจากตาราง tbl_users ในฐานข้อมูล
 */
export async function GET() {
  try {
    // พิมพ์ Log ข้อความลงในฝั่งเซิร์ฟเวอร์ (Server Console) เพื่อใช้ในการ Monitor หรือ Debug
    console.log({ success: true, message: "กำลังดึงข้อมูลผู้ใช้จากฐานข้อมูล...", status: 200 });

    // ดึงข้อมูลผู้ใช้ (แนะนำให้ระบุเฉพาะคอลัมน์ที่จำเป็น เช่น SELECT id, username, email FROM tbl_users และไม่ควร SELECT password ออกไป)
    const [rows] = await db.query('SELECT * FROM tbl_users');

    // ส่ง Response กลับไปยังฝั่ง Client ในรูปแบบ JSON พร้อมข้อมูลผู้ใช้และจำนวนทั้งหมด
    return NextResponse.json(
      {
        success: true,
        message: "ดึงข้อมูลผู้ใช้สำเร็จ",
        total: rows.length,
        data: rows,
      },
      { status: 200 }
    );
  } catch (error) {
    // ดักจับ Error ที่อาจเกิดขึ้นระหว่างการทำงานใน try block หรือ Database query error
    console.error('Database query error:', error);

    // ส่ง HTTP Response แจ้งเตือนข้อผิดพลาดกลับไปยัง Client ด้วย Status 500 (Internal Server Error)
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

//================================================================================
// POST Function (/src/app/api/users/route.js)
//================================================================================
/**
 * Route Handler สำหรับ HTTP Method: POST
 * ทำหน้าที่รองรับ Request แบบ POST สำหรับเพิ่มข้อมูลผู้ใช้ใหม่
 */
export async function POST(request) {
  try {
    // หมายเหตุ: คุณสามารถดึงข้อมูลจาก Request Body ได้ด้วย await request.json() 
    // หากต้องการนำไปเขียนคำสั่ง SQL INSERT ต่อไปในอนาคต

    console.log({ success: true, message: "เพิ่มข้อมูลผู้ใช้สำเร็จ", status: 201 });
    
    return NextResponse.json(
      {
        success: true,
        message: "เพิ่มข้อมูลผู้ใช้สำเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}