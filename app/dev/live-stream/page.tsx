"use client"

import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Radio, Activity, Volume2, VolumeX, Play, Pause } from "lucide-react"
import { useEffect, useState } from "react"

export default function DevLiveStreamPage() {
    // Development mode check - only accessible in development
    if (process.env.NODE_ENV !== "development" && !process.env.VERCEL_URL?.includes("localhost")) {
        notFound()
    }

    const [isStreaming, setIsStreaming] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [events, setEvents] = useState<any[]>([])

    const mockEvents = [
        {
            id: '1',
            timestamp: new Date().toISOString(),
            type: 'sale',
            title: 'New Ticket Sale',
            description: 'Ticket purchased for Summer Music Festival 2024',
            data: { amount: 75, event: 'Summer Music Festival 2024' }
        },
        {
            id: '2',
            timestamp: new Date(Date.now() - 30000).toISOString(),
            type: 'new_promoter',
            title: 'New Promoter Registered',
            description: 'Sarah Johnson joined the platform',
            data: { name: 'Sarah Johnson', tier: 'Bronze' }
        }
    ]

    const startStreaming = () => {
        setIsStreaming(true)
        setEvents(mockEvents)
    }

    const stopStreaming = () => {
        setIsStreaming(false)
        setEvents([])
    }

    useEffect(() => {
        if (isStreaming) {
            const interval = setInterval(() => {
                // Simulate new events
                if (Math.random() > 0.7) {
                    const newEvent = {
                        ...mockEvents[0],
                        id: Date.now().toString(),
                        timestamp: new Date().toISOString()
                    }
                    setEvents(prev => [newEvent, ...prev.slice(0, 9)])
                }
            }, 3000)

            return () => clearInterval(interval)
        }
    }, [isStreaming])

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-4xl font-bold text-foreground">Live Stream Monitor</h1>
                        <p className="text-muted-foreground">Real-time event streaming and system activity monitoring</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setIsMuted(!isMuted)}
                            variant="outline"
                            className="border-border text-foreground hover:bg-card"
                        >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <Button
                            onClick={() => isStreaming ? stopStreaming() : startStreaming()}
                            className={`flex items-center gap-2 ${isStreaming
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            {isStreaming ? 'Stop Stream' : 'Start Stream'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stream Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Active Streams</p>
                            <p className="text-2xl font-bold text-foreground">1</p>
                        </div>
                        <Radio className="h-8 w-8 text-blue-500" />
                    </div>
                </Card>

                <Card className="border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Viewers</p>
                            <p className="text-2xl font-bold text-foreground">42</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-500" />
                    </div>
                </Card>

                <Card className="border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Events/Min</p>
                            <p className="text-2xl font-bold text-foreground">3</p>
                        </div>
                        <Radio className="h-8 w-8 text-purple-500" />
                    </div>
                </Card>

                <Card className="border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">System Health</p>
                            <p className="text-lg font-bold text-green-500">Excellent</p>
                        </div>
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    </div>
                </Card>
            </div>

            {/* Live Stream */}
            <Card className="border-border bg-card">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Live Event Stream</h3>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                            <span className="text-sm text-muted-foreground">
                                {isStreaming ? 'Streaming live' : 'Stream offline'}
                            </span>
                            <Badge variant={isStreaming ? "default" : "secondary"}>
                                {events.length} events
                            </Badge>
                        </div>
                    </div>
                </div>

                <ScrollArea className="h-[600px]">
                    <div className="divide-y divide-border">
                        {!isStreaming ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Radio className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p className="text-lg mb-2">Stream is offline</p>
                                <p className="text-sm">Click "Start Stream" to begin real-time event monitoring</p>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p>Waiting for events...</p>
                            </div>
                        ) : (
                            events.map((event) => (
                                <div key={event.id} className="p-6 border-l-4 border-l-green-500 bg-green-500/10 transition-all duration-300 hover:bg-card/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">💰</span>
                                            <div>
                                                <h4 className="font-semibold text-foreground">{event.title}</h4>
                                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="secondary" className="mb-1">
                                                {event.type}
                                            </Badge>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    )
}