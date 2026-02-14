import { NextResponse } from "next/server";
import { aiProvider } from "@/lib/ai/provider";

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    const websiteKeywords = [
      "build",
      "create",
      "design",
      "generate",
      "website",
      "landing page",
      "app",
      "site",
      "ui",
    ];
    const isWebsiteRequest = websiteKeywords.some((keyword) =>
      lastMessage.includes(keyword),
    );

    if (isWebsiteRequest) {
      return NextResponse.json({ isWebsiteRequest: true });
    }

    const content = await aiProvider.chat(messages, model);
    return NextResponse.json({ content, isWebsiteRequest: false });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
