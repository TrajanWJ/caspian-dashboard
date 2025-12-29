"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    CheckCircle,
    AlertTriangle,
    Clock,
    Database,
    Wifi,
    Cpu,
    MemoryStick,
    Zap,
    RefreshCw
} from "lucide-react"

interface SystemStatus {
    apiStatus: "healthy" | "degraded" | "down"
    databaseStatus: "healthy" | "degraded" | "down"
    webhookStatus: "healthy" | "degraded" | "down"
    performance: number
    memoryUsage: number
    cpuUsage: number
    lastUpdated: string
}

export function SystemStatusDashboard() {
    const [status, setStatus] = useState<SystemStatus>({
        apiStatus: "healthy",
        databaseStatus: "healthy",
        webhookStatus: "healthy",
        performance: 85,
        memoryUsage: 45,
        cpuUsage: 30,
        lastUpdated: new Date().toISOString()
    })

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshStatus = async () => {
        setIsRefreshing(true)
        // Simulate API call to get system status
        await new Promise(resolve => setTimeout(resolve, 1000))

        setStatus(prev => ({
            ...prev,
            lastUpdated: new Date().toISOString(),
            performance: Math.floor(Math.random() * 100),
            memoryUsage: Math.floor(Math.random() * 100),
            cpuUsage: Math.floor(Math.random() * 100)
        }))

        setIsRefreshing(false)
    }

    useEffect(() => {
        const interval = setInterval(refreshStatus, 30000) // Refresh every 30 seconds
        return () => clearInterval(interval)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "healthy": return "bg-green-500"
            case "degraded": return "bg-yellow-500"
            case "down": return "bg-red-500"
            default: return "bg-gray-500"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "healthy": return "Healthy"
            case "degraded": return "Degraded"
            case "down": return "Down"
            default: return "Unknown"
        }
    }

    return (
        <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">System Status Overview</h2>
                    <p className="text-white/60 text-sm">Real-time monitoring of all system components</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-white/60">
                        Last updated: {new Date(status.lastUpdated).toLocaleTimeString()}
                    </span>
                    <Button
                        onClick={refreshStatus}
                        disabled={isRefreshing}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* API Status */}
                <Card className="border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(status.apiStatus)}`} />
                            <div>
                                <div className="text-sm font-medium text-white">API Status</div>
                                <div className="text-xs text-white/60">Webhook endpoints</div>
                            </div>
                        </div>
                        <Badge variant="outline" className={`border-white/20 ${status.apiStatus === 'healthy' ? 'text-green-400' : status.apiStatus === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`}>
                            {getStatusText(status.apiStatus)}
                        </Badge>
                    </div>
                </Card>

                {/* Database Status */}
                <Card className="border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-blue-400" />
                            <div>
                                <div className="text-sm font-medium text-white">Database</div>
                                <div className="text-xs text-white/60">Mock data store</div>
                            </div>
                        </div>
                        <Badge variant="outline" className={`border-white/20 ${status.databaseStatus === 'healthy' ? 'text-green-400' : status.databaseStatus === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`}>
                            {getStatusText(status.databaseStatus)}
                        </Badge>
                    </div>
                </Card>

                {/* Webhook Status */}
                <Card className="border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Wifi className="h-5 w-5 text-purple-400" />
                            <div>
                                <div className="text-sm font-medium text-white">Webhooks</div>
                                <div className="text-xs text-white/60">Event processing</div>
                            </div>
                        </div>
                        <Badge variant="outline" className={`border-white/20 ${status.webhookStatus === 'healthy' ? 'text-green-400' : status.webhookStatus === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`}>
                            {getStatusText(status.webhookStatus)}
                        </Badge>
                    </div>
                </Card>

                {/* Performance */}
                <Card className="border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-yellow-400" />
                            <div>
                                <div className="text-sm font-medium text-white">Performance</div>
                                <div className="text-xs text-white/60">Response time</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-white">{status.performance}%</div>
                            <Progress value={status.performance} className="w-20" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Memory Usage */}
                <Card className="border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <MemoryStick className="h-5 w-5 text-blue-400" />
                            <span className="text-sm font-medium text-white">Memory Usage</span>
                        </div>
                        <span className="text-sm text-white/60">{status.memoryUsage}%</span>
                    </div>
                    <Progress value={status.memoryUsage} className="w-full" />
                </Card>

                {/* CPU Usage */}
                <Card className="border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Cpu className="h-5 w-5 text-green-400" />
                            <span className="text-sm font-medium text-white">CPU Usage</span>
                        </div>
                        <span className="text-sm text-white/60">{status.cpuUsage}%</span>
                    </div>
                    <Progress value={status.cpuUsage} className="w-full" />
                </Card>
            </div>
        </Card>
    )
}