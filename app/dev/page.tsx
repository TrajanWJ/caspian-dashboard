import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Activity,
    Code,
    Database,
    Users,
    Settings,
    Monitor,
    TestTube,
    BarChart3,
    Bug,
    Cpu,
    Globe,
    Zap
} from "lucide-react"
import { SystemStatusDashboard } from "@/components/dev/system-status-dashboard"
import { ComponentTestingSuite } from "@/components/dev/component-testing-suite"
import { ApiTestingSuite } from "@/components/dev/api-testing-suite"
import { UserFlowTestingSuite } from "@/components/dev/user-flow-testing-suite"
import { DataManagementSuite } from "@/components/dev/data-management-suite"
import { PerformanceMonitoringSuite } from "@/components/dev/performance-monitoring-suite"
import { DebuggingToolsSuite } from "@/components/dev/debugging-tools-suite"
import { WebhookSimulationDashboard } from "@/components/dev/webhook-simulation-dashboard"

export default function DevDashboardPage() {
    // Development mode check - only accessible in development
    if (process.env.NODE_ENV !== "development" && !process.env.VERCEL_URL?.includes("localhost")) {
        notFound()
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-4xl font-bold text-foreground">Development Testing Suite</h1>
                        <p className="text-muted-foreground">Comprehensive testing and debugging tools for the entire application</p>
                    </div>
                    <div className="flex gap-4">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Zap className="mr-2 h-4 w-4" />
                            Quick Test
                        </Button>
                        <Button variant="outline" className="border-white/20 text-foreground hover:bg-white/10">
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                        </Button>
                    </div>
                </div>
            </div>

            {/* System Status Overview */}
            <SystemStatusDashboard />

            {/* Main Testing Suites */}
            <Tabs defaultValue="components" className="mt-8 space-y-4">
                <TabsList className="bg-card border border-border grid grid-cols-9 gap-2">
                    <TabsTrigger value="components" className="data-[state=active]:bg-secondary flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Components
                    </TabsTrigger>
                    <TabsTrigger value="api" className="data-[state=active]:bg-secondary flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        API Testing
                    </TabsTrigger>
                    <TabsTrigger value="flows" className="data-[state=active]:bg-secondary flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        User Flows
                    </TabsTrigger>
                    <TabsTrigger value="data" className="data-[state=active]:bg-secondary flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Data Management
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="data-[state=active]:bg-secondary flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Performance
                    </TabsTrigger>
                    <TabsTrigger value="debugging" className="data-[state=active]:bg-secondary flex items-center gap-2">
                        <Bug className="h-4 w-4" />
                        Debugging
                    </TabsTrigger>
                    <TabsTrigger value="webhook" className="data-[state=active]:bg-secondary flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Webhooks
                    </TabsTrigger>
                    <TabsTrigger value="database" className="data-[state=active]:bg-secondary flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Database
                    </TabsTrigger>
                    <TabsTrigger value="monitoring" className="data-[state=active]:bg-secondary flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Live Monitoring
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="components">
                    <ComponentTestingSuite />
                </TabsContent>

                <TabsContent value="api">
                    <ApiTestingSuite />
                </TabsContent>

                <TabsContent value="flows">
                    <UserFlowTestingSuite />
                </TabsContent>

                <TabsContent value="data">
                    <DataManagementSuite />
                </TabsContent>

                <TabsContent value="performance">
                    <PerformanceMonitoringSuite />
                </TabsContent>

                <TabsContent value="debugging">
                    <DebuggingToolsSuite />
                </TabsContent>

                <TabsContent value="webhook">
                    <div className="space-y-6">
                        <Card className="border-border bg-card p-6">
                            <h3 className="mb-4 text-lg font-semibold text-foreground">Real-time Webhook Monitor</h3>
                            <p className="text-muted-foreground">Live ticket sales logging and webhook endpoint monitoring. View incoming sales data in real-time.</p>
                        </Card>
                        <div className="grid gap-6">
                            {/* This will be replaced by the actual webhook monitoring component */}
                            <div className="text-center text-muted-foreground py-8">
                                Webhook monitoring functionality available at <a href="/dev/webhook" className="text-blue-400 underline">/dev/webhook</a>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="database">
                    <div className="space-y-6">
                        <Card className="border-border bg-card p-6">
                            <h3 className="mb-4 text-lg font-semibold text-foreground">Database Management Center</h3>
                            <p className="text-muted-foreground">Centralized source of truth for webhook data processing and analytics. Manage events, orders, and promoters.</p>
                        </Card>
                        <div className="grid gap-6">
                            {/* This will be replaced by the actual database management component */}
                            <div className="text-center text-muted-foreground py-8">
                                Database management functionality available at <a href="/dev/database" className="text-blue-400 underline">/dev/database</a>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="monitoring">
                    <div className="space-y-6">
                        <Card className="border-border bg-card p-6">
                            <h3 className="mb-4 text-lg font-semibold text-foreground">Real-time System Monitoring</h3>
                            <p className="text-muted-foreground">Live monitoring dashboard for webhook endpoints, component performance, and system health.</p>
                        </Card>
                        {/* Import existing webhook monitoring */}
                        <div className="grid gap-6">
                            {/* Webhook monitoring will be included here */}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
