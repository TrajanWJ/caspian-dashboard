'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
    Play,
    Square,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Zap,
    Settings,
    FileText,
    BarChart3
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface TestCase {
    id: string
    name: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    url: string
    headers: Record<string, string>
    payload: string
    expectedStatus: number
    timeout: number
}

interface TestResult {
    id: string
    testCaseId: string
    success: boolean
    status: number
    responseTime: number
    response: any
    error?: string
    timestamp: Date
}

const defaultTestCases: TestCase[] = [
    {
        id: '1',
        name: 'Basic Webhook Delivery',
        method: 'POST',
        url: '/api/test-webhook',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify({ event: 'test', data: { id: '123' } }, null, 2),
        expectedStatus: 200,
        timeout: 5000
    },
    {
        id: '2',
        name: 'Invalid Payload',
        method: 'POST',
        url: '/api/test-webhook',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify({ invalid: 'payload' }, null, 2),
        expectedStatus: 400,
        timeout: 5000
    },
    {
        id: '3',
        name: 'Large Payload',
        method: 'POST',
        url: '/api/test-webhook',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify({
            event: 'large_payload',
            data: { items: Array.from({ length: 1000 }, (_, i) => ({ id: i, value: Math.random() })) }
        }, null, 2),
        expectedStatus: 200,
        timeout: 10000
    }
]

export function WebhookTestSuite() {
    const [testCases, setTestCases] = useState<TestCase[]>(defaultTestCases)
    const [results, setResults] = useState<TestResult[]>([])
    const [isRunning, setIsRunning] = useState(false)
    const [progress, setProgress] = useState(0)
    const [selectedTest, setSelectedTest] = useState<string | null>(null)
    const { toast } = useToast()

    const runTest = async (testCase: TestCase): Promise<TestResult> => {
        const startTime = Date.now()

        try {
            const response = await fetch(testCase.url, {
                method: testCase.method,
                headers: testCase.headers,
                body: testCase.method !== 'GET' ? testCase.payload : undefined,
                signal: AbortSignal.timeout(testCase.timeout)
            })

            const responseTime = Date.now() - startTime
            const responseData = await response.text()
            let parsedResponse

            try {
                parsedResponse = JSON.parse(responseData)
            } catch {
                parsedResponse = responseData
            }

            const success = response.status === testCase.expectedStatus

            return {
                id: Date.now().toString(),
                testCaseId: testCase.id,
                success,
                status: response.status,
                responseTime,
                response: parsedResponse,
                timestamp: new Date()
            }
        } catch (error) {
            const responseTime = Date.now() - startTime
            return {
                id: Date.now().toString(),
                testCaseId: testCase.id,
                success: false,
                status: 0,
                responseTime,
                response: null,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date()
            }
        }
    }

    const runAllTests = async () => {
        setIsRunning(true)
        setResults([])
        setProgress(0)

        const newResults: TestResult[] = []

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i]
            const result = await runTest(testCase)
            newResults.push(result)
            setResults([...newResults])
            setProgress(((i + 1) / testCases.length) * 100)
        }

        setIsRunning(false)
        setProgress(100)

        const passed = newResults.filter(r => r.success).length
        const total = newResults.length

        toast({
            title: 'Test Suite Complete',
            description: `${passed}/${total} tests passed`,
            variant: passed === total ? 'default' : 'destructive'
        })
    }

    const runSingleTest = async (testCase: TestCase) => {
        setIsRunning(true)
        const result = await runTest(testCase)
        setResults(prev => [result, ...prev])
        setIsRunning(false)

        toast({
            title: result.success ? 'Test Passed' : 'Test Failed',
            description: `${testCase.name}: ${result.responseTime}ms`,
            variant: result.success ? 'default' : 'destructive'
        })
    }

    const addTestCase = () => {
        const newTest: TestCase = {
            id: Date.now().toString(),
            name: 'New Test Case',
            method: 'POST',
            url: '/api/test-webhook',
            headers: { 'Content-Type': 'application/json' },
            payload: JSON.stringify({ event: 'test' }, null, 2),
            expectedStatus: 200,
            timeout: 5000
        }
        setTestCases([...testCases, newTest])
    }

    const updateTestCase = (id: string, updates: Partial<TestCase>) => {
        setTestCases(testCases.map(tc => tc.id === id ? { ...tc, ...updates } : tc))
    }

    const deleteTestCase = (id: string) => {
        setTestCases(testCases.filter(tc => tc.id !== id))
    }

    const getTestStats = () => {
        const total = results.length
        const passed = results.filter(r => r.success).length
        const failed = total - passed
        const avgResponseTime = results.reduce((acc, r) => acc + r.responseTime, 0) / total || 0

        return { total, passed, failed, avgResponseTime }
    }

    const stats = getTestStats()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Webhook Test Suite</h2>
                    <p className="text-muted-foreground">
                        Comprehensive testing tools for webhook endpoints
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={runAllTests} disabled={isRunning}>
                        <Play className="w-4 h-4 mr-2" />
                        Run All Tests
                    </Button>
                    <Button variant="outline" onClick={addTestCase}>
                        <FileText className="w-4 h-4 mr-2" />
                        Add Test
                    </Button>
                </div>
            </div>

            {/* Progress Bar */}
            {isRunning && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Progress value={progress} className="w-full" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(progress)}% complete
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">Total Tests</p>
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
                                <p className="text-sm font-medium">Passed</p>
                                <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
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
                                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
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

            <Tabs defaultValue="tests" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tests">Test Cases</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="tests" className="space-y-4">
                    {testCases.map((testCase) => (
                        <Card key={testCase.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{testCase.name}</CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => runSingleTest(testCase)}
                                            disabled={isRunning}
                                        >
                                            <Zap className="w-4 h-4 mr-2" />
                                            Run
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedTest(selectedTest === testCase.id ? null : testCase.id)}
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription>
                                    {testCase.method} {testCase.url} • Expected: {testCase.expectedStatus}
                                </CardDescription>
                            </CardHeader>

                            {selectedTest === testCase.id && (
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`name-${testCase.id}`}>Test Name</Label>
                                            <Input
                                                id={`name-${testCase.id}`}
                                                value={testCase.name}
                                                onChange={(e) => updateTestCase(testCase.id, { name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`method-${testCase.id}`}>Method</Label>
                                            <Select
                                                value={testCase.method}
                                                onValueChange={(value) => updateTestCase(testCase.id, { method: value as any })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="GET">GET</SelectItem>
                                                    <SelectItem value="POST">POST</SelectItem>
                                                    <SelectItem value="PUT">PUT</SelectItem>
                                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor={`url-${testCase.id}`}>URL</Label>
                                        <Input
                                            id={`url-${testCase.id}`}
                                            value={testCase.url}
                                            onChange={(e) => updateTestCase(testCase.id, { url: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`payload-${testCase.id}`}>Payload (JSON)</Label>
                                        <Textarea
                                            id={`payload-${testCase.id}`}
                                            value={testCase.payload}
                                            onChange={(e) => updateTestCase(testCase.id, { payload: e.target.value })}
                                            rows={6}
                                            className="font-mono text-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`status-${testCase.id}`}>Expected Status</Label>
                                            <Input
                                                id={`status-${testCase.id}`}
                                                type="number"
                                                value={testCase.expectedStatus}
                                                onChange={(e) => updateTestCase(testCase.id, { expectedStatus: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`timeout-${testCase.id}`}>Timeout (ms)</Label>
                                            <Input
                                                id={`timeout-${testCase.id}`}
                                                type="number"
                                                value={testCase.timeout}
                                                onChange={(e) => updateTestCase(testCase.id, { timeout: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => deleteTestCase(testCase.id)}
                                        >
                                            Delete Test
                                        </Button>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="results" className="space-y-4">
                    {results.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground">
                                No test results yet. Run some tests to see results here.
                            </CardContent>
                        </Card>
                    ) : (
                        results.map((result) => {
                            const testCase = testCases.find(tc => tc.id === result.testCaseId)
                            return (
                                <Card key={result.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {result.success ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                )}
                                                {testCase?.name}
                                            </CardTitle>
                                            <Badge variant={result.success ? "default" : "destructive"}>
                                                {result.status}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            {result.responseTime}ms • {result.timestamp.toLocaleString()}
                                        </CardDescription>
                                    </CardHeader>

                                    {result.error && (
                                        <CardContent>
                                            <Alert>
                                                <AlertTriangle className="h-4 w-4" />
                                                <AlertDescription>{result.error}</AlertDescription>
                                            </Alert>
                                        </CardContent>
                                    )}

                                    {result.response && (
                                        <CardContent>
                                            <Label>Response</Label>
                                            <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                                                {JSON.stringify(result.response, null, 2)}
                                            </pre>
                                        </CardContent>
                                    )}
                                </Card>
                            )
                        })
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}