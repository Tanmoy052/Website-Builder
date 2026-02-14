import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(req: Request) {
  try {
    const { files } = await req.json();
    const zip = new JSZip();

    files.forEach((file: { path: string; content: string }) => {
      zip.file(file.path, file.content);
    });

    const content = await zip.generateAsync({ type: "uint8array" });

    return new Response(content as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=project.zip",
      },
    });
  } catch (error) {
    console.error("Export ZIP Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
