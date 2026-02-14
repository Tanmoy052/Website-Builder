import { NextResponse } from "next/server";
import { aiProvider } from "@/lib/ai/provider";

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    // Simple logic to detect if the user wants to build a website
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    const isWebsiteRequest =
      lastMessage.includes("build") ||
      lastMessage.includes("create") ||
      lastMessage.includes("website") ||
      lastMessage.includes("app");

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
