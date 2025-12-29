'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
    Zap,
    Clock,
    Database,
    Server,
    Activity,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Play,
    Pause,
    Square,
    RefreshCw,
    Download,
    BarChart3,
    Cpu,
    HardDrive,
    Wifi
} from "lucide-react"

interface PerformanceTest {
    id: string
    name: string
    type: 'load' | 'stress' | 'spike' | 'volume' | 'endurance'
    status: 'idle' | 'running' | 'completed' | 'failed'
    startTime?: Date
    endTime?: Date
    duration?: number
    config: {
        concurrentUsers: number
        duration: number
        rampUpTime: number
        targetEndpoint: string
    }
    results?: {
        totalRequests: number
        successfulRequests: number
        failedRequests: number
        averageResponseTime: number
        minResponseTime: number
        maxResponseTime: number
        throughput: number
        errorRate: number
        percentiles: {
            p50: number
            p95: number
            p99: number
        }
    }
}

interface SystemMetrics {
    timestamp: Date
    cpu: number
    memory: number
    disk: number
    network: number
    activeConnections: number
    responseTime: number
}

const mockTests: PerformanceTest[] = [
    {
        id: '1',
        name: 'Basic Load Test',
        type: 'load',
        status: 'completed',
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() - 3000000),
        duration: 600000,
        config: {
            concurrentUsers: 50,
            duration: 600,
            rampUpTime: 60,
            targetEndpoint: '/api/webhook'
        },
        results: {
            totalRequests: 15000,
            successfulRequests: 14950,
            failedRequests: 50,
            averageResponseTime: 245,
            minResponseTime: 120,
            maxResponseTime: 1200,
            throughput: 25,
            errorRate: 0.33,
            percentiles: {
                p50: 220,
                p95: 450,
                p99: 800
            }
        }
    },
    {
        id: '2',
        name: 'Stress Test - High Load',
        type: 'stress',
        status: 'completed',
        startTime: new Date(Date.now() - 1800000),
        endTime: new Date(Date.now() - 1200000),
        duration: 600000,
        config: {
            concurrentUsers: 200,
            duration: 600,
            rampUpTime: 120,
            targetEndpoint: '/api/webhook'
        },
        results: {
            totalRequests: 45000,
            successfulRequests: 44100,
            failedRequests: 900,
            averageResponseTime: 580,
            minResponseTime: 180,
            maxResponseTime: 2500,
            throughput: 75,
            errorRate: 2.0,
            percentiles: {
                p50: 520,
                p95: 1200,
                p99: 1800
            }
        }
    },
    {
        id: '3',
        name: 'Spike Test',
        type: 'spike',
        status: 'idle',
        config: {
            concurrentUsers: 1000,
            duration: 60,
            rampUpTime: 5,
            targetEndpoint: '/api/webhook'
        }
    }
]

const mockMetrics: SystemMetrics[] = Array.from({ length: 60 }, (_, i) => ({
    timestamp: new Date(Date.now() - (60 - i) * 60000),
    cpu: Math.random() * 30 + 20,
    memory: Math.random() * 20 + 60,
    disk: Math.random() * 10 + 15,
    network: Math.random() * 50 + 100,
    activeConnections: Math.floor(Math.random() * 100) + 50,
    responseTime: Math.random() * 200 + 150
}))

export function PerformanceTestingTools() {
    const [tests, setTests] = useState<PerformanceTest[]>(mockTests)
    const [currentTest, setCurrentTest] = useState<PerformanceTest | null>(null)
    const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>(mockMetrics)
    const [isRunning, setIsRunning] = useState(false)
    const [newTestConfig, setNewTestConfig] = useState({
        name: '',
        type: 'load' as PerformanceTest['type'],
        concurrentUsers: 50,
        duration: 300,
        rampUpTime: 30,
        targetEndpoint: '/api/webhook'
    })

    const startTest = async (test: PerformanceTest) => {
        setCurrentTest(test)
        setIsRunning(true)

        setTests(prev => prev.map(t =>
            t.id === test.id
                ? { ...t, status: 'running', startTime: new Date() }
                : t
        ))

        // Simulate test execution
        const duration = test.config.duration * 1000
        const startTime = Date.now()

        // Update metrics every second
        const metricsInterval = setInterval(() => {
            setSystemMetrics(prev => [...prev.slice(-59), {
                timestamp: new Date(),
                cpu: Math.random() * 40 + 30,
                memory: Math.random() * 25 + 55,
                disk: Math.random() * 15 + 20,
                network: Math.random() * 60 + 80,
                activeConnections: Math.floor(Math.random() * 150) + 100,
                responseTime: Math.random() * 300 + 200
            }])
        }, 1000)

        await new Promise(resolve => setTimeout(resolve, duration))

        clearInterval(metricsInterval)

        // Generate mock results
        const totalRequests = Math.floor(test.config.concurrentUsers * test.config.duration * (Math.random() * 0.5 + 0.8))
        const errorRate = Math.random() * 5
        const failedRequests = Math.floor(totalRequests * errorRate / 100)

        setTests(prev => prev.map(t =>
            t.id === test.id
                ? {
                    ...t,
                    status: 'completed',
                    endTime: new Date(),
                    duration: Date.now() - startTime,
                    results: {
                        totalRequests,
                        successfulRequests: totalRequests - failedRequests,
                        failedRequests,
                        averageResponseTime: Math.floor(Math.random() * 400 + 200),
                        minResponseTime: Math.floor(Math.random() * 100 + 50),
                        maxResponseTime: Math.floor(Math.random() * 2000 + 500),
                        throughput: Math.floor(totalRequests / test.config.duration),
                        errorRate,
                        percentiles: {
                            p50: Math.floor(Math.random() * 300 + 150),
                            p95: Math.floor(Math.random() * 800 + 400),
                            p99: Math.floor(Math.random() * 1500 + 800)
                        }
                    }
                }
                : t
        ))

        setIsRunning(false)
        setCurrentTest(null)
    }

    const stopTest = () => {
        if (currentTest) {
            setTests(prev => prev.map(t =>
                t.id === currentTest.id
                    ? { ...t, status: 'failed', endTime: new Date() }
                    : t
            ))
        }
        setIsRunning(false)
        setCurrentTest(null)
    }

    const createNewTest = () => {
        const newTest: PerformanceTest = {
            id: Date.now().toString(),
            name: newTestConfig.name,
            type: newTestConfig.type,
            status: 'idle',
            config: {
                concurrentUsers: newTestConfig.concurrentUsers,
                duration: newTestConfig.duration,
                rampUpTime: newTestConfig.rampUpTime,
                targetEndpoint: newTestConfig.targetEndpoint
            }
        }

        setTests(prev => [...prev, newTest])
        setNewTestConfig({
            name: '',
            type: 'load',
            concurrentUsers: 50,
            duration: 300,
            rampUpTime: 30,
            targetEndpoint: '/api/webhook'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400'
            case 'running': return 'text-blue-400'
            case 'failed': return 'text-red-400'
            default: return 'text-gray-400'
        }
    }

    const getTestTypeIcon = (type: string) => {
        switch (type) {
            case 'load': return <TrendingUp className="h-4 w-4" />
            case 'stress': return <AlertTriangle className="h-4 w-4" />
            case 'spike': return <Zap className="h-4 w-4" />
            case 'volume': return <Database className="h-4 w-4" />
            case 'endurance': return <Clock className="h-4 w-4" />
            default: return <Activity className="h-4 w-4" />
        }
    }

    const currentMetrics = systemMetrics[systemMetrics.length - 1] || {
        cpu: 0, memory: 0, disk: 0, network: 0, activeConnections: 0, responseTime: 0
    }

    return (
        <div className="space-y-6">
            {/* System Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Cpu className="h-5 w-5 text-blue-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{currentMetrics.cpu.toFixed(1)}%</p>
                                <p className="text-sm text-white/60">CPU</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-green-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{currentMetrics.memory.toFixed(1)}%</p>
                                <p className="text-sm text-white/60">Memory</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-purple-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{currentMetrics.disk.toFixed(1)}%</p>
                                <p className="text-sm text-white/60">Disk</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Wifi className="h-5 w-5 text-cyan-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{currentMetrics.network.toFixed(0)}</p>
                                <p className="text-sm text-white/60">Network</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-orange-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{currentMetrics.activeConnections}</p>
                                <p className="text-sm text-white/60">Connections</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-red-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{currentMetrics.responseTime.toFixed(0)}ms</p>
                                <p className="text-sm text-white/60">Response</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Test Controls */}
            <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-white">Performance Testing Suite</CardTitle>
                    <CardDescription className="text-white/60">
                        Load testing, stress testing, and performance monitoring
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        {currentTest ? (
                            <>
                                <Button
                                    onClick={stopTest}
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <Square className="mr-2 h-4 w-4" />
                                    Stop Test
                                </Button>
                                <div className="text-white/80">
                                    Running: {currentTest.name}
                                </div>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Results
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10"
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Generate Report
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="tests" className="w-full">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="tests" className="data-[state=active]:bg-white/10">Test Runs</TabsTrigger>
                    <TabsTrigger value="create" className="data-[state=active]:bg-white/10">Create Test</TabsTrigger>
                    <TabsTrigger value="metrics" className="data-[state=active]:bg-white/10">System Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="tests" className="mt-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-white">Performance Tests</CardTitle>
                            <CardDescription className="text-white/60">
                                View and manage performance test runs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead className="text-white">Test Name</TableHead>
                                        <TableHead className="text-white">Type</TableHead>
                                        <TableHead className="text-white">Status</TableHead>
                                        <TableHead className="text-white">Users</TableHead>
                                        <TableHead className="text-white">Duration</TableHead>
                                        <TableHead className="text-white">Throughput</TableHead>
                                        <TableHead className="text-white">Error Rate</TableHead>
                                        <TableHead className="text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tests.map((test) => (
                                        <TableRow key={test.id} className="border-white/5">
                                            <TableCell className="text-white font-medium">{test.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getTestTypeIcon(test.type)}
                                                    <span className="text-white/80 capitalize">{test.type}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`border-white/20 ${getStatusColor(test.status)}`}
                                                >
                                                    {test.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-white/80">{test.config.concurrentUsers}</TableCell>
                                            <TableCell className="text-white/80">
                                                {test.duration ? `${(test.duration / 1000).toFixed(0)}s` : `${test.config.duration}s`}
                                            </TableCell>
                                            <TableCell className="text-white/80">
                                                {test.results ? `${test.results.throughput}/s` : '-'}
                                            </TableCell>
                                            <TableCell className="text-white/80">
                                                {test.results ? `${test.results.errorRate.toFixed(2)}%` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => startTest(test)}
                                                    disabled={test.status === 'running' || isRunning}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="create" className="mt-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-white">Create New Test</CardTitle>
                            <CardDescription className="text-white/60">
                                Configure a new performance test
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="test-name" className="text-white">Test Name</Label>
                                    <Input
                                        id="test-name"
                                        value={newTestConfig.name}
                                        onChange={(e) => setNewTestConfig(prev => ({ ...prev, name: e.target.value }))}
                                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                                        placeholder="Enter test name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="test-type" className="text-white">Test Type</Label>
                                    <Select
                                        value={newTestConfig.type}
                                        onValueChange={(value: PerformanceTest['type']) =>
                                            setNewTestConfig(prev => ({ ...prev, type: value }))
                                        }
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-white/20">
                                            <SelectItem value="load">Load Test</SelectItem>
                                            <SelectItem value="stress">Stress Test</SelectItem>
                                            <SelectItem value="spike">Spike Test</SelectItem>
                                            <SelectItem value="volume">Volume Test</SelectItem>
                                            <SelectItem value="endurance">Endurance Test</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-white">Concurrent Users: {newTestConfig.concurrentUsers}</Label>
                                    <Slider
                                        value={[newTestConfig.concurrentUsers]}
                                        onValueChange={(value) => setNewTestConfig(prev => ({ ...prev, concurrentUsers: value[0] }))}
                                        max={1000}
                                        min={1}
                                        step={10}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white">Test Duration (seconds): {newTestConfig.duration}</Label>
                                    <Slider
                                        value={[newTestConfig.duration]}
                                        onValueChange={(value) => setNewTestConfig(prev => ({ ...prev, duration: value[0] }))}
                                        max={3600}
                                        min={30}
                                        step={30}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white">Ramp Up Time (seconds): {newTestConfig.rampUpTime}</Label>
                                    <Slider
                                        value={[newTestConfig.rampUpTime]}
                                        onValueChange={(value) => setNewTestConfig(prev => ({ ...prev, rampUpTime: value[0] }))}
                                        max={300}
                                        min={5}
                                        step={5}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="target-endpoint" className="text-white">Target Endpoint</Label>
                                <Input
                                    id="target-endpoint"
                                    value={newTestConfig.targetEndpoint}
                                    onChange={(e) => setNewTestConfig(prev => ({ ...prev, targetEndpoint: e.target.value }))}
                                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                                    placeholder="/api/webhook"
                                />
                            </div>

                            <Button
                                onClick={createNewTest}
                                disabled={!newTestConfig.name.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Create Test
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="metrics" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white">CPU Usage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-32 flex items-end gap-1">
                                    {systemMetrics.slice(-20).map((metric, i) => (
                                        <div
                                            key={i}
                                            className="bg-blue-400 flex-1 rounded-t"
                                            style={{ height: `${metric.cpu}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2 text-sm text-white/60">
                                    Last 20 minutes
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white">Memory Usage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-32 flex items-end gap-1">
                                    {systemMetrics.slice(-20).map((metric, i) => (
                                        <div
                                            key={i}
                                            className="bg-green-400 flex-1 rounded-t"
                                            style={{ height: `${metric.memory}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2 text-sm text-white/60">
                                    Last 20 minutes
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white">Response Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-32 flex items-end gap-1">
                                    {systemMetrics.slice(-20).map((metric, i) => (
                                        <div
                                            key={i}
                                            className="bg-red-400 flex-1 rounded-t"
                                            style={{ height: `${(metric.responseTime / 10)}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2 text-sm text-white/60">
                                    Last 20 minutes (scaled)
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white">Active Connections</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-32 flex items-end gap-1">
                                    {systemMetrics.slice(-20).map((metric, i) => (
                                        <div
                                            key={i}
                                            className="bg-orange-400 flex-1 rounded-t"
                                            style={{ height: `${(metric.activeConnections / 2)}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2 text-sm text-white/60">
                                    Last 20 minutes (scaled)
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}