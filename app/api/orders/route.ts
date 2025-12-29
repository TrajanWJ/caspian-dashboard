import { getOrders } from "@/lib/data-store"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const orders = await getOrders()
        return NextResponse.json(orders)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
}