import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { WebhookSimulationDashboard } from "@/components/dev/webhook-simulation-dashboard"

export default function DevWebhooksPage() {
    // Development mode check - only accessible in development
    if (process.env.NODE_ENV !== "development" && !process.env.VERCEL_URL?.includes("localhost")) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-12">
                    <h1 className="mb-4 text-4xl font-bold text-white">Webhook Simulation Suite</h1>
                    <p className="text-white/60">System-level webhook testing and monitoring dashboard</p>
                </div>

                <WebhookSimulationDashboard />
            </div>
        </div>
    )
}