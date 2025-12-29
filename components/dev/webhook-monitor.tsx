"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Play,
    Pause,
    RefreshCw,
    Copy,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle
} from "lucide-react"

interface WebhookTestResult {
    id: string
    timestamp: string
    status: "success" | "error" | "timeout"
    statusCode: number
    responseTime: number
    payload: any
    response?: any
    error?: string
}

interface WebhookMonitorProps {
    testResults: WebhookTestResult[]
    onTestWebhook: (payload: any) => void
}

export function WebhookMonitor({ testResults, onTestWebhook }: WebhookMonitorProps) {
    const [isAutoRefresh, setIsAutoRefresh] = useState(true)
    const [showDetails, setShowDetails] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>("all")

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-400" />
            case "error":
                return <XCircle className="h-4 w-4 text-red-400" />
            case "timeout":
                return <Clock className="h-4 w-4 text-yellow-400" />
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-400" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "success":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "error":
                return "bg-red-500/20 text-red-400 border-red-500/30"
            case "timeout":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const filteredResults = testResults.filter(result => {
        if (filterStatus === "all") return true
        return result.status === filterStatus
    })

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (error) {
            console.error("Failed to copy to clipboard:", error)
        }
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                            variant={isAutoRefresh ? "default" : "outline"}
                            className={isAutoRefresh ? "bg-green-500 hover:bg-green-600 text-white" : "border-white/20 text-white"}
                        >
                            {isAutoRefresh ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isAutoRefresh ? "Pause" : "Resume"} Auto Refresh
                        </Button>
                        <Button
                            onClick={() => setShowDetails(null)}
                            variant="outline"
                            className="border-white/20 text-white"
                        >
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide All Details
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-white/60">
                            Showing {filteredResults.length} of {testResults.length} results
                        </div>
                        <Button
                            onClick={() => setFilterStatus("all")}
                            variant={filterStatus === "all" ? "default" : "outline"}
                            className="border-white/20 text-white"
                        >
                            All
                        </Button>
                        <Button
                            onClick={() => setFilterStatus("success")}
                            variant={filterStatus === "success" ? "default" : "outline"}
                            className="border-white/20 text-white"
                        >
                            Success
                        </Button>
                        <Button
                            onClick={() => setFilterStatus("error")}
                            variant={filterStatus === "error" ? "default" : "outline"}
                            className="border-white/20 text-white"
                        >
                            Errors
                        </Button>
                        <Button
                            onClick={() => setFilterStatus("timeout")}
                            variant={filterStatus === "timeout" ? "default" : "outline"}
                            className="border-white/20 text-white"
                        >
                            Timeouts
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Results List */}
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Recent Webhook Activity</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-white/60">Auto refresh: {isAutoRefresh ? "ON" : "OFF"}</span>
                        {isAutoRefresh && <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />}
                    </div>
                </div>

                <ScrollArea className="h-[600px] w-full">
                    <div className="space-y-4">
                        {filteredResults.length === 0 ? (
                            <div className="text-center text-white/60 py-8">
                                No webhook results to display. Run a test to see results here.
                            </div>
                        ) : (
                            filteredResults.map((result) => (
                                <div key={result.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(result.status)}
                                            <span className="font-mono text-sm text-white">{result.id}</span>
                                            <Badge className={getStatusColor(result.status)}>
                                                {result.status.toUpperCase()}
                                            </Badge>
                                            {result.statusCode > 0 && (
                                                <Badge variant="outline" className="border-white/20 text-white">
                                                    {result.statusCode}
                                                </Badge>
                                            )}
                                            <span className="text-sm text-white/60">{result.responseTime}ms</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowDetails(showDetails === result.id ? null : result.id)}
                                                className="border-white/20 text-white"
                                            >
                                                {showDetails === result.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyToClipboard(JSON.stringify(result.payload, null, 2))}
                                                className="border-white/20 text-white"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-xs text-white/40 mb-3">
                                        {new Date(result.timestamp).toLocaleString()}
                                    </div>

                                    {showDetails === result.id && (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                                            <div>
                                                <h4 className="text-sm font-semibold text-white mb-2">Request Payload</h4>
                                                <pre className="bg-black/50 p-3 rounded text-xs text-white/80 overflow-auto max-h-40">
                                                    {JSON.stringify(result.payload, null, 2)}
                                                </pre>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-white mb-2">Response</h4>
                                                {result.error ? (
                                                    <div className="bg-red-500/10 border border-red-500/30 p-3 rounded">
                                                        <div className="text-red-400 text-sm font-mono">{result.error}</div>
                                                    </div>
                                                ) : (
                                                    <pre className="bg-black/50 p-3 rounded text-xs text-white/80 overflow-auto max-h-40">
                                                        {typeof result.response === 'string' ? result.response : JSON.stringify(result.response, null, 2)}
                                                    </pre>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    )
}