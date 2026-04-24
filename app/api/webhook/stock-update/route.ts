import { NextResponse } from "next/server";
import { syncInventoryFromGoogleSheet } from "@/lib/actions/googleSync";

function isTimeoutLikeError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return message.includes("timeout") || message.includes("timed out");
}

function isAuthorized(request: Request): boolean {
  const expected = process.env.GOOGLE_SYNC_TOKEN;
  if (!expected) {
    return true;
  }

  const provided = request.headers.get("x-sync-token");
  return provided === expected;
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const synced = await syncInventoryFromGoogleSheet();

    return NextResponse.json({ success: true, synced }, { status: 200 });
  } catch (error) {
    // AGGRESSIVE LOGGING
    console.log("-----------------------------------------");
    console.error("!!! [WEBHOOK FATAL ERROR] !!!");
    console.error("Type:", typeof error);
    console.error("Content:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
    console.log("-----------------------------------------");

    if (isTimeoutLikeError(error)) {
      return NextResponse.json(
        { error: "Database timeout. Please retry.", code: "DB_TIMEOUT" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Internal Server Error",
        details: JSON.stringify(error) 
      },
      { status: 500 }
    );
  }
}
