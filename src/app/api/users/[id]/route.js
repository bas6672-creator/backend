
import { NextResponse } from "next/server";
import db from "../../../lib/db";

//==================================================
// GET By ID
//==================================================
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    // ดึงข้อมูลผู้ใช้ โดยไม่ส่งรหัสผ่านกลับไป
    const [rows] = await db.query(
      `SELECT 
        id,
        firstname,
        fullname,
        lastname,
        username,
        status,
        created_at,
        updated_at
      FROM tbl_users
      WHERE id = ?
      LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `ดึงข้อมูลผู้ใช้ ID: ${id} สำเร็จ`,
        data: rows[0],
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

//==================================================
// PUT By ID
//==================================================
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // ตรวจสอบว่ามีผู้ใช้นี้หรือไม่
    const [rows] = await db.query(
      "SELECT id FROM tbl_users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ฟิลด์ที่อนุญาตให้แก้ไข
    const allowedFields = [
      "firstname",
      "fullname",
      "lastname",
      "username",
      "status"
    ];

    const fields = allowedFields.filter(
      (field) => body[field] !== undefined
    );

    if (fields.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่มีข้อมูลที่ต้องการแก้ไข"
        },
        { status: 400 }
      );
    }

    const values = fields.map((field) => body[field]);

    const setClause = fields
      .map((field) => `${field} = ?`)
      .join(", ");

    await db.query(
      `UPDATE tbl_users 
       SET ${setClause}, updated_at = NOW()
       WHERE id = ?`,
      [...values, userId]
    );

    // ดึงข้อมูลล่าสุดหลังแก้ไข
    const [updatedRows] = await db.query(
      `SELECT id, firstname, fullname, lastname,
              username, status, created_at, updated_at
       FROM tbl_users
       WHERE id = ?`,
      [userId]
    );

    return NextResponse.json(
      {
        success: true,
        message: `แก้ไขข้อมูลผู้ใช้ ID: ${id} สำเร็จ`,
        data: updatedRows[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("PUT Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

//==================================================
// DELETE By ID
//==================================================
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      "DELETE FROM tbl_users WHERE id = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `ลบข้อมูลผู้ใช้ ID: ${id} สำเร็จ`,
        id: userId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
