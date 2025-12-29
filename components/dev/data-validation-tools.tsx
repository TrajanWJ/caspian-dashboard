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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    CheckCircle,
    AlertTriangle,
    XCircle,
    Database,
    FileText,
    Shield,
    RefreshCw,
    Download,
    Upload,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Plus,
    Settings,
    Zap,
    Clock,
    Activity,
    Play
} from "lucide-react"

interface ValidationRule {
    id: string
    name: string
    type: 'schema' | 'business' | 'security' | 'performance'
    target: 'events' | 'promoters' | 'orders' | 'webhooks' | 'all'
    enabled: boolean
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    lastRun?: Date
    status?: 'passed' | 'failed' | 'warning'
    violations?: number
}

interface ValidationResult {
    id: string
    ruleId: string
    timestamp: Date
    dataType: string
    recordId: string
    field: string
    value: any
    error: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    resolved: boolean
}

interface DataIntegrityCheck {
    id: string
    name: string
    type: 'consistency' | 'referential' | 'uniqueness' | 'completeness'
    status: 'idle' | 'running' | 'completed' | 'failed'
    lastRun?: Date
    duration?: number
    issues: number
    totalRecords: number
    progress: number
}

const mockRules: ValidationRule[] = [
    {
        id: '1',
        name: 'Event Date Validation',
        type: 'business',
        target: 'events',
        enabled: true,
        severity: 'high',
        description: 'Ensures event dates are in the future and properly formatted',
        lastRun: new Date(Date.now() - 3600000),
        status: 'passed',
        violations: 0
    },
    {
        id: '2',
        name: 'Promoter Email Format',
        type: 'schema',
        target: 'promoters',
        enabled: true,
        severity: 'medium',
        description: 'Validates email format for all promoter records',
        lastRun: new Date(Date.now() - 1800000),
        status: 'warning',
        violations: 3
    },
    {
        id: '3',
        name: 'Webhook Security Headers',
        type: 'security',
        target: 'webhooks',
        enabled: true,
        severity: 'critical',
        description: 'Checks for required security headers in webhook configurations',
        lastRun: new Date(Date.now() - 7200000),
        status: 'failed',
        violations: 12
    },
    {
        id: '4',
        name: 'Order Amount Range',
        type: 'business',
        target: 'orders',
        enabled: false,
        severity: 'medium',
        description: 'Validates order amounts are within acceptable ranges',
        lastRun: new Date(Date.now() - 86400000),
        status: 'passed',
        violations: 0
    }
]

const mockResults: ValidationResult[] = [
    {
        id: '1',
        ruleId: '2',
        timestamp: new Date(Date.now() - 1800000),
        dataType: 'promoters',
        recordId: 'promoter_123',
        field: 'email',
        value: 'invalid-email',
        error: 'Invalid email format',
        severity: 'medium',
        resolved: false
    },
    {
        id: '2',
        ruleId: '2',
        timestamp: new Date(Date.now() - 1800000),
        dataType: 'promoters',
        recordId: 'promoter_456',
        field: 'email',
        value: 'another@invalid',
        error: 'Invalid email format',
        severity: 'medium',
        resolved: false
    },
    {
        id: '3',
        ruleId: '3',
        timestamp: new Date(Date.now() - 7200000),
        dataType: 'webhooks',
        recordId: 'webhook_789',
        field: 'headers',
        value: null,
        error: 'Missing required security headers',
        severity: 'critical',
        resolved: false
    }
]

const mockIntegrityChecks: DataIntegrityCheck[] = [
    {
        id: '1',
        name: 'Referential Integrity - Events to Promoters',
        type: 'referential',
        status: 'completed',
        lastRun: new Date(Date.now() - 3600000),
        duration: 45000,
        issues: 0,
        totalRecords: 1250,
        progress: 100
    },
    {
        id: '2',
        name: 'Data Completeness Check',
        type: 'completeness',
        status: 'running',
        lastRun: new Date(Date.now() - 300000),
        duration: 30000,
        issues: 5,
        totalRecords: 2500,
        progress: 75
    },
    {
        id: '3',
        name: 'Unique Constraint Validation',
        type: 'uniqueness',
        status: 'idle',
        issues: 0,
        totalRecords: 0,
        progress: 0
    }
]

export function DataValidationTools() {
    const [rules, setRules] = useState<ValidationRule[]>(mockRules)
    const [results, setResults] = useState<ValidationResult[]>(mockResults)
    const [integrityChecks, setIntegrityChecks] = useState<DataIntegrityCheck[]>(mockIntegrityChecks)
    const [selectedRule, setSelectedRule] = useState<ValidationRule | null>(null)
    const [filterSeverity, setFilterSeverity] = useState<string>('all')
    const [filterType, setFilterType] = useState<string>('all')
    const [isRunningValidation, setIsRunningValidation] = useState(false)

    const runValidation = async (ruleId?: string) => {
        setIsRunningValidation(true)

        // Simulate validation run
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Update rule status
        setRules(prev => prev.map(rule => {
            if (!ruleId || rule.id === ruleId) {
                const violations = Math.floor(Math.random() * 10)
                return {
                    ...rule,
                    lastRun: new Date(),
                    status: violations === 0 ? 'passed' : violations < 5 ? 'warning' : 'failed',
                    violations
                }
            }
            return rule
        }))

        setIsRunningValidation(false)
    }

    const runIntegrityCheck = async (checkId: string) => {
        setIntegrityChecks(prev => prev.map(check =>
            check.id === checkId
                ? { ...check, status: 'running', lastRun: new Date() }
                : check
        ))

        // Simulate integrity check
        const check = integrityChecks.find(c => c.id === checkId)
        if (!check) return

        const duration = Math.random() * 60000 + 30000 // 30-90 seconds

        // Update progress
        const progressInterval = setInterval(() => {
            setIntegrityChecks(prev => prev.map(c =>
                c.id === checkId
                    ? { ...c, progress: Math.min(c.progress + Math.random() * 20, 95) }
                    : c
            ))
        }, 1000)

        await new Promise(resolve => setTimeout(resolve, duration))

        clearInterval(progressInterval)

        // Complete check
        const issues = Math.floor(Math.random() * 20)
        setIntegrityChecks(prev => prev.map(c =>
            c.id === checkId
                ? {
                    ...c,
                    status: 'completed',
                    duration,
                    issues,
                    totalRecords: Math.floor(Math.random() * 5000 + 1000),
                    progress: 100
                }
                : c
        ))
    }

    const resolveViolation = (resultId: string) => {
        setResults(prev => prev.map(result =>
            result.id === resultId
                ? { ...result, resolved: true }
                : result
        ))
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-red-400 border-red-400'
            case 'high': return 'text-orange-400 border-orange-400'
            case 'medium': return 'text-yellow-400 border-yellow-400'
            case 'low': return 'text-green-400 border-green-400'
            default: return 'text-gray-400 border-gray-400'
        }
    }

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'passed': return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />
            case 'failed': return <XCircle className="h-4 w-4 text-red-400" />
            default: return <Clock className="h-4 w-4 text-gray-400" />
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'schema': return <Database className="h-4 w-4" />
            case 'business': return <FileText className="h-4 w-4" />
            case 'security': return <Shield className="h-4 w-4" />
            case 'performance': return <Zap className="h-4 w-4" />
            default: return <Settings className="h-4 w-4" />
        }
    }

    const filteredResults = results.filter(result => {
        if (filterSeverity !== 'all' && result.severity !== filterSeverity) return false
        return true
    })

    const activeViolations = results.filter(r => !r.resolved).length
    const criticalViolations = results.filter(r => !r.resolved && r.severity === 'critical').length

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <div>
                                <p className="text-lg font-bold text-white">
                                    {rules.filter(r => r.status === 'passed').length}
                                </p>
                                <p className="text-sm text-white/60">Passing Rules</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                            <div>
                                <p className="text-lg font-bold text-white">
                                    {rules.filter(r => r.status === 'warning').length}
                                </p>
                                <p className="text-sm text-white/60">Warnings</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-400" />
                            <div>
                                <p className="text-lg font-bold text-white">
                                    {rules.filter(r => r.status === 'failed').length}
                                </p>
                                <p className="text-sm text-white/60">Failed Rules</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-400" />
                            <div>
                                <p className="text-lg font-bold text-white">{activeViolations}</p>
                                <p className="text-sm text-white/60">Active Violations</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Critical Alerts */}
            {criticalViolations > 0 && (
                <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-200">
                        {criticalViolations} critical data validation violations detected. Immediate attention required.
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="rules" className="w-full">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="rules" className="data-[state=active]:bg-white/10">Validation Rules</TabsTrigger>
                    <TabsTrigger value="results" className="data-[state=active]:bg-white/10">Validation Results</TabsTrigger>
                    <TabsTrigger value="integrity" className="data-[state=active]:bg-white/10">Data Integrity</TabsTrigger>
                </TabsList>

                <TabsContent value="rules" className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => runValidation()}
                                disabled={isRunningValidation}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${isRunningValidation ? 'animate-spin' : ''}`} />
                                Run All Validations
                            </Button>
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Rule
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/20">
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="schema">Schema</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="security">Security</SelectItem>
                                    <SelectItem value="performance">Performance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card className="border-white/10 bg-white/5 backdrop-blur">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead className="text-white">Rule Name</TableHead>
                                        <TableHead className="text-white">Type</TableHead>
                                        <TableHead className="text-white">Target</TableHead>
                                        <TableHead className="text-white">Severity</TableHead>
                                        <TableHead className="text-white">Status</TableHead>
                                        <TableHead className="text-white">Violations</TableHead>
                                        <TableHead className="text-white">Last Run</TableHead>
                                        <TableHead className="text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rules
                                        .filter(rule => filterType === 'all' || rule.type === filterType)
                                        .map((rule) => (
                                            <TableRow key={rule.id} className="border-white/5">
                                                <TableCell className="text-white font-medium">{rule.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getTypeIcon(rule.type)}
                                                        <span className="text-white/80 capitalize">{rule.type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-white/80 capitalize">{rule.target}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`border ${getSeverityColor(rule.severity)}`}
                                                    >
                                                        {rule.severity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(rule.status)}
                                                        <span className="text-white/80 capitalize">{rule.status || 'not run'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-white/80">{rule.violations || 0}</TableCell>
                                                <TableCell className="text-white/80">
                                                    {rule.lastRun ? rule.lastRun.toLocaleString() : 'Never'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => runValidation(rule.id)}
                                                            disabled={isRunningValidation}
                                                            variant="outline"
                                                            className="border-white/20 text-white hover:bg-white/10"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setSelectedRule(rule)}
                                                            variant="outline"
                                                            className="border-white/20 text-white hover:bg-white/10"
                                                        >
                                                            <Eye className="h-4 w-4" />
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
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <Download className="mr-2 h-4 w-4" />
                                Export Results
                            </Button>
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear Resolved
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                                <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/20">
                                    <SelectItem value="all">All Severities</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card className="border-white/10 bg-white/5 backdrop-blur">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead className="text-white">Timestamp</TableHead>
                                        <TableHead className="text-white">Data Type</TableHead>
                                        <TableHead className="text-white">Field</TableHead>
                                        <TableHead className="text-white">Error</TableHead>
                                        <TableHead className="text-white">Severity</TableHead>
                                        <TableHead className="text-white">Status</TableHead>
                                        <TableHead className="text-white">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredResults.map((result) => (
                                        <TableRow key={result.id} className="border-white/5">
                                            <TableCell className="text-white/80">
                                                {result.timestamp.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-white/80 capitalize">{result.dataType}</TableCell>
                                            <TableCell className="text-white font-mono text-sm">{result.field}</TableCell>
                                            <TableCell className="text-white/80 max-w-xs truncate" title={result.error}>
                                                {result.error}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`border ${getSeverityColor(result.severity)}`}
                                                >
                                                    {result.severity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`border ${result.resolved ? 'text-green-400' : 'text-yellow-400'}`}
                                                >
                                                    {result.resolved ? 'Resolved' : 'Open'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {!result.resolved && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => resolveViolation(result.id)}
                                                            variant="outline"
                                                            className="border-white/20 text-white hover:bg-white/10"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-white/20 text-white hover:bg-white/10"
                                                    >
                                                        <Eye className="h-4 w-4" />
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

                <TabsContent value="integrity" className="mt-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Integrity Check
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Run All Checks
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {integrityChecks.map((check) => (
                            <Card key={check.id} className="border-white/10 bg-white/5 backdrop-blur">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Database className="h-5 w-5 text-blue-400" />
                                            <CardTitle className="text-white text-lg">{check.name}</CardTitle>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`border-white/20 ${check.status === 'completed' ? 'text-green-400' :
                                                check.status === 'running' ? 'text-blue-400' :
                                                    check.status === 'failed' ? 'text-red-400' : 'text-gray-400'
                                                }`}
                                        >
                                            {check.status}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-white/60 capitalize">
                                        {check.type} check • {check.totalRecords.toLocaleString()} records
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {check.status === 'running' && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white/80">Progress</span>
                                                    <span className="text-white/80">{check.progress.toFixed(0)}%</span>
                                                </div>
                                                <Progress value={check.progress} className="h-2" />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-white/60">Issues Found</p>
                                                <p className="text-lg font-bold text-white">{check.issues}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/60">Total Records</p>
                                                <p className="text-lg font-bold text-white">{check.totalRecords.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/60">Last Run</p>
                                                <p className="text-white/80">
                                                    {check.lastRun ? check.lastRun.toLocaleString() : 'Never'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-white/60">Duration</p>
                                                <p className="text-white/80">
                                                    {check.duration ? `${(check.duration / 1000).toFixed(1)}s` : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                onClick={() => runIntegrityCheck(check.id)}
                                                disabled={check.status === 'running'}
                                                variant="outline"
                                                className="border-white/20 text-white hover:bg-white/10"
                                            >
                                                {check.status === 'running' ? (
                                                    <>
                                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                        Running...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="mr-2 h-4 w-4" />
                                                        Run Check
                                                    </>
                                                )}
                                            </Button>
                                        </div>
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