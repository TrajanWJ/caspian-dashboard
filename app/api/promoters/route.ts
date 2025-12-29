import { getPromoters } from "@/lib/data-store"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const promoters = await getPromoters()
        return NextResponse.json(promoters)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch promoters" }, { status: 500 })
    }
}