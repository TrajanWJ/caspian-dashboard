"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Play,
    RefreshCw,
    Monitor,
    Code,
    Database,
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    Activity,
    Settings
} from "lucide-react"
import { WebhookPayloadBuilder } from "./webhook-payload-builder"
import { WebhookMonitor } from "./webhook-monitor"
import { WebhookTestSuite } from "./webhook-test-suite"
import { WebhookAnalytics } from "./webhook-analytics"

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

interface WebhookAnalyticsData {
    totalRequests: number
    successRate: number
    averageResponseTime: number
    errorRate: number
    recentActivity: WebhookTestResult[]
}

export function WebhookSimulationDashboard() {
    const [isMonitoring, setIsMonitoring] = useState(false)
    const [testResults, setTestResults] = useState<WebhookTestResult[]>([])
    const [analytics, setAnalytics] = useState<WebhookAnalyticsData>({
        totalRequests: 0,
        successRate: 0,
        averageResponseTime: 0,
        errorRate: 0,
        recentActivity: []
    })
    const [activeTab, setActiveTab] = useState("monitor")

    // Simulate webhook endpoint URL
    const webhookEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL || "https://caspian-dashboard.vercel.app"}/api/webhook/posh`

    const handleTestWebhook = async (payload: any) => {
        const startTime = Date.now()
        const testId = `test-${Date.now()}`

        try {
            const response = await fetch(webhookEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Test-Mode": "true",
                    "X-Test-Id": testId
                },
                body: JSON.stringify(payload)
            })

            const responseTime = Date.now() - startTime
            const responseData = await response.text()

            const result: WebhookTestResult = {
                id: testId,
                timestamp: new Date().toISOString(),
                status: response.ok ? "success" : "error",
                statusCode: response.status,
                responseTime,
                payload,
                response: responseData
            }

            setTestResults(prev => [result, ...prev])
            updateAnalytics(result)
        } catch (error) {
            const responseTime = Date.now() - startTime
            const result: WebhookTestResult = {
                id: testId,
                timestamp: new Date().toISOString(),
                status: "timeout",
                statusCode: 0,
                responseTime,
                payload,
                error: error instanceof Error ? error.message : "Unknown error"
            }

            setTestResults(prev => [result, ...prev])
            updateAnalytics(result)
        }
    }

    const updateAnalytics = (result: WebhookTestResult) => {
        setAnalytics(prev => {
            const newResults = [result, ...prev.recentActivity].slice(0, 100)
            const totalRequests = prev.totalRequests + 1
            const successCount = newResults.filter(r => r.status === "success").length
            const errorCount = newResults.filter(r => r.status === "error" || r.status === "timeout").length
            const totalResponseTime = newResults.reduce((sum, r) => sum + r.responseTime, 0)

            return {
                ...prev,
                totalRequests,
                successRate: totalRequests > 0 ? (successCount / totalRequests) * 100 : 0,
                errorRate: totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0,
                averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
                recentActivity: newResults
            }
        })
    }

    const runAutomatedTests = async () => {
        const testScenarios = [
            {
                name: "New Order",
                payload: {
                    type: "new_order",
                    account_first_name: "Test",
                    account_last_name: "Customer",
                    account_email: "test@example.com",
                    event_name: "Test Event",
                    event_id: "test-event-001",
                    items: [{ item_id: "ticket-001", name: "General Admission", price: 50 }],
                    subtotal: 50,
                    total: 52.5,
                    tracking_link: "PROMO001",
                    order_number: `TEST-${Date.now()}`,
                    date_purchased: new Date().toISOString(),
                    cancelled: false,
                    refunded: false,
                    disputed: false
                }
            },
            {
                name: "Order Update",
                payload: {
                    type: "order_updated",
                    account_first_name: "Test",
                    account_last_name: "Customer",
                    account_email: "test@example.com",
                    event_name: "Test Event",
                    event_id: "test-event-001",
                    items: [{ item_id: "ticket-001", name: "General Admission", price: 50 }],
                    subtotal: 50,
                    total: 52.5,
                    tracking_link: "PROMO001",
                    order_number: `TEST-${Date.now()}`,
                    date_purchased: new Date().toISOString(),
                    cancelled: false,
                    refunded: false,
                    disputed: false
                }
            },
            {
                name: "Cancelled Order",
                payload: {
                    type: "order_updated",
                    account_first_name: "Test",
                    account_last_name: "Customer",
                    account_email: "test@example.com",
                    event_name: "Test Event",
                    event_id: "test-event-001",
                    items: [{ item_id: "ticket-001", name: "General Admission", price: 50 }],
                    subtotal: 50,
                    total: 52.5,
                    tracking_link: "PROMO001",
                    order_number: `TEST-${Date.now()}`,
                    date_purchased: new Date().toISOString(),
                    cancelled: true,
                    refunded: false,
                    disputed: false
                }
            }
        ]

        for (const scenario of testScenarios) {
            await handleTestWebhook(scenario.payload)
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between tests
        }
    }

    const clearResults = () => {
        setTestResults([])
        setAnalytics({
            totalRequests: 0,
            successRate: 0,
            averageResponseTime: 0,
            errorRate: 0,
            recentActivity: []
        })
    }

    return (
        <div className="space-y-8">
            {/* Header with Analytics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-white/60">Total Requests</div>
                            <div className="text-2xl font-bold text-white">{analytics.totalRequests}</div>
                        </div>
                        <Activity className="h-8 w-8 text-blue-400" />
                    </div>
                </Card>

                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-white/60">Success Rate</div>
                            <div className="text-2xl font-bold text-green-400">{analytics.successRate.toFixed(1)}%</div>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                </Card>

                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-white/60">Avg Response Time</div>
                            <div className="text-2xl font-bold text-white">{analytics.averageResponseTime.toFixed(0)}ms</div>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-400" />
                    </div>
                </Card>

                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-white/60">Error Rate</div>
                            <div className="text-2xl font-bold text-red-400">{analytics.errorRate.toFixed(1)}%</div>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                </Card>
            </div>

            {/* Controls */}
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={runAutomatedTests}
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Run Test Suite
                        </Button>
                        <Button
                            onClick={clearResults}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Clear Results
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-white/60">
                            Endpoint: <code className="bg-white/10 px-2 py-1 rounded">{webhookEndpoint}</code>
                        </div>
                        <Badge variant="outline" className="border-white/20 text-white">
                            {isMonitoring ? "Monitoring Active" : "Monitoring Inactive"}
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="monitor" className="data-[state=active]:bg-white/10">
                        <Monitor className="mr-2 h-4 w-4" />
                        Live Monitor
                    </TabsTrigger>
                    <TabsTrigger value="payload" className="data-[state=active]:bg-white/10">
                        <Code className="mr-2 h-4 w-4" />
                        Payload Builder
                    </TabsTrigger>
                    <TabsTrigger value="test-suite" className="data-[state=active]:bg-white/10">
                        <Database className="mr-2 h-4 w-4" />
                        Test Suite
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="monitor">
                    <WebhookMonitor
                        testResults={testResults}
                        onTestWebhook={handleTestWebhook}
                    />
                </TabsContent>

                <TabsContent value="payload">
                    <WebhookPayloadBuilder onTestWebhook={handleTestWebhook} />
                </TabsContent>

                <TabsContent value="test-suite">
                    <WebhookTestSuite onTestWebhook={handleTestWebhook} />
                </TabsContent>

                <TabsContent value="analytics">
                    <WebhookAnalytics analytics={analytics} testResults={testResults} />
                </TabsContent>
            </Tabs>
        </div>
    )
}