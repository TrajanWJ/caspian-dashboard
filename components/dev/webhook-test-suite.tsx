"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
    Play,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    TrendingUp,
    Users,
    Zap,
    Database
} from "lucide-react"

interface TestScenario {
    id: string
    name: string
    description: string
    payload: any
    expectedStatus: number
    timeout: number
}

interface TestResult {
    scenarioId: string
    status: "running" | "success" | "error" | "timeout"
    responseTime: number
    statusCode: number
    error?: string
    timestamp: string
}

export function WebhookTestSuite({ onTestWebhook }: { onTestWebhook: (payload: any) => void }) {
    const [isRunning, setIsRunning] = useState(false)
    const [currentTest, setCurrentTest] = useState<string | null>(null)
    const [testResults, setTestResults] = useState<TestResult[]>([])
    const [progress, setProgress] = useState(0)
    const [volumeTestActive, setVolumeTestActive] = useState(false)
    const [volumeTestCount, setVolumeTestCount] = useState(10)
    const [volumeTestResults, setVolumeTestResults] = useState<TestResult[]>([])

    const testScenarios: TestScenario[] = [
        {
            id: "new_order_basic",
            name: "New Order - Basic",
            description: "Test basic new order webhook processing",
            payload: {
                type: "new_order",
                account_first_name: "Test",
                account_last_name: "Customer",
                account_email: "test@example.com",
                event_name: "Summer Music Festival 2025",
                event_id: "event-001",
                items: [{ item_id: "ticket-001", name: "General Admission", price: 45 }],
                subtotal: 45,
                total: 47.25,
                tracking_link: "PROMO001",
                order_number: `TEST-${Date.now()}`,
                date_purchased: new Date().toISOString(),
                cancelled: false,
                refunded: false,
                disputed: false
            },
            expectedStatus: 200,
            timeout: 5000
        },
        {
            id: "new_order_multiple_tickets",
            name: "New Order - Multiple Tickets",
            description: "Test new order with multiple ticket types",
            payload: {
                type: "new_order",
                account_first_name: "Test",
                account_last_name: "Customer",
                account_email: "test@example.com",
                event_name: "Summer Music Festival 2025",
                event_id: "event-001",
                items: [
                    { item_id: "ticket-001", name: "General Admission", price: 45 },
                    { item_id: "ticket-002", name: "VIP", price: 120 },
                    { item_id: "ticket-003", name: "Backstage Pass", price: 250 }
                ],
                subtotal: 415,
                total: 435.75,
                tracking_link: "PROMO001",
                order_number: `TEST-${Date.now()}`,
                date_purchased: new Date().toISOString(),
                cancelled: false,
                refunded: false,
                disputed: false
            },
            expectedStatus: 200,
            timeout: 5000
        },
        {
            id: "order_update",
            name: "Order Update",
            description: "Test order update webhook processing",
            payload: {
                type: "order_updated",
                account_first_name: "Test",
                account_last_name: "Customer",
                account_email: "test@example.com",
                event_name: "Summer Music Festival 2025",
                event_id: "event-001",
                items: [{ item_id: "ticket-001", name: "General Admission", price: 45 }],
                subtotal: 45,
                total: 47.25,
                tracking_link: "PROMO001",
                order_number: `TEST-${Date.now()}`,
                date_purchased: new Date().toISOString(),
                cancelled: false,
                refunded: false,
                disputed: false
            },
            expectedStatus: 200,
            timeout: 5000
        },
        {
            id: "cancelled_order",
            name: "Cancelled Order",
            description: "Test cancelled order webhook processing",
            payload: {
                type: "order_updated",
                account_first_name: "Test",
                account_last_name: "Customer",
                account_email: "test@example.com",
                event_name: "Summer Music Festival 2025",
                event_id: "event-001",
                items: [{ item_id: "ticket-001", name: "General Admission", price: 45 }],
                subtotal: 45,
                total: 47.25,
                tracking_link: "PROMO001",
                order_number: `TEST-${Date.now()}`,
                date_purchased: new Date().toISOString(),
                cancelled: true,
                refunded: false,
                disputed: false
            },
            expectedStatus: 200,
            timeout: 5000
        },
        {
            id: "refunded_order",
            name: "Refunded Order",
            description: "Test refunded order webhook processing",
            payload: {
                type: "order_updated",
                account_first_name: "Test",
                account_last_name: "Customer",
                account_email: "test@example.com",
                event_name: "Summer Music Festival 2025",
                event_id: "event-001",
                items: [{ item_id: "ticket-001", name: "General Admission", price: 45 }],
                subtotal: 45,
                total: 47.25,
                tracking_link: "PROMO001",
                order_number: `TEST-${Date.now()}`,
                date_purchased: new Date().toISOString(),
                cancelled: false,
                refunded: true,
                disputed: false
            },
            expectedStatus: 200,
            timeout: 5000
        },
        {
            id: "invalid_payload",
            name: "Invalid Payload",
            description: "Test webhook with invalid payload structure",
            payload: {
                type: "invalid_type",
                invalid_field: "test",
                missing_required: true
            },
            expectedStatus: 400,
            timeout: 3000
        }
    ]

    const runTestSuite = async () => {
        setIsRunning(true)
        setProgress(0)
        setTestResults([])
        setCurrentTest(null)

        for (let i = 0; i < testScenarios.length; i++) {
            const scenario = testScenarios[i]
            setCurrentTest(scenario.id)

            const startTime = Date.now()
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://caspian-dashboard.vercel.app"}/api/webhook/posh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Test-Mode": "true",
                        "X-Test-Scenario": scenario.id
                    },
                    body: JSON.stringify(scenario.payload)
                })

                const responseTime = Date.now() - startTime
                const result: TestResult = {
                    scenarioId: scenario.id,
                    status: response.ok ? "success" : "error",
                    responseTime,
                    statusCode: response.status,
                    timestamp: new Date().toISOString()
                }

                setTestResults(prev => [...prev, result])
                setProgress(((i + 1) / testScenarios.length) * 100)

                // Wait between tests
                await new Promise(resolve => setTimeout(resolve, 500))
            } catch (error) {
                const responseTime = Date.now() - startTime
                const result: TestResult = {
                    scenarioId: scenario.id,
                    status: "timeout",
                    responseTime,
                    statusCode: 0,
                    error: error instanceof Error ? error.message : "Unknown error",
                    timestamp: new Date().toISOString()
                }

                setTestResults(prev => [...prev, result])
                setProgress(((i + 1) / testScenarios.length) * 100)
            }
        }

        setIsRunning(false)
        setCurrentTest(null)
    }

    const runVolumeTest = async () => {
        setVolumeTestActive(true)
        setVolumeTestResults([])

        const basePayload = testScenarios[0].payload

        for (let i = 0; i < volumeTestCount; i++) {
            const startTime = Date.now()
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://caspian-dashboard.vercel.app"}/api/webhook/posh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Test-Mode": "true",
                        "X-Volume-Test": "true"
                    },
                    body: JSON.stringify({
                        ...basePayload,
                        order_number: `VOLUME-TEST-${i}-${Date.now()}`
                    })
                })

                const responseTime = Date.now() - startTime
                const result: TestResult = {
                    scenarioId: "volume_test",
                    status: response.ok ? "success" : "error",
                    responseTime,
                    statusCode: response.status,
                    timestamp: new Date().toISOString()
                }

                setVolumeTestResults(prev => [...prev, result])
            } catch (error) {
                const responseTime = Date.now() - startTime
                const result: TestResult = {
                    scenarioId: "volume_test",
                    status: "timeout",
                    responseTime,
                    statusCode: 0,
                    error: error instanceof Error ? error.message : "Unknown error",
                    timestamp: new Date().toISOString()
                }

                setVolumeTestResults(prev => [...prev, result])
            }

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100))
        }

        setVolumeTestActive(false)
    }

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

    const getSuccessRate = (results: TestResult[]) => {
        if (results.length === 0) return 0
        const successCount = results.filter(r => r.status === "success").length
        return (successCount / results.length) * 100
    }

    const getAverageResponseTime = (results: TestResult[]) => {
        if (results.length === 0) return 0
        const totalTime = results.reduce((sum, r) => sum + r.responseTime, 0)
        return totalTime / results.length
    }

    return (
        <div className="space-y-6">
            {/* Test Controls */}
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={runTestSuite}
                            disabled={isRunning}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Run Full Test Suite
                        </Button>
                        <Button
                            onClick={() => setIsRunning(false)}
                            disabled={!isRunning}
                            variant="outline"
                            className="border-white/20 text-white"
                        >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Stop Tests
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-white/60">
                            Progress: {Math.round(progress)}%
                        </div>
                        <Progress value={progress} className="w-40" />
                    </div>
                </div>
            </Card>

            {/* Volume Test Controls */}
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Input
                            type="number"
                            value={volumeTestCount}
                            onChange={(e) => setVolumeTestCount(parseInt(e.target.value))}
                            className="w-24 border-white/20 bg-white/5 text-white"
                            min="1"
                            max="1000"
                        />
                        <Button
                            onClick={runVolumeTest}
                            disabled={volumeTestActive}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                        >
                            <Zap className="mr-2 h-4 w-4" />
                            Run Volume Test ({volumeTestCount} requests)
                        </Button>
                    </div>

                    <div className="text-sm text-white/60">
                        Volume test: {volumeTestActive ? "Running..." : "Idle"}
                    </div>
                </div>
            </Card>

            {/* Test Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Individual Test Results */}
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Individual Test Results</h3>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-white/20 text-white">
                                {testResults.length} tests
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                {getSuccessRate(testResults).toFixed(1)}% success
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {testScenarios.map((scenario) => {
                            const result = testResults.find(r => r.scenarioId === scenario.id)
                            const isTestRunning = currentTest === scenario.id && isRunning

                            return (
                                <div key={scenario.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-3">
                                        {isRunning ? (
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-blue-400 rounded-full animate-spin" />
                                        ) : (
                                            getStatusIcon(result?.status || "pending")
                                        )}
                                        <div>
                                            <div className="font-medium text-white">{scenario.name}</div>
                                            <div className="text-xs text-white/60">{scenario.description}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {result && (
                                            <>
                                                <Badge variant="outline" className="border-white/20 text-white">
                                                    {result.responseTime}ms
                                                </Badge>
                                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                                    {result.statusCode}
                                                </Badge>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>

                {/* Volume Test Results */}
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Volume Test Results</h3>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-white/20 text-white">
                                {volumeTestResults.length} requests
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                {getSuccessRate(volumeTestResults).toFixed(1)}% success
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-2xl font-bold text-white">{getAverageResponseTime(volumeTestResults).toFixed(0)}ms</div>
                                <div className="text-sm text-white/60">Avg Response Time</div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-2xl font-bold text-white">{Math.max(...volumeTestResults.map(r => r.responseTime), 0)}ms</div>
                                <div className="text-sm text-white/60">Max Response Time</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Success</span>
                                <span className="text-green-400 font-mono">
                                    {volumeTestResults.filter(r => r.status === "success").length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Errors</span>
                                <span className="text-red-400 font-mono">
                                    {volumeTestResults.filter(r => r.status === "error").length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Timeouts</span>
                                <span className="text-yellow-400 font-mono">
                                    {volumeTestResults.filter(r => r.status === "timeout").length}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}