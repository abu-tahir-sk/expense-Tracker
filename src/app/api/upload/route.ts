import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    
    // Path to public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    // Make sure directory exists
    try {
      await writeFile(filepath, buffer);
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        const fs = require('fs');
        fs.mkdirSync(uploadDir, { recursive: true });
        await writeFile(filepath, buffer);
      } else {
        throw e;
      }
    }

    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
