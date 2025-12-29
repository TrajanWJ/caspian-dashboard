"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Send,
    Play,
    RotateCcw,
    CheckCircle,
    XCircle,
    Clock,
    Zap,
    Globe,
    Server,
    Database,
    Webhook
} from "lucide-react"

interface ApiTest {
    id: string
    name: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    endpoint: string
    status: 'success' | 'error' | 'pending' | 'running'
    responseTime?: number
    statusCode?: number
    response?: any
    error?: string
}

const mockApiTests: ApiTest[] = [
    {
        id: "webhook-test",
        name: "Test Webhook Endpoint",
        method: "POST",
        endpoint: "/api/test-webhook",
        status: "success",
        responseTime: 245,
        statusCode: 200,
        response: { success: true, message: "Webhook received" }
    },
    {
        id: "posh-webhook",
        name: "Posh Webhook Relay",
        method: "POST",
        endpoint: "/api/webhook/posh",
        status: "success",
        responseTime: 189,
        statusCode: 200,
        response: { processed: true, orderId: "12345" }
    },
    {
        id: "events-list",
        name: "Get Events List",
        method: "GET",
        endpoint: "/api/events",
        status: "error",
        responseTime: 1200,
        statusCode: 500,
        error: "Internal server error"
    },
    {
        id: "promoters-data",
        name: "Promoters Data",
        method: "GET",
        endpoint: "/api/promoters",
        status: "pending"
    }
]

export function ApiTestingSuite() {
    const [selectedTest, setSelectedTest] = useState<ApiTest | null>(null)
    const [customEndpoint, setCustomEndpoint] = useState("")
    const [customMethod, setCustomMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET')
    const [customBody, setCustomBody] = useState("")
    const [isRunning, setIsRunning] = useState(false)

    const getStatusIcon = (status: ApiTest['status']) => {
        switch (status) {
            case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'error': return <XCircle className="h-4 w-4 text-red-500" />
            case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
            default: return <div className="h-4 w-4 rounded-full bg-gray-500" />
        }
    }

    const getStatusColor = (status: ApiTest['status']) => {
        switch (status) {
            case 'success': return 'bg-green-500/10 text-green-400 border-green-500/20'
            case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20'
            case 'running': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }

    const runAllTests = async () => {
        setIsRunning(true)
        // Simulate running all API tests
        await new Promise(resolve => setTimeout(resolve, 3000))
        setIsRunning(false)
    }

    const runCustomTest = async () => {
        if (!customEndpoint) return

        setIsRunning(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsRunning(false)
    }

    const runSingleTest = async (testId: string) => {
        // Simulate running single test
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return (
        <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Server className="h-5 w-5" />
                        API Testing Suite
                    </CardTitle>
                    <CardDescription className="text-white/60">
                        Test and validate all API endpoints with comprehensive request/response monitoring
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <Button
                            onClick={runAllTests}
                            disabled={isRunning}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            {isRunning ? "Running Tests..." : "Run All Tests"}
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Results
                        </Button>
                    </div>

                    <Tabs defaultValue="tests" className="space-y-4">
                        <TabsList className="bg-white/5 border border-white/10">
                            <TabsTrigger value="tests" className="data-[state=active]:bg-white/10">API Tests</TabsTrigger>
                            <TabsTrigger value="custom" className="data-[state=active]:bg-white/10">Custom Request</TabsTrigger>
                            <TabsTrigger value="history" className="data-[state=active]:bg-white/10">Request History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="tests" className="space-y-4">
                            <div className="grid gap-3">
                                {mockApiTests.map((test) => (
                                    <Card key={test.id} className="border-white/10 bg-white/5 backdrop-blur">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(test.status)}
                                                    <div>
                                                        <p className="font-medium text-white">{test.name}</p>
                                                        <p className="text-sm text-white/60">
                                                            {test.method} {test.endpoint}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {test.responseTime && (
                                                        <Badge variant="outline" className="border-white/20 text-white/60">
                                                            <Zap className="mr-1 h-3 w-3" />
                                                            {test.responseTime}ms
                                                        </Badge>
                                                    )}
                                                    {test.statusCode && (
                                                        <Badge className={getStatusColor(test.status)}>
                                                            {test.statusCode}
                                                        </Badge>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => runSingleTest(test.id)}
                                                        disabled={test.status === 'running'}
                                                    >
                                                        <Play className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {test.error && (
                                                <Alert className="mt-3 border-red-500/20 bg-red-500/10">
                                                    <XCircle className="h-4 w-4" />
                                                    <AlertDescription className="text-red-400">
                                                        {test.error}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="custom" className="space-y-4">
                            <Card className="border-white/10 bg-white/5 backdrop-blur">
                                <CardHeader>
                                    <CardTitle className="text-white">Custom API Request</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-4 gap-4">
                                        <Select value={customMethod} onValueChange={(value: any) => setCustomMethod(value)}>
                                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="GET">GET</SelectItem>
                                                <SelectItem value="POST">POST</SelectItem>
                                                <SelectItem value="PUT">PUT</SelectItem>
                                                <SelectItem value="DELETE">DELETE</SelectItem>
                                                <SelectItem value="PATCH">PATCH</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="Enter endpoint URL"
                                            value={customEndpoint}
                                            onChange={(e) => setCustomEndpoint(e.target.value)}
                                            className="col-span-3 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                                        />
                                    </div>
                                    {(customMethod === 'POST' || customMethod === 'PUT' || customMethod === 'PATCH') && (
                                        <Textarea
                                            placeholder="Request body (JSON)"
                                            value={customBody}
                                            onChange={(e) => setCustomBody(e.target.value)}
                                            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                                        />
                                    )}
                                    <Button
                                        onClick={runCustomTest}
                                        disabled={isRunning || !customEndpoint}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        {isRunning ? "Sending..." : "Send Request"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history">
                            <Card className="border-white/10 bg-white/5 backdrop-blur">
                                <CardHeader>
                                    <CardTitle className="text-white">Request History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[
                                            { time: "10:30:15", method: "POST", endpoint: "/api/test-webhook", status: 200 },
                                            { time: "10:29:42", method: "GET", endpoint: "/api/events", status: 500 },
                                            { time: "10:28:33", method: "POST", endpoint: "/api/webhook/posh", status: 200 },
                                        ].map((req, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    <Globe className="h-4 w-4 text-white/60" />
                                                    <div>
                                                        <p className="text-white">{req.method} {req.endpoint}</p>
                                                        <p className="text-sm text-white/60">{req.time}</p>
                                                    </div>
                                                </div>
                                                <Badge className={req.status === 200 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}>
                                                    {req.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Test Details Modal */}
                    {selectedTest && (
                        <div className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">{selectedTest.name}</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedTest(null)}
                                >
                                    ×
                                </Button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-white/60">Method:</span>
                                    <Badge variant="outline" className="border-white/20 text-white">
                                        {selectedTest.method}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white/60">Endpoint:</span>
                                    <code className="text-white bg-white/10 px-2 py-1 rounded">
                                        {selectedTest.endpoint}
                                    </code>
                                </div>
                                {selectedTest.responseTime && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/60">Response Time:</span>
                                        <span className="text-white">{selectedTest.responseTime}ms</span>
                                    </div>
                                )}
                                {selectedTest.response && (
                                    <div>
                                        <span className="text-white/60">Response:</span>
                                        <pre className="mt-2 p-3 bg-white/10 rounded text-white text-sm overflow-x-auto">
                                            {JSON.stringify(selectedTest.response, null, 2)}
                                        </pre>
                                    </div>
                                )}
                                {selectedTest.error && (
                                    <Alert className="border-red-500/20 bg-red-500/10">
                                        <XCircle className="h-4 w-4" />
                                        <AlertDescription className="text-red-400">
                                            {selectedTest.error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}