"use client"

import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface WebhookLog {
    id: string
    timestamp: string
    type: string
    order_number: string
    promoter_id: string | null
    event_id: string
    success: boolean
    error_message?: string
    raw_data: any
}

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:3001"

export default function DevWebhooksPage() {
    // Development mode check - only accessible in development
    if (process.env.NODE_ENV !== "development" && !process.env.VERCEL_URL?.includes("localhost")) {
        notFound()
    }

    const [logs, setLogs] = useState<WebhookLog[]>([])

    useEffect(() => {
        const fetchInitialLogs = async () => {
            try {
                const response = await fetch(`${FLASK_API_URL}/api/webhook/events`)
                const data = await response.json()
                setLogs(data)
            } catch (error) {
                console.error("Failed to fetch initial webhook logs:", error)
            }
        }

        fetchInitialLogs()

        const eventSource = new EventSource(`${FLASK_API_URL}/api/webhook/events/stream`)

        eventSource.onmessage = (event) => {
            const newLog: WebhookLog = JSON.parse(event.data)
            setLogs((prevLogs) => [newLog, ...prevLogs])
        }

        eventSource.onerror = (error) => {
            console.error("SSE error:", error)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, [])

    return (
        <div className="min-h-screen bg-black">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-12">
                    <h1 className="mb-4 text-4xl font-bold text-foreground">Real-time Webhook Feed</h1>
                    <p className="text-muted-foreground">Live stream of incoming webhook events</p>
                </div>

                <div className="space-y-4">
                    {logs.map((log) => (
                        <Card key={log.id} className="border-border bg-card p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-lg font-semibold text-foreground">{log.type}</p>
                                    <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded ${log.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {log.success ? "Success" : "Failed"}
                                </span>
                            </div>
                            {log.order_number && (
                                <p className="mt-2 text-sm text-muted-foreground">Order: {log.order_number}</p>
                            )}
                            {log.promoter_id && (
                                <p className="text-sm text-muted-foreground">Promoter: {log.promoter_id}</p>
                            )}
                            {log.error_message && (
                                <p className="mt-2 text-sm text-red-600">Error: {log.error_message}</p>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
