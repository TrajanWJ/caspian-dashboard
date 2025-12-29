"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Play,
    Pause,
    RotateCcw,
    CheckCircle,
    XCircle,
    Clock,
    User,
    ArrowRight,
    MousePointer,
    Eye,
    Keyboard,
    Smartphone,
    Monitor,
    Tablet
} from "lucide-react"

interface UserFlowStep {
    id: string
    name: string
    description: string
    action: string
    expectedResult: string
    status: 'pending' | 'running' | 'success' | 'error'
    duration?: number
    screenshot?: string
}

interface UserFlow {
    id: string
    name: string
    description: string
    steps: UserFlowStep[]
    status: 'pending' | 'running' | 'completed' | 'failed'
    progress: number
    totalDuration: number
    device: 'desktop' | 'tablet' | 'mobile'
}

const mockUserFlows: UserFlow[] = [
    {
        id: "auth-flow",
        name: "User Authentication Flow",
        description: "Complete login and registration process",
        device: "desktop",
        status: "completed",
        progress: 100,
        totalDuration: 4500,
        steps: [
            {
                id: "navigate-login",
                name: "Navigate to Login",
                description: "Go to the login page",
                action: "Click login button on homepage",
                expectedResult: "Login form displayed",
                status: "success",
                duration: 1200
            },
            {
                id: "enter-credentials",
                name: "Enter Credentials",
                description: "Fill in email and password",
                action: "Type valid credentials",
                expectedResult: "Form validation passes",
                status: "success",
                duration: 800
            },
            {
                id: "submit-login",
                name: "Submit Login",
                description: "Click login button",
                action: "Submit form",
                expectedResult: "Redirect to dashboard",
                status: "success",
                duration: 2500
            }
        ]
    },
    {
        id: "webhook-setup",
        name: "Webhook Configuration Flow",
        description: "Set up and test webhook endpoints",
        device: "desktop",
        status: "running",
        progress: 60,
        totalDuration: 3200,
        steps: [
            {
                id: "access-owner-panel",
                name: "Access Owner Panel",
                description: "Navigate to owner dashboard",
                action: "Click owner section",
                expectedResult: "Owner dashboard loads",
                status: "success",
                duration: 1500
            },
            {
                id: "webhook-settings",
                name: "Webhook Settings",
                description: "Open webhook configuration",
                action: "Navigate to webhooks tab",
                expectedResult: "Webhook settings page",
                status: "running",
                duration: 1700
            },
            {
                id: "configure-endpoint",
                name: "Configure Endpoint",
                description: "Set up webhook URL",
                action: "Enter webhook URL",
                expectedResult: "URL validated",
                status: "pending"
            }
        ]
    },
    {
        id: "promoter-onboarding",
        name: "Promoter Onboarding Flow",
        description: "New promoter registration and setup",
        device: "mobile",
        status: "pending",
        progress: 0,
        totalDuration: 0,
        steps: [
            {
                id: "receive-link",
                name: "Receive Tracking Link",
                description: "Get promoter link",
                action: "Receive email/SMS with link",
                expectedResult: "Link accessible",
                status: "pending"
            },
            {
                id: "register-account",
                name: "Register Account",
                description: "Create promoter account",
                action: "Fill registration form",
                expectedResult: "Account created",
                status: "pending"
            },
            {
                id: "setup-profile",
                name: "Setup Profile",
                description: "Complete profile setup",
                action: "Upload photo, set preferences",
                expectedResult: "Profile complete",
                status: "pending"
            }
        ]
    }
]

export function UserFlowTestingSuite() {
    const [selectedFlow, setSelectedFlow] = useState<UserFlow | null>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [currentStep, setCurrentStep] = useState<string | null>(null)

    const getStatusIcon = (status: UserFlowStep['status']) => {
        switch (status) {
            case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'error': return <XCircle className="h-4 w-4 text-red-500" />
            case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
            default: return <div className="h-4 w-4 rounded-full bg-gray-500" />
        }
    }

    const getDeviceIcon = (device: UserFlow['device']) => {
        switch (device) {
            case 'mobile': return <Smartphone className="h-4 w-4" />
            case 'tablet': return <Tablet className="h-4 w-4" />
            default: return <Monitor className="h-4 w-4" />
        }
    }

    const runFlow = async (flowId: string) => {
        setIsRunning(true)
        const flow = mockUserFlows.find(f => f.id === flowId)
        if (!flow) return

        for (const step of flow.steps) {
            setCurrentStep(step.id)
            // Simulate step execution
            await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000))
            step.status = Math.random() > 0.1 ? 'success' : 'error'
        }

        setCurrentStep(null)
        setIsRunning(false)
    }

    const runAllFlows = async () => {
        setIsRunning(true)
        for (const flow of mockUserFlows) {
            await runFlow(flow.id)
        }
        setIsRunning(false)
    }

    return (
        <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <User className="h-5 w-5" />
                        User Flow Testing Suite
                    </CardTitle>
                    <CardDescription className="text-white/60">
                        Test complete user journeys and interaction flows across different devices and scenarios
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <Button
                            onClick={runAllFlows}
                            disabled={isRunning}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            {isRunning ? "Running Flows..." : "Run All Flows"}
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset All
                        </Button>
                    </div>

                    <Tabs defaultValue="flows" className="space-y-4">
                        <TabsList className="bg-white/5 border border-white/10">
                            <TabsTrigger value="flows" className="data-[state=active]:bg-white/10">User Flows</TabsTrigger>
                            <TabsTrigger value="devices" className="data-[state=active]:bg-white/10">Device Testing</TabsTrigger>
                            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10">Flow Analytics</TabsTrigger>
                        </TabsList>

                        <TabsContent value="flows" className="space-y-4">
                            <div className="grid gap-4">
                                {mockUserFlows.map((flow) => (
                                    <Card key={flow.id} className="border-white/10 bg-white/5 backdrop-blur">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    {getDeviceIcon(flow.device)}
                                                    <div>
                                                        <p className="font-medium text-white">{flow.name}</p>
                                                        <p className="text-sm text-white/60">{flow.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="border-white/20 text-white/60 capitalize">
                                                        {flow.device}
                                                    </Badge>
                                                    <Badge className={
                                                        flow.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                                            flow.status === 'running' ? 'bg-blue-500/10 text-blue-400' :
                                                                flow.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                                                    'bg-gray-500/10 text-gray-400'
                                                    }>
                                                        {flow.status}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => runFlow(flow.id)}
                                                        disabled={isRunning}
                                                    >
                                                        <Play className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white/60">Progress</span>
                                                    <span className="text-white">{flow.progress}%</span>
                                                </div>
                                                <Progress value={flow.progress} className="h-2" />
                                                {flow.totalDuration > 0 && (
                                                    <p className="text-xs text-white/60">
                                                        Total duration: {flow.totalDuration}ms
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                {flow.steps.map((step, index) => (
                                                    <div key={step.id} className="flex items-center gap-3 p-2 rounded border border-white/10 bg-white/5">
                                                        <div className="flex items-center gap-2">
                                                            {getStatusIcon(step.status)}
                                                            <span className="text-sm text-white/60">{index + 1}.</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-white">{step.name}</p>
                                                            <p className="text-xs text-white/60">{step.description}</p>
                                                        </div>
                                                        {step.duration && (
                                                            <Badge variant="outline" className="border-white/20 text-white/60">
                                                                {step.duration}ms
                                                            </Badge>
                                                        )}
                                                        {currentStep === step.id && (
                                                            <div className="animate-pulse">
                                                                <ArrowRight className="h-4 w-4 text-blue-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="devices" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { device: 'Desktop', icon: Monitor, resolution: '1920x1080', status: 'available' },
                                    { device: 'Tablet', icon: Tablet, resolution: '768x1024', status: 'available' },
                                    { device: 'Mobile', icon: Smartphone, resolution: '375x667', status: 'available' }
                                ].map(({ device, icon: Icon, resolution, status }) => (
                                    <Card key={device} className="border-white/10 bg-white/5 backdrop-blur">
                                        <CardContent className="p-4 text-center">
                                            <Icon className="h-8 w-8 mx-auto mb-2 text-white/60" />
                                            <h3 className="font-medium text-white mb-1">{device}</h3>
                                            <p className="text-sm text-white/60 mb-3">{resolution}</p>
                                            <Badge className="bg-green-500/10 text-green-400">
                                                {status}
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="analytics">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-white/10 bg-white/5 backdrop-blur">
                                    <CardHeader>
                                        <CardTitle className="text-white">Flow Performance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/60">Average Completion Time</span>
                                                <span className="text-white font-medium">3.2s</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/60">Success Rate</span>
                                                <span className="text-green-400 font-medium">94.5%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/60">Most Failed Step</span>
                                                <span className="text-red-400 font-medium">Form Validation</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-white/10 bg-white/5 backdrop-blur">
                                    <CardHeader>
                                        <CardTitle className="text-white">User Interaction Patterns</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <MousePointer className="h-4 w-4 text-blue-400" />
                                                <span className="text-white/60">Click interactions</span>
                                                <span className="text-white ml-auto">1,247</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Keyboard className="h-4 w-4 text-green-400" />
                                                <span className="text-white/60">Form inputs</span>
                                                <span className="text-white ml-auto">892</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Eye className="h-4 w-4 text-purple-400" />
                                                <span className="text-white/60">Page views</span>
                                                <span className="text-white ml-auto">3,456</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Flow Details Modal */}
                    {selectedFlow && (
                        <div className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">{selectedFlow.name}</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedFlow(null)}
                                >
                                    ×
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="border-white/20 text-white">
                                        {selectedFlow.device}
                                    </Badge>
                                    <Badge className={
                                        selectedFlow.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                            selectedFlow.status === 'running' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-gray-500/10 text-gray-400'
                                    }>
                                        {selectedFlow.status}
                                    </Badge>
                                </div>
                                <p className="text-white/60">{selectedFlow.description}</p>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-white">Steps:</h4>
                                    {selectedFlow.steps.map((step, index) => (
                                        <div key={step.id} className="p-3 rounded border border-white/10 bg-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusIcon(step.status)}
                                                <span className="font-medium text-white">{step.name}</span>
                                            </div>
                                            <p className="text-sm text-white/60 mb-2">{step.description}</p>
                                            <div className="text-xs text-white/60">
                                                <strong>Action:</strong> {step.action}<br />
                                                <strong>Expected:</strong> {step.expectedResult}
                                            </div>
                                            {step.duration && (
                                                <Badge variant="outline" className="mt-2 border-white/20 text-white/60">
                                                    {step.duration}ms
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}