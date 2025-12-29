'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Activity,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    RefreshCw,
    Filter,
    Download
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface WebhookLog {
    id: string
    timestamp: Date
    method: string
    url: string
    status: number
    responseTime: number
    success: boolean
    payload: any
    response: any
    error?: string
}

const mockLogs: WebhookLog[] = [
    {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        method: 'POST',
        url: 'https://api.example.com/webhooks/order-created',
        status: 200,
        responseTime: 245,
        success: true,
        payload: { event: 'order.created', data: { id: 'ord_123' } },
        response: { received: true, processed: true }
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        method: 'POST',
        url: 'https://api.example.com/webhooks/payment-failed',
        status: 500,
        responseTime: 1200,
        success: false,
        payload: { event: 'payment.failed', data: { id: 'pay_456' } },
        response: null,
        error: 'Internal server error'
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
        method: 'GET',
        url: 'https://api.example.com/webhooks/status',
        status: 200,
        responseTime: 89,
        success: true,
        payload: null,
        response: { status: 'healthy', uptime: '99.9%' }
    }
]

export function WebhookMonitor() {
    const [logs, setLogs] = useState<WebhookLog[]>(mockLogs)
    const [isMonitoring, setIsMonitoring] = useState(true)
    const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all')
    const { toast } = useToast()

    // Simulate real-time updates
    useEffect(() => {
        if (!isMonitoring) return

        const interval = setInterval(() => {
            const newLog: WebhookLog = {
                id: Date.now().toString(),
                timestamp: new Date(),
                method: Math.random() > 0.5 ? 'POST' : 'GET',
                url: 'https://api.example.com/webhooks/' + (Math.random() > 0.5 ? 'order-created' : 'payment-succeeded'),
                status: Math.random() > 0.8 ? 500 : 200,
                responseTime: Math.floor(Math.random() * 1000) + 50,
                success: Math.random() > 0.8 ? false : true,
                payload: { event: 'test', data: { id: Math.random().toString(36).substr(2, 9) } },
                response: Math.random() > 0.8 ? null : { received: true },
                error: Math.random() > 0.8 ? 'Connection timeout' : undefined
            }

            setLogs(prev => [newLog, ...prev.slice(0, 49)]) // Keep last 50 logs
        }, 5000)

        return () => clearInterval(interval)
    }, [isMonitoring])

    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true
        if (filter === 'success') return log.success
        if (filter === 'error') return !log.success
        return true
    })

    const stats = {
        total: logs.length,
        success: logs.filter(l => l.success).length,
        error: logs.filter(l => !l.success).length,
        avgResponseTime: logs.reduce((acc, l) => acc + l.responseTime, 0) / logs.length
    }

    const handleExport = () => {
        const dataStr = JSON.stringify(filteredLogs, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

        const exportFileDefaultName = `webhook-logs-${new Date().toISOString().split('T')[0]}.json`

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()

        toast({
            title: 'Logs exported',
            description: 'Webhook logs have been downloaded as JSON.'
        })
    }

    const getStatusIcon = (log: WebhookLog) => {
        if (log.success) return <CheckCircle className="w-4 h-4 text-green-500" />
        return <XCircle className="w-4 h-4 text-red-500" />
    }

    const getStatusBadge = (status: number) => {
        if (status >= 200 && status < 300) return <Badge variant="default">2xx</Badge>
        if (status >= 300 && status < 400) return <Badge variant="secondary">3xx</Badge>
        if (status >= 400 && status < 500) return <Badge variant="destructive">4xx</Badge>
        return <Badge variant="destructive">5xx</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Webhook Monitor</h2>
                    <p className="text-muted-foreground">
                        Real-time monitoring of webhook deliveries and responses
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={isMonitoring ? "default" : "outline"}
                        onClick={() => setIsMonitoring(!isMonitoring)}
                    >
                        <Activity className="w-4 h-4 mr-2" />
                        {isMonitoring ? 'Stop' : 'Start'} Monitoring
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">Total Requests</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <div>
                                <p className="text-sm font-medium">Successful</p>
                                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <div>
                                <p className="text-sm font-medium">Failed</p>
                                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <div>
                                <p className="text-sm font-medium">Avg Response</p>
                                <p className="text-2xl font-bold">{Math.round(stats.avgResponseTime)}ms</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Logs */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest webhook deliveries and their status
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setLogs([])}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
                        <TabsList>
                            <TabsTrigger value="all">All ({logs.length})</TabsTrigger>
                            <TabsTrigger value="success">Success ({stats.success})</TabsTrigger>
                            <TabsTrigger value="error">Errors ({stats.error})</TabsTrigger>
                        </TabsList>

                        <TabsContent value={filter} className="mt-4">
                            <ScrollArea className="h-96">
                                <div className="space-y-2">
                                    {filteredLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            {getStatusIcon(log)}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline">{log.method}</Badge>
                                                    {getStatusBadge(log.status)}
                                                    <span className="text-sm text-muted-foreground">
                                                        {log.responseTime}ms
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium truncate">{log.url}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {log.timestamp.toLocaleString()}
                                                </p>
                                                {log.error && (
                                                    <Alert className="mt-2">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <AlertDescription className="text-xs">
                                                            {log.error}
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {filteredLogs.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No logs found for the selected filter.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}