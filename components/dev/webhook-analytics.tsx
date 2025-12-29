"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Database,
    Activity
} from "lucide-react"

interface WebhookAnalyticsData {
    totalRequests: number
    successRate: number
    averageResponseTime: number
    errorRate: number
    recentActivity: any[]
}

interface WebhookAnalyticsProps {
    analytics: WebhookAnalyticsData
    testResults: any[]
}

export function WebhookAnalytics({ analytics, testResults }: WebhookAnalyticsProps) {
    const analyticsSummary = useMemo(() => {
        const successCount = testResults.filter(r => r.status === "success").length
        const errorCount = testResults.filter(r => r.status === "error").length
        const timeoutCount = testResults.filter(r => r.status === "timeout").length

        const responseTimes = testResults.map(r => r.responseTime).filter(t => t > 0)
        const avgResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
            : 0

        const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0
        const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0

        // Calculate trends (last 10 vs previous 10)
        const recent10 = testResults.slice(0, 10)
        const previous10 = testResults.slice(10, 20)

        const recentSuccessRate = recent10.length > 0
            ? (recent10.filter(r => r.status === "success").length / recent10.length) * 100
            : 0
        const previousSuccessRate = previous10.length > 0
            ? (previous10.filter(r => r.status === "success").length / previous10.length) * 100
            : 0

        const recentAvgTime = recent10.length > 0
            ? recent10.reduce((sum, r) => sum + r.responseTime, 0) / recent10.length
            : 0
        const previousAvgTime = previous10.length > 0
            ? previous10.reduce((sum, r) => sum + r.responseTime, 0) / previous10.length
            : 0

        return {
            successCount,
            errorCount,
            timeoutCount,
            avgResponseTime,
            minResponseTime,
            maxResponseTime,
            recentSuccessRate,
            previousSuccessRate,
            recentAvgTime,
            previousAvgTime
        }
    }, [testResults])

    const getTrendIcon = (current: number, previous: number) => {
        if (current > previous) return <TrendingUp className="h-4 w-4 text-green-400" />
        if (current < previous) return <TrendingDown className="h-4 w-4 text-red-400" />
        return <Clock className="h-4 w-4 text-white/60" />
    }

    const getTrendColor = (current: number, previous: number) => {
        if (current > previous) return "text-green-400"
        if (current < previous) return "text-red-400"
        return "text-white/60"
    }

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                        <XCircle className="h-8 w-8 text-red-400" />
                    </div>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Response Time Analysis */}
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Response Time Analysis</h3>
                        <Clock className="h-5 w-5 text-yellow-400" />
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-2xl font-bold text-white">{analyticsSummary.minResponseTime.toFixed(0)}ms</div>
                                <div className="text-sm text-white/60">Min</div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-2xl font-bold text-white">{analyticsSummary.avgResponseTime.toFixed(0)}ms</div>
                                <div className="text-sm text-white/60">Avg</div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-2xl font-bold text-white">{analyticsSummary.maxResponseTime.toFixed(0)}ms</div>
                                <div className="text-sm text-white/60">Max</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-white/60">
                            <span>Performance Trend</span>
                            {getTrendIcon(analyticsSummary.recentAvgTime, analyticsSummary.previousAvgTime)}
                        </div>
                    </div>
                </Card>

                {/* Status Distribution */}
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Status Distribution</h3>
                        <Database className="h-5 w-5 text-blue-400" />
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                                <div className="text-2xl font-bold text-green-400">{analyticsSummary.successCount}</div>
                                <div className="text-sm text-green-400">Success</div>
                            </div>
                            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                                <div className="text-2xl font-bold text-red-400">{analyticsSummary.errorCount}</div>
                                <div className="text-sm text-red-400">Errors</div>
                            </div>
                            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                                <div className="text-2xl font-bold text-yellow-400">{analyticsSummary.timeoutCount}</div>
                                <div className="text-sm text-yellow-400">Timeouts</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-white/60">
                            <span>Success Trend</span>
                            {getTrendIcon(analyticsSummary.recentSuccessRate, analyticsSummary.previousSuccessRate)}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Performance Insights */}
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Performance Insights</h3>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                {analyticsSummary.recentSuccessRate > analyticsSummary.previousSuccessRate ? "Improving" : "Declining"}
                            </Badge>
                            <span className={`text-sm ${getTrendColor(analyticsSummary.recentSuccessRate, analyticsSummary.previousSuccessRate)}`}>
                                Success rate trend
                            </span>
                        </div>
                        <div className="text-xs text-white/60">
                            Recent: {analyticsSummary.recentSuccessRate.toFixed(1)}% vs Previous: {analyticsSummary.previousSuccessRate.toFixed(1)}%
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                {analyticsSummary.recentAvgTime < analyticsSummary.previousAvgTime ? "Faster" : "Slower"}
                            </Badge>
                            <span className={`text-sm ${getTrendColor(analyticsSummary.previousAvgTime, analyticsSummary.recentAvgTime)}`}>
                                Response time trend
                            </span>
                        </div>
                        <div className="text-xs text-white/60">
                            Recent: {analyticsSummary.recentAvgTime.toFixed(0)}ms vs Previous: {analyticsSummary.previousAvgTime.toFixed(0)}ms
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                {testResults.length > 0 ? "Active" : "No Data"}
                            </Badge>
                            <span className="text-sm text-white/60">Monitoring status</span>
                        </div>
                        <div className="text-xs text-white/60">
                            {testResults.length} total requests processed
                        </div>
                    </div>
                </div>
            </Card>

            {/* Recommendations */}
            {analyticsSummary.errorCount > 0 && (
                <Card className="border-red-500/30 bg-red-500/10 p-6 backdrop-blur">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-red-400">Error Analysis</h3>
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-white/60 mb-2">Error Rate</div>
                            <div className="text-2xl font-bold text-red-400">
                                {((analyticsSummary.errorCount / testResults.length) * 100).toFixed(1)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-white/60 mb-2">Common Issues</div>
                            <ul className="text-sm text-white/60 space-y-1">
                                <li>• Check webhook endpoint availability</li>
                                <li>• Verify payload format and validation</li>
                                <li>• Monitor server response times</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}