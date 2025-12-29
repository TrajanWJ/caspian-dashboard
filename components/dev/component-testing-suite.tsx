"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Play,
    RotateCcw,
    Eye,
    Code,
    Palette,
    MousePointer,
    Smartphone,
    Monitor,
    Tablet
} from "lucide-react"

interface ComponentTest {
    id: string
    name: string
    category: string
    status: 'pass' | 'fail' | 'warning' | 'pending'
    description: string
    lastRun?: string
    error?: string
}

const mockComponentTests: ComponentTest[] = [
    {
        id: "sidebar-responsive",
        name: "Sidebar Responsiveness",
        category: "Navigation",
        status: "pass",
        description: "Tests sidebar collapse/expand on different screen sizes",
        lastRun: "2024-01-15 10:30"
    },
    {
        id: "button-variants",
        name: "Button Variants",
        category: "UI Components",
        status: "pass",
        description: "Verifies all button variants render correctly",
        lastRun: "2024-01-15 10:30"
    },
    {
        id: "form-validation",
        name: "Form Validation",
        category: "Forms",
        status: "warning",
        description: "Checks form validation states and error messages",
        lastRun: "2024-01-15 10:25",
        error: "Some validation messages not displaying"
    },
    {
        id: "chart-rendering",
        name: "Chart Components",
        category: "Data Visualization",
        status: "fail",
        description: "Tests chart rendering with mock data",
        lastRun: "2024-01-15 10:20",
        error: "Chart fails to render on mobile devices"
    },
    {
        id: "modal-dialogs",
        name: "Modal Dialogs",
        category: "Overlays",
        status: "pass",
        description: "Verifies modal open/close functionality",
        lastRun: "2024-01-15 10:30"
    }
]

export function ComponentTestingSuite() {
    const [selectedTest, setSelectedTest] = useState<ComponentTest | null>(null)
    const [isRunning, setIsRunning] = useState(false)

    const getStatusIcon = (status: ComponentTest['status']) => {
        switch (status) {
            case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'fail': return <XCircle className="h-4 w-4 text-red-500" />
            case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            default: return <div className="h-4 w-4 rounded-full bg-gray-500" />
        }
    }

    const getStatusColor = (status: ComponentTest['status']) => {
        switch (status) {
            case 'pass': return 'bg-green-500/10 text-green-400 border-green-500/20'
            case 'fail': return 'bg-red-500/10 text-red-400 border-red-500/20'
            case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }

    const runAllTests = async () => {
        setIsRunning(true)
        // Simulate running tests
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsRunning(false)
    }

    const runSingleTest = async (testId: string) => {
        // Simulate running single test
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    const testsByCategory = mockComponentTests.reduce((acc, test) => {
        if (!acc[test.category]) acc[test.category] = []
        acc[test.category].push(test)
        return acc
    }, {} as Record<string, ComponentTest[]>)

    return (
        <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Code className="h-5 w-5" />
                        Component Testing Suite
                    </CardTitle>
                    <CardDescription className="text-white/60">
                        Test and validate all UI components across different devices and states
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

                    <Tabs defaultValue="all" className="space-y-4">
                        <TabsList className="bg-white/5 border border-white/10">
                            <TabsTrigger value="all" className="data-[state=active]:bg-white/10">All Tests</TabsTrigger>
                            <TabsTrigger value="ui" className="data-[state=active]:bg-white/10">UI Components</TabsTrigger>
                            <TabsTrigger value="navigation" className="data-[state=active]:bg-white/10">Navigation</TabsTrigger>
                            <TabsTrigger value="forms" className="data-[state=active]:bg-white/10">Forms</TabsTrigger>
                            <TabsTrigger value="data" className="data-[state=active]:bg-white/10">Data Visualization</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            {Object.entries(testsByCategory).map(([category, tests]) => (
                                <Card key={category} className="border-white/10 bg-white/5 backdrop-blur">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-white">{category}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-3">
                                            {tests.map((test) => (
                                                <div
                                                    key={test.id}
                                                    className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                                    onClick={() => setSelectedTest(test)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {getStatusIcon(test.status)}
                                                        <div>
                                                            <p className="font-medium text-white">{test.name}</p>
                                                            <p className="text-sm text-white/60">{test.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={getStatusColor(test.status)}>
                                                            {test.status.toUpperCase()}
                                                        </Badge>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                runSingleTest(test.id)
                                                            }}
                                                        >
                                                            <Play className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        {/* Other tab contents would be similar, filtered by category */}
                        <TabsContent value="ui">
                            <div className="grid gap-3">
                                {mockComponentTests
                                    .filter(test => test.category === "UI Components")
                                    .map((test) => (
                                        <div
                                            key={test.id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(test.status)}
                                                <span className="text-white">{test.name}</span>
                                            </div>
                                            <Badge className={getStatusColor(test.status)}>
                                                {test.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    ))}
                            </div>
                        </TabsContent>

                        {/* Add similar content for other tabs */}
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
                                    <span className="text-white/60">Status:</span>
                                    <Badge className={getStatusColor(selectedTest.status)}>
                                        {selectedTest.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <p className="text-white/60">{selectedTest.description}</p>
                                {selectedTest.lastRun && (
                                    <p className="text-sm text-white/60">Last run: {selectedTest.lastRun}</p>
                                )}
                                {selectedTest.error && (
                                    <Alert className="border-red-500/20 bg-red-500/10">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription className="text-red-400">
                                            {selectedTest.error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Device Testing Section */}
                    <Card className="mt-6 border-white/10 bg-white/5 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Smartphone className="h-5 w-5" />
                                Device Compatibility Testing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-20 flex-col gap-2">
                                    <Smartphone className="h-6 w-6" />
                                    Mobile
                                </Button>
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-20 flex-col gap-2">
                                    <Tablet className="h-6 w-6" />
                                    Tablet
                                </Button>
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-20 flex-col gap-2">
                                    <Monitor className="h-6 w-6" />
                                    Desktop
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    )
}