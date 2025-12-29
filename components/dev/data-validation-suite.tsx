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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Database,
    FileText,
    Shield,
    RefreshCw,
    Search,
    Filter,
    Download,
    Upload,
    Eye,
    Edit,
    Trash2,
    Plus,
    Settings
} from "lucide-react"

interface ValidationRule {
    id: string
    name: string
    description: string
    type: 'required' | 'format' | 'range' | 'custom'
    field: string
    enabled: boolean
    severity: 'error' | 'warning' | 'info'
    lastRun?: Date
    status?: 'passed' | 'failed' | 'pending'
}

interface ValidationResult {
    id: string
    ruleId: string
    recordId: string
    field: string
    value: any
    error: string
    severity: 'error' | 'warning' | 'info'
    timestamp: Date
}

interface DataIntegrityCheck {
    id: string
    name: string
    description: string
    status: 'passed' | 'failed' | 'running'
    lastRun: Date
    duration: number
    issues: number
    totalRecords: number
}

const mockValidationRules: ValidationRule[] = [
    {
        id: '1',
        name: 'Email Format Validation',
        description: 'Ensures email addresses follow proper format',
        type: 'format',
        field: 'email',
        enabled: true,
        severity: 'error',
        lastRun: new Date(Date.now() - 3600000),
        status: 'passed'
    },
    {
        id: '2',
        name: 'Required Fields Check',
        description: 'Verifies all required fields are present',
        type: 'required',
        field: 'all',
        enabled: true,
        severity: 'error',
        lastRun: new Date(Date.now() - 3600000),
        status: 'passed'
    },
    {
        id: '3',
        name: 'Phone Number Format',
        description: 'Validates phone number formatting',
        type: 'format',
        field: 'phone',
        enabled: true,
        severity: 'warning',
        lastRun: new Date(Date.now() - 3600000),
        status: 'failed'
    },
    {
        id: '4',
        name: 'Age Range Validation',
        description: 'Ensures age is within reasonable range',
        type: 'range',
        field: 'age',
        enabled: false,
        severity: 'warning',
        lastRun: new Date(Date.now() - 7200000),
        status: 'pending'
    },
    {
        id: '5',
        name: 'Custom Business Logic',
        description: 'Applies custom business rules',
        type: 'custom',
        field: 'business_rules',
        enabled: true,
        severity: 'error',
        lastRun: new Date(Date.now() - 1800000),
        status: 'passed'
    }
]

const mockValidationResults: ValidationResult[] = [
    {
        id: '1',
        ruleId: '3',
        recordId: 'rec_001',
        field: 'phone',
        value: '123-456-789',
        error: 'Invalid phone number format',
        severity: 'warning',
        timestamp: new Date(Date.now() - 3600000)
    },
    {
        id: '2',
        ruleId: '1',
        recordId: 'rec_002',
        field: 'email',
        value: 'invalid-email',
        error: 'Invalid email format',
        severity: 'error',
        timestamp: new Date(Date.now() - 1800000)
    }
]

const mockIntegrityChecks: DataIntegrityCheck[] = [
    {
        id: '1',
        name: 'Foreign Key Integrity',
        description: 'Checks referential integrity across tables',
        status: 'passed',
        lastRun: new Date(Date.now() - 3600000),
        duration: 1250,
        issues: 0,
        totalRecords: 15420
    },
    {
        id: '2',
        name: 'Duplicate Detection',
        description: 'Identifies duplicate records',
        status: 'failed',
        lastRun: new Date(Date.now() - 7200000),
        duration: 890,
        issues: 23,
        totalRecords: 15420
    },
    {
        id: '3',
        name: 'Data Type Consistency',
        description: 'Validates data types match schema',
        status: 'running',
        lastRun: new Date(),
        duration: 0,
        issues: 0,
        totalRecords: 15420
    },
    {
        id: '4',
        name: 'Null Value Analysis',
        description: 'Analyzes null value distribution',
        status: 'passed',
        lastRun: new Date(Date.now() - 1800000),
        duration: 450,
        issues: 0,
        totalRecords: 15420
    }
]

export function DataValidationSuite() {
    const [validationRules, setValidationRules] = useState<ValidationRule[]>(mockValidationRules)
    const [validationResults, setValidationResults] = useState<ValidationResult[]>(mockValidationResults)
    const [integrityChecks, setIntegrityChecks] = useState<DataIntegrityCheck[]>(mockIntegrityChecks)
    const [isRunningValidation, setIsRunningValidation] = useState(false)
    const [selectedRules, setSelectedRules] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterSeverity, setFilterSeverity] = useState<'all' | 'error' | 'warning' | 'info'>('all')
    const [showCreateRule, setShowCreateRule] = useState(false)

    const runValidation = async () => {
        setIsRunningValidation(true)

        // Simulate validation process
        setValidationRules(prev => prev.map(rule => ({
            ...rule,
            status: 'pending' as const,
            lastRun: new Date()
        })))

        await new Promise(resolve => setTimeout(resolve, 2000))

        setValidationRules(prev => prev.map(rule => ({
            ...rule,
            status: Math.random() > 0.7 ? 'failed' : 'passed'
        })))

        // Generate some mock results
        const newResults: ValidationResult[] = Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
            id: `new_${i}`,
            ruleId: validationRules[Math.floor(Math.random() * validationRules.length)].id,
            recordId: `rec_${Math.floor(Math.random() * 1000)}`,
            field: 'test_field',
            value: 'test_value',
            error: 'Validation error occurred',
            severity: (['error', 'warning', 'info'] as const)[Math.floor(Math.random() * 3)],
            timestamp: new Date()
        }))

        setValidationResults(prev => [...newResults, ...prev])
        setIsRunningValidation(false)
    }

    const runIntegrityCheck = async (checkId: string) => {
        setIntegrityChecks(prev => prev.map(check =>
            check.id === checkId
                ? { ...check, status: 'running' as const, lastRun: new Date() }
                : check
        ))

        // Simulate integrity check
        await new Promise(resolve => setTimeout(resolve, 3000))

        setIntegrityChecks(prev => prev.map(check =>
            check.id === checkId
                ? {
                    ...check,
                    status: Math.random() > 0.8 ? 'failed' : 'passed',
                    duration: Math.floor(Math.random() * 2000) + 500,
                    issues: Math.floor(Math.random() * 10)
                }
                : check
        ))
    }

    const toggleRule = (ruleId: string) => {
        setValidationRules(prev => prev.map(rule =>
            rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
        ))
    }

    const deleteRule = (ruleId: string) => {
        setValidationRules(prev => prev.filter(rule => rule.id !== ruleId))
    }

    const filteredResults = validationResults.filter(result => {
        const matchesSearch = result.error.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.field.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSeverity = filterSeverity === 'all' || result.severity === filterSeverity
        return matchesSearch && matchesSeverity
    })

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'passed': return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'failed': return <XCircle className="h-4 w-4 text-red-400" />
            case 'running': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
            case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-400" />
            default: return <AlertTriangle className="h-4 w-4 text-gray-400" />
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'error': return 'text-red-400 border-red-500/30'
            case 'warning': return 'text-yellow-400 border-yellow-500/30'
            case 'info': return 'text-blue-400 border-blue-500/30'
            default: return 'text-gray-400 border-gray-500/30'
        }
    }

    const overallHealth = {
        totalRules: validationRules.length,
        enabledRules: validationRules.filter(r => r.enabled).length,
        passingRules: validationRules.filter(r => r.status === 'passed').length,
        failingRules: validationRules.filter(r => r.status === 'failed').length,
        totalIssues: validationResults.length
    }

    return (
        <div className="space-y-6">
            {/* Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{overallHealth.totalRules}</p>
                                <p className="text-sm text-white/60">Total Rules</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{overallHealth.passingRules}</p>
                                <p className="text-sm text-white/60">Passing</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{overallHealth.failingRules}</p>
                                <p className="text-sm text-white/60">Failing</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-purple-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{overallHealth.enabledRules}</p>
                                <p className="text-sm text-white/60">Enabled</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{overallHealth.totalIssues}</p>
                                <p className="text-sm text-white/60">Issues</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Control Panel */}
            <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-white">Data Validation Suite</CardTitle>
                    <CardDescription className="text-white/60">
                        Comprehensive data validation and integrity checking
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={runValidation}
                            disabled={isRunningValidation}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isRunningValidation ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Running Validation...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Run Validation
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={() => setShowCreateRule(!showCreateRule)}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Rule
                        </Button>

                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export Results
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="rules" className="w-full">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="rules" className="data-[state=active]:bg-white/10">Validation Rules</TabsTrigger>
                    <TabsTrigger value="results" className="data-[state=active]:bg-white/10">Validation Results</TabsTrigger>
                    <TabsTrigger value="integrity" className="data-[state=active]:bg-white/10">Data Integrity</TabsTrigger>
                </TabsList>

                <TabsContent value="rules" className="mt-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-white">Validation Rules</CardTitle>
                            <CardDescription className="text-white/60">
                                Configure and manage data validation rules
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead className="text-white">Enabled</TableHead>
                                        <TableHead className="text-white">Rule Name</TableHead>
                                        <TableHead className="text-white">Type</TableHead>
                                        <TableHead className="text-white">Field</TableHead>
                                        <TableHead className="text-white">Severity</TableHead>
                                        <TableHead className="text-white">Status</TableHead>
                                        <TableHead className="text-white">Last Run</TableHead>
                                        <TableHead className="text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {validationRules.map((rule) => (
                                        <TableRow key={rule.id} className="border-white/5">
                                            <TableCell>
                                                <Checkbox
                                                    checked={rule.enabled}
                                                    onCheckedChange={() => toggleRule(rule.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-white font-medium">{rule.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-white/20 text-white/80">
                                                    {rule.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-white/80">{rule.field}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={getSeverityColor(rule.severity)}
                                                >
                                                    {rule.severity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(rule.status || 'pending')}
                                                    <span className="text-white/80 capitalize">{rule.status || 'pending'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-white/60 text-sm">
                                                {rule.lastRun?.toLocaleString() || 'Never'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-white/60 hover:text-white"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteRule(rule.id)}
                                                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="results" className="mt-6">
                    <Card className="border-white/10 bg-white/5 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-white">Validation Results</CardTitle>
                            <CardDescription className="text-white/60">
                                Review validation errors and warnings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                                        <Input
                                            placeholder="Search results..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                                        />
                                    </div>
                                </div>
                                <select
                                    value={filterSeverity}
                                    onChange={(e) => setFilterSeverity(e.target.value as any)}
                                    className="bg-white/5 border border-white/20 rounded px-3 py-2 text-white"
                                >
                                    <option value="all">All Severities</option>
                                    <option value="error">Errors</option>
                                    <option value="warning">Warnings</option>
                                    <option value="info">Info</option>
                                </select>
                            </div>

                            <ScrollArea className="h-[400px] w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10">
                                            <TableHead className="text-white">Severity</TableHead>
                                            <TableHead className="text-white">Field</TableHead>
                                            <TableHead className="text-white">Error</TableHead>
                                            <TableHead className="text-white">Record ID</TableHead>
                                            <TableHead className="text-white">Timestamp</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredResults.map((result) => (
                                            <TableRow key={result.id} className="border-white/5">
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={getSeverityColor(result.severity)}
                                                    >
                                                        {result.severity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-white font-medium">{result.field}</TableCell>
                                                <TableCell className="text-white/80">{result.error}</TableCell>
                                                <TableCell className="text-white/60">{result.recordId}</TableCell>
                                                <TableCell className="text-white/60 text-sm">
                                                    {result.timestamp.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrity" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {integrityChecks.map((check) => (
                            <Card key={check.id} className="border-white/10 bg-white/5 backdrop-blur">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center justify-between">
                                        <span>{check.name}</span>
                                        {getStatusIcon(check.status)}
                                    </CardTitle>
                                    <CardDescription className="text-white/60">
                                        {check.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-white/60">Status:</span>
                                                <span className="text-white ml-2 capitalize">{check.status}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/60">Issues:</span>
                                                <span className="text-white ml-2">{check.issues}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/60">Records:</span>
                                                <span className="text-white ml-2">{check.totalRecords.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/60">Duration:</span>
                                                <span className="text-white ml-2">{check.duration}ms</span>
                                            </div>
                                        </div>

                                        <div className="text-xs text-white/40">
                                            Last run: {check.lastRun.toLocaleString()}
                                        </div>

                                        <Button
                                            onClick={() => runIntegrityCheck(check.id)}
                                            disabled={check.status === 'running'}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            size="sm"
                                        >
                                            {check.status === 'running' ? (
                                                <>
                                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                    Running...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Run Check
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}