"use client"

import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Activity,
    RefreshCw,
    Database,
    TrendingUp,
    Clock,
    DollarSign,
    Users
} from "lucide-react"
import { useEffect, useState } from "react"

interface WebhookEvent {
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

interface SalesMetric {
    totalSales: number
    totalOrders: number
    activeEvents: number
    lastUpdated: string
}

export default function DevWebhookPage() {
    // Development mode check - only accessible in development
    if (process.env.NODE_ENV !== "development" && !process.env.VERCEL_URL?.includes("localhost")) {
        notFound()
    }

    const [events, setEvents] = useState<WebhookEvent[]>([])
    const [metrics, setMetrics] = useState<SalesMetric>({
        totalSales: 0,
        totalOrders: 0,
        activeEvents: 0,
        lastUpdated: new Date().toISOString()
    })
    const [isLive, setIsLive] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const fetchWebhookEvents = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/webhook-logs')
            if (response.ok) {
                const data = await response.json()
                setEvents(data)

                // Calculate metrics
                const totalOrders = data.length
                const totalSales = data.reduce((sum: number, event: WebhookEvent) => {
                    if (event.success && event.raw_data?.total) {
                        return sum + event.raw_data.total
                    }
                    return sum
                }, 0)

                const activeEvents = new Set(data.map((event: WebhookEvent) => event.event_id)).size

                setMetrics({
                    totalSales,
                    totalOrders,
                    activeEvents,
                    lastUpdated: new Date().toISOString()
                })
            }
        } catch (error) {
            console.error('Error fetching webhook events:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchWebhookEvents()

        // Set up live polling if enabled
        let interval: NodeJS.Timeout
        if (isLive) {
            interval = setInterval(fetchWebhookEvents, 5000) // Poll every 5 seconds
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isLive])

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString()
    }

    const getStatusColor = (success: boolean) => {
        return success ? "bg-green-500" : "bg-red-500"
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-4xl font-bold text-foreground">Real-time Webhook Monitor</h1>
                            <p className="text-muted-foreground">Live ticket sales logging and webhook endpoint monitoring</p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setIsLive(!isLive)}
                                className={`flex items-center gap-2 ${isLive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                            >
                                <Activity className="h-4 w-4" />
                                {isLive ? 'Live Mode Active' : 'Enable Live Mode'}
                            </Button>
                            <Button
                                onClick={fetchWebhookEvents}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Sales</p>
                                <p className="text-2xl font-bold text-foreground">${metrics.totalSales.toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                    </Card>

                    <Card className="border-border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold text-foreground">{metrics.totalOrders}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </Card>

                    <Card className="border-border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Events</p>
                                <p className="text-2xl font-bold text-foreground">{metrics.activeEvents}</p>
                            </div>
                            <Database className="h-8 w-8 text-purple-500" />
                        </div>
                    </Card>

                    <Card className="border-border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                <p className="text-sm font-medium text-foreground">{formatTimestamp(metrics.lastUpdated)}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </Card>
                </div>

                {/* Live Feed */}
                <Card className="border-border bg-card">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">Live Sales Feed</h3>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                                <span className="text-sm text-muted-foreground">{isLive ? 'Streaming live' : 'Manual refresh'}</span>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="h-[600px]">
                        <div className="divide-y divide-border">
                            {events.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No webhook events yet. Enable live mode or wait for incoming sales.
                                </div>
                            ) : (
                                events.map((event) => (
                                    <div key={event.id} className="p-6 hover:bg-card/50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${getStatusColor(event.success)}`}></div>
                                                <span className="text-sm font-medium text-foreground">{event.type}</span>
                                                <Badge variant={event.success ? "default" : "destructive"}>
                                                    {event.success ? "Success" : "Failed"}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Order:</span>
                                                <span className="ml-2 text-foreground font-mono">{event.order_number}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Event:</span>
                                                <span className="ml-2 text-foreground">{event.event_id}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Promoter:</span>
                                                <span className="ml-2 text-foreground">{event.promoter_id || 'Direct'}</span>
                                            </div>
                                        </div>

                                        {event.raw_data && (
                                            <div className="mt-3 p-3 bg-background rounded-md">
                                                <details className="text-xs">
                                                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                                        Raw Webhook Data
                                                    </summary>
                                                    <pre className="mt-2 overflow-auto max-h-32 text-xs">
                                                        {JSON.stringify(event.raw_data, null, 2)}
                                                    </pre>
                                                </details>
                                            </div>
                                        )}

                                        {event.error_message && (
                                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                                                Error: {event.error_message}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    )
}