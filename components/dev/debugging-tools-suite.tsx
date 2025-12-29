"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Bug,
    AlertTriangle,
    Terminal,
    Eye,
    RefreshCw,
    Play,
    Pause,
    FileText,
    Network,
    Database,
    Zap
} from "lucide-react"

interface LogEntry {
    id: string
    timestamp: string
    level: "info" | "warn" | "error" | "debug"
    message: string
    source: string
    data?: any
}

interface ErrorBoundary {
    id: string
    component: string
    error: string
    stack?: string
    timestamp: string
    resolved: boolean
}

interface NetworkRequest {
    id: string
    url: string
    method: string
    status: number
    duration: number
    timestamp: string
    response?: any
}

export function DebuggingToolsSuite() {
    const [logs, setLogs] = useState<LogEntry[]>([
        {
            id: "1",
            timestamp: new Date().toISOString(),
            level: "info",
            message: "Application initialized successfully",
            source: "App"
        },
        {
            id: "2",
            timestamp: new Date(Date.now() - 5000).toISOString(),
            level: "warn",
            message: "Slow API response detected",
            source: "API",
            data: { endpoint: "/api/events", duration: 2450 }
        },
        {
            id: "3",
            timestamp: new Date(Date.now() - 10000).toISOString(),
            level: "error",
            message: "Failed to load component",
            source: "ComponentLoader",
            data: { component: "DataTable", error: "Module not found" }
        }
    ])

    const [errors, setErrors] = useState<ErrorBoundary[]>([
        {
            id: "1",
            component: "MetricCard",
            error: "Cannot read property 'map' of undefined",
            stack: "at MetricCard (components/metric-card.tsx:25:12)",
            timestamp: new Date(Date.now() - 30000).toISOString(),
            resolved: false
        }
    ])

    const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([
        {
            id: "1",
            url: "/api/events",
            method: "GET",
            status: 200,
            duration: 245,
            timestamp: new Date().toISOString(),
            response: { count: 25, data: [] }
        },
        {
            id: "2",
            url: "/api/promoters",
            method: "GET",
            status: 200,
            duration: 189,
            timestamp: new Date(Date.now() - 2000).toISOString(),
            response: { count: 12, data: [] }
        }
    ])

    const [isCapturing, setIsCapturing] = useState(false)
    const [filterLevel, setFilterLevel] = useState<string>("all")

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isCapturing) {
            interval = setInterval(() => {
                // Simulate new log entries
                const levels: ("info" | "warn" | "error" | "debug")[] = ["info", "warn", "error", "debug"]
                const sources = ["API", "Component", "Router", "Store", "Network"]
                const messages = [
                    "Component rendered",
                    "API call completed",
                    "State updated",
                    "Route changed",
                    "Memory warning",
                    "Network error",
                    "Authentication failed"
                ]

                const newLog: LogEntry = {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    level: levels[Math.floor(Math.random() * levels.length)],
                    message: messages[Math.floor(Math.random() * messages.length)],
                    source: sources[Math.floor(Math.random() * sources.length)]
                }

                setLogs(prev => [newLog, ...prev.slice(0, 99)]) // Keep last 100 logs
            }, 3000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isCapturing])

    const clearLogs = () => setLogs([])
    const clearErrors = () => setErrors([])
    const clearNetwork = () => setNetworkRequests([])

    const resolveError = (errorId: string) => {
        setErrors(prev => prev.map(error =>
            error.id === errorId ? { ...error, resolved: true } : error
        ))
    }

    const filteredLogs = filterLevel === "all"
        ? logs
        : logs.filter(log => log.level === filterLevel)

    const getLogLevelColor = (level: string) => {
        switch (level) {
            case "error": return "text-red-400"
            case "warn": return "text-yellow-400"
            case "info": return "text-blue-400"
            case "debug": return "text-gray-400"
            default: return "text-white"
        }
    }

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return "text-green-400"
        if (status >= 400) return "text-red-400"
        return "text-yellow-400"
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Debugging Tools Suite</h3>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsCapturing(!isCapturing)}
                            className={`${isCapturing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        >
                            {isCapturing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isCapturing ? 'Stop Capture' : 'Start Capture'}
                        </Button>
                        <Button onClick={clearLogs} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Clear All
                        </Button>
                    </div>
                </div>

                {isCapturing && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-blue-400 font-medium">Capturing debug information...</span>
                        </div>
                    </div>
                )}
            </Card>

            {/* Main Debugging Tabs */}
            <Tabs defaultValue="logs" className="space-y-4">
                <TabsList className="bg-white/5 border border-white/10 grid grid-cols-4 gap-2">
                    <TabsTrigger value="logs" className="data-[state=active]:bg-white/10 flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        Console Logs
                    </TabsTrigger>
                    <TabsTrigger value="errors" className="data-[state=active]:bg-white/10 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Error Boundaries
                    </TabsTrigger>
                    <TabsTrigger value="network" className="data-[state=active]:bg-white/10 flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        Network
                    </TabsTrigger>
                    <TabsTrigger value="state" className="data-[state=active]:bg-white/10 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        State Inspector
                    </TabsTrigger>
                </TabsList>

                {/* Console Logs */}
                <TabsContent value="logs">
                    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-white">Console Logs</h4>
                            <div className="flex gap-2">
                                <Select value={filterLevel} onValueChange={setFilterLevel}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="error">Errors</SelectItem>
                                        <SelectItem value="warn">Warnings</SelectItem>
                                        <SelectItem value="info">Info</SelectItem>
                                        <SelectItem value="debug">Debug</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={clearLogs} size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                    Clear
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                    <Badge variant="outline" className={`border-white/20 ${getLogLevelColor(log.level)} text-xs`}>
                                        {log.level.toUpperCase()}
                                    </Badge>
                                    <div className="flex-1">
                                        <div className="text-white text-sm">{log.message}</div>
                                        <div className="text-white/60 text-xs">
                                            {log.source} • {new Date(log.timestamp).toLocaleTimeString()}
                                        </div>
                                        {log.data && (
                                            <Textarea
                                                value={JSON.stringify(log.data, null, 2)}
                                                readOnly
                                                className="bg-black/20 border-white/10 text-white font-mono text-xs mt-2"
                                                rows={3}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>

                {/* Error Boundaries */}
                <TabsContent value="errors">
                    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-white">Error Boundaries</h4>
                            <Button onClick={clearErrors} size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                Clear Resolved
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {errors.map((error) => (
                                <div key={error.id} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5 text-red-400" />
                                            <span className="font-medium text-red-400">{error.component}</span>
                                            {!error.resolved && (
                                                <Badge variant="outline" className="border-red-500/20 text-red-400">
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                        {!error.resolved && (
                                            <Button
                                                size="sm"
                                                onClick={() => resolveError(error.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Resolve
                                            </Button>
                                        )}
                                    </div>

                                    <div className="text-red-300 text-sm mb-2">{error.error}</div>
                                    <div className="text-white/60 text-xs mb-2">
                                        {new Date(error.timestamp).toLocaleString()}
                                    </div>

                                    {error.stack && (
                                        <Textarea
                                            value={error.stack}
                                            readOnly
                                            className="bg-black/20 border-red-500/20 text-red-200 font-mono text-xs"
                                            rows={4}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>

                {/* Network Requests */}
                <TabsContent value="network">
                    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-white">Network Requests</h4>
                            <Button onClick={clearNetwork} size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                Clear
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {networkRequests.map((request) => (
                                <div key={request.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                                    <div className={`w-3 h-3 rounded-full ${request.status >= 200 && request.status < 300 ? "bg-green-500" :
                                            request.status >= 400 ? "bg-red-500" : "bg-yellow-500"
                                        }`} />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-white/20 text-white text-xs">
                                                {request.method}
                                            </Badge>
                                            <span className="text-white text-sm font-medium">{request.url}</span>
                                            <Badge variant="outline" className={`border-white/20 ${getStatusColor(request.status)} text-xs`}>
                                                {request.status}
                                            </Badge>
                                        </div>
                                        <div className="text-white/60 text-xs">
                                            {request.duration}ms • {new Date(request.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>

                                    {request.response && (
                                        <Textarea
                                            value={JSON.stringify(request.response, null, 2)}
                                            readOnly
                                            className="bg-black/20 border-white/10 text-white font-mono text-xs w-64"
                                            rows={2}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>

                {/* State Inspector */}
                <TabsContent value="state">
                    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                        <h4 className="font-semibold text-white mb-4">State Inspector</h4>

                        <Tabs defaultValue="store" className="space-y-4">
                            <TabsList className="bg-white/5 border border-white/10">
                                <TabsTrigger value="store" className="data-[state=active]:bg-white/10">Store State</TabsTrigger>
                                <TabsTrigger value="components" className="data-[state=active]:bg-white/10">Component State</TabsTrigger>
                                <TabsTrigger value="router" className="data-[state=active]:bg-white/10">Router State</TabsTrigger>
                            </TabsList>

                            <TabsContent value="store">
                                <Textarea
                                    placeholder="Application store state will appear here..."
                                    readOnly
                                    className="bg-black/20 border-white/10 text-white font-mono"
                                    rows={10}
                                />
                            </TabsContent>

                            <TabsContent value="components">
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <h5 className="font-medium text-white mb-2">Active Components</h5>
                                        <p className="text-white/60 text-sm">Component state inspection coming soon...</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="router">
                                <Textarea
                                    placeholder="Router state and navigation history..."
                                    readOnly
                                    className="bg-black/20 border-white/10 text-white font-mono"
                                    rows={8}
                                />
                            </TabsContent>
                        </Tabs>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}