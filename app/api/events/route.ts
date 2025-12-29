import { getEvents } from "@/lib/data-store"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const events = await getEvents()
        return NextResponse.json(events)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }
}