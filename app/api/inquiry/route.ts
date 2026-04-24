import { NextResponse } from "next/server";
import { z } from "zod";
import { appendInquiryToGoogleSheet } from "@/lib/google/sheets";
import type { InquiryInsert } from "@/types/database";

const inquirySchema = z.object({
	full_name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters long")
		.max(120, "Name must be 120 characters or fewer"),
	email: z
		.string()
		.trim()
		.email("Invalid email address")
		.max(254, "Email is too long"),
	message: z
		.string()
		.trim()
		.min(1, "Message is required")
		.max(4000, "Message must be 4000 characters or fewer"),
});

function isTimeoutLikeError(error: unknown): boolean {
	const message = error instanceof Error ? error.message.toLowerCase() : "";
	return message.includes("timeout") || message.includes("timed out");
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = inquirySchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: parsed.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const payload: InquiryInsert = {
			full_name: parsed.data.full_name,
			email: parsed.data.email,
			message: parsed.data.message,
			status: "new",
		};

		try {
			await appendInquiryToGoogleSheet(payload);
		} catch (error) {
			if (isTimeoutLikeError(error)) {
				return NextResponse.json(
					{ error: "Database timeout. Please retry.", code: "DB_TIMEOUT" },
					{ status: 400 }
				);
			}
			return NextResponse.json(
				{ error: "Failed to create inquiry in Google Sheets" },
				{ status: 400 }
			);
		}

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		if (isTimeoutLikeError(error)) {
			return NextResponse.json(
				{ error: "Database timeout. Please retry.", code: "DB_TIMEOUT" },
				{ status: 400 }
			);
		}

		if (error instanceof SyntaxError) {
			return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
		}

		return NextResponse.json({ error: "Invalid inquiry request" }, { status: 400 });
	}
}
