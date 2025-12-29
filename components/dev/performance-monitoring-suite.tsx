'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Activity,
    Cpu,
    HardDrive,
    MemoryStick,
    Zap,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Clock,
    BarChart3,
    Gauge,
    Thermometer,
    Wifi,
    Database
} from "lucide-react"

interface PerformanceMetric {
    name: string
    value: number
    unit: string
    status: 'good' | 'warning' | 'critical'
    trend: 'up' | 'down' | 'stable'
    threshold: {
        warning: number
        critical: number
    }
}

interface SystemLoad {
    timestamp: Date
    cpu: number
    memory: number
    disk: number
    network: number
}

const mockMetrics: PerformanceMetric[] = [
    {
        name: 'CPU Usage',
        value: 45,
        unit: '%',
        status: 'good',
        trend: 'stable',
        threshold: { warning: 70, critical: 90 }
    },
    {
        name: 'Memory Usage',
        value: 62,
        unit: '%',
        status: 'warning',
        trend: 'up',
        threshold: { warning: 75, critical: 90 }
    },
    {
        name: 'Disk Usage',
        value: 78,
        unit: '%',
        status: 'warning',
        trend: 'up',
        threshold: { warning: 80, critical: 95 }
    },
    {
        name: 'Network Latency',
        value: 23,
        unit: 'ms',
        status: 'good',
        trend: 'down',
        threshold: { warning: 100, critical: 500 }
    },
    {
        name: 'Response Time',
        value: 145,
        unit: 'ms',
        status: 'good',
        trend: 'stable',
        threshold: { warning: 200, critical: 1000 }
    },
    {
        name: 'Error Rate',
        value: 0.2,
        unit: '%',
        status: 'good',
        trend: 'down',
        threshold: { warning: 1, critical: 5 }
    }
]

const mockLoadHistory: SystemLoad[] = Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(Date.now() - (19 - i) * 60000),
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    disk: Math.random() * 100,
    network: Math.random() * 100
}))

export function PerformanceMonitoringSuite() {
    const [metrics, setMetrics] = useState<PerformanceMetric[]>(mockMetrics)
    const [loadHistory, setLoadHistory] = useState<SystemLoad[]>(mockLoadHistory)
    const [isMonitoring, setIsMonitoring] = useState(false)
    const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '5m' | '15m' | '1h'>('5m')
    const [alerts, setAlerts] = useState<string[]>([])

    useEffect(() => {
        if (isMonitoring) {
            const interval = setInterval(() => {
                // Simulate real-time updates
                setMetrics(prev => prev.map(metric => ({
                    ...metric,
                    value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10)),
                    trend: Math.random() > 0.5 ? 'up' : 'down'
                })))

                setLoadHistory(prev => {
                    const newEntry: SystemLoad = {
                        timestamp: new Date(),
                        cpu: Math.random() * 100,
                        memory: Math.random() * 100,
                        disk: Math.random() * 100,
                        network: Math.random() * 100
                    }
                    return [...prev.slice(-19), newEntry]
                })

                // Check for alerts
                const newAlerts: string[] = []
                metrics.forEach(metric => {
                    if (metric.value >= metric.threshold.critical) {
                        newAlerts.push(`Critical: ${metric.name} at ${metric.value}${metric.unit}`)
                    } else if (metric.value >= metric.threshold.warning) {
                        newAlerts.push(`Warning: ${metric.name} at ${metric.value}${metric.unit}`)
                    }
                })
                setAlerts(newAlerts)
            }, 5000)

            return () => clearInterval(interval)
        }
    }, [isMonitoring, metrics])

    const getStatusColor = (status: PerformanceMetric['status']) => {
        switch (status) {
            case 'good': return 'text-green-400'
            case 'warning': return 'text-yellow-400'
            case 'critical': return 'text-red-400'
        }
    }

    const getStatusIcon = (status: PerformanceMetric['status']) => {
        switch (status) {
            case 'good': return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />
            case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />
        }
    }

    const getTrendIcon = (trend: PerformanceMetric['trend']) => {
        switch (trend) {
            case 'up': return <TrendingUp className="h-4 w-4 text-red-400" />
            case 'down': return <TrendingDown className="h-4 w-4 text-green-400" />
            case 'stable': return <div className="h-4 w-4 border-t-2 border-gray-400" />
        }
    }

    const getProgressColor = (value: number, threshold: PerformanceMetric['threshold']) => {
        if (value >= threshold.critical) return 'bg-red-500'
        if (value >= threshold.warning) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const systemHealth = {
        overall: metrics.every(m => m.status === 'good') ? 'healthy' :
            metrics.some(m => m.status === 'critical') ? 'critical' : 'warning',
        uptime: '99.9%',
        avgResponseTime: '145ms',
        totalRequests: '12,847'
    }

    return (
        <div className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Activity className={`h-5 w-5 ${systemHealth.overall === 'healthy' ? 'text-green-400' :
                                    systemHealth.overall === 'warning' ? 'text-yellow-400' : 'text-red-400'
                                }`} />
                            <div>
                                <p className="text-lg font-bold text-white capitalize">{systemHealth.overall}</p>
                                <p className="text-sm text-white/60">System Status</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{systemHealth.uptime}</p>
                                <p className="text-sm text-white/60">Uptime</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-purple-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{systemHealth.avgResponseTime}</p>
                                <p className="text-sm text-white/60">Avg Response</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-green-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{systemHealth.totalRequests}</p>
                                <p className="text-sm text-white/60">Total Requests</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Control Panel */}
            <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-white">Performance Monitoring</CardTitle>
                    <CardDescription className="text-white/60">
                        Real-time system performance metrics and monitoring
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setIsMonitoring(!isMonitoring)}
                            className={isMonitoring
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }
                        >
                            {isMonitoring ? (
                                <>
                                    <div className="animate-pulse mr-2 h-2 w-2 bg-white rounded-full" />
                                    Stop Monitoring
                                </>
                            ) : (
                                <>
                                    <Activity className="mr-2 h-4 w-4" />
                                    Start Monitoring
                                </>
                            )}
                        </Button>

                        <div className="flex gap-2">
                            {(['1m', '5m', '15m', '1h'] as const).map(timeframe => (
                                <Button
                                    key={timeframe}
                                    variant={selectedTimeframe === timeframe ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedTimeframe(timeframe)}
                                    className={selectedTimeframe === timeframe
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "border-white/20 text-white hover:bg-white/10"
                                    }
                                >
                                    {timeframe}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Alerts */}
            {alerts.length > 0 && (
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-200">
                        <strong>Performance Alerts:</strong> {alerts.join(', ')}
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="metrics" className="data-[state=active]:bg-white/10">System Metrics</TabsTrigger>
                    <TabsTrigger value="charts" className="data-[state=active]:bg-white/10">Performance Charts</TabsTrigger>
                    <TabsTrigger value="logs" className="data-[state=active]:bg-white/10">Performance Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {metrics.map((metric, index) => (
                            <Card key={index} className="border-white/10 bg-white/5 backdrop-blur">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(metric.status)}
                                            <span className="text-sm font-medium text-white">{metric.name}</span>
                                        </div>
                                        {getTrendIcon(metric.trend)}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-white">
                                                {metric.value.toFixed(1)}{metric.unit}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={`border-current ${getStatusColor(metric.status)}`}
                                            >
                                                {metric.status}
                                            </Badge>
                                        </div>

                                        <Progress
                                            value={metric.value}
                                            className="h-2 bg-white/10"
                                        // style={{ '--progress-background': getProgressColor(metric.value, metric.threshold) } as any}
                                        />

                                        <div className="flex justify-between text-xs text-white/40">
                                            <span>Warning: {metric.threshold.warning}{metric.unit}</span>
                                            <span>Critical: {metric.threshold.critical}{metric.unit}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="charts" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Cpu className="h-5 w-5" />
                                    CPU Usage Over Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] flex items-end justify-between gap-1">
                                    {loadHistory.slice(-10).map((load, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1">
                                            <div
                                                className="w-6 bg-blue-500 rounded-t"
                                                style={{ height: `${load.cpu * 2}px` }}
                                            />
                                            <span className="text-xs text-white/40">
                                                {load.timestamp.getMinutes()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MemoryStick className="h-5 w-5" />
                                    Memory Usage Over Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] flex items-end justify-between gap-1">
                                    {loadHistory.slice(-10).map((load, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1">
                                            <div
                                                className="w-6 bg-green-500 rounded-t"
                                                style={{ height: `${load.memory * 2}px` }}
                                            />
                                            <span className="text-xs text-white/40">
                                                {load.timestamp.getMinutes()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <HardDrive className="h-5 w-5" />
                                    Disk Usage Over Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] flex items-end justify-between gap-1">
                                    {loadHistory.slice(-10).map((load, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1">
                                            <div
                                                className="w-6 bg-yellow-500 rounded-t"
                                                style={{ height: `${load.disk * 2}px` }}
                                            />
                                            <span className="text-xs text-white/40">
                                                {load.timestamp.getMinutes()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Wifi className="h-5 w-5" />
                                    Network Activity Over Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] flex items-end justify-between gap-1">
                                    {loadHistory.slice(-10).map((load, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1">
                                            <div
                                                className="w-6 bg-purple-500 rounded-t"
                                                style={{ height: `${load.network * 2}px` }}
                                            />
                                            <span className="text-xs text-white/40">
                                                {load.timestamp.getMinutes()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="logs" className="mt-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-white">Performance Logs</CardTitle>
                            <CardDescription className="text-white/60">
                                Recent performance events and system logs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full">
                                <div className="space-y-2">
                                    {Array.from({ length: 50 }, (_, i) => {
                                        const timestamp = new Date(Date.now() - i * 30000)
                                        const events = [
                                            'CPU usage spike detected',
                                            'Memory cleanup completed',
                                            'Network latency increased',
                                            'Database query optimized',
                                            'Cache hit rate improved',
                                            'Error rate decreased',
                                            'Response time stabilized'
                                        ]
                                        const event = events[Math.floor(Math.random() * events.length)]
                                        const level = Math.random() > 0.8 ? 'error' : Math.random() > 0.6 ? 'warning' : 'info'

                                        return (
                                            <div key={i} className="flex items-center gap-3 p-2 border-b border-white/5">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${level === 'error' ? 'border-red-500/30 text-red-400' :
                                                            level === 'warning' ? 'border-yellow-500/30 text-yellow-400' :
                                                                'border-blue-500/30 text-blue-400'
                                                        }`}
                                                >
                                                    {level.toUpperCase()}
                                                </Badge>
                                                <span className="text-sm text-white/60 flex-1">{event}</span>
                                                <span className="text-xs text-white/40">
                                                    {timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}