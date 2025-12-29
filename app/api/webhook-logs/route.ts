import { getWebhookLogs } from "@/lib/data-store"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const logs = await getWebhookLogs()
        return NextResponse.json(logs)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch webhook logs" }, { status: 500 })
    }
}