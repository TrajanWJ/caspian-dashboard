import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Shield,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Database,
    FileText,
    RefreshCw,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Plus,
    Download,
    Upload,
    Hash,
    Link,
    Zap
} from "lucide-react"

interface ValidationRule {
    id: string
    name: string
    type: 'schema' | 'business' | 'integrity' | 'consistency'
    description: string
    status: 'active' | 'inactive' | 'failed'
    lastRun?: Date
    violations: number
    severity: 'low' | 'medium' | 'high' | 'critical'
}

interface DataIntegrityCheck {
    id: string
    table: string
    checkType: 'foreign_key' | 'unique' | 'not_null' | 'data_type' | 'range' | 'format'
    status: 'passed' | 'failed' | 'warning'
    message: string
    recordsAffected: number
    lastChecked: Date
}

interface SchemaValidation {
    id: string
    schemaName: string
    tableName: string
    fieldName: string
    expectedType: string
    actualType: string
    nullable: boolean
    status: 'valid' | 'invalid' | 'warning'
    errorMessage?: string
}

interface DataConsistencyReport {
    id: string
    checkName: string
    description: string
    status: 'passed' | 'failed' | 'warning'
    details: string
    affectedRecords: number
    timestamp: Date
}

export function DataValidationIntegrityChecks() {
    const [validationRules, setValidationRules] = useState<ValidationRule[]>([])
    const [integrityChecks, setIntegrityChecks] = useState<DataIntegrityCheck[]>([])
    const [schemaValidations, setSchemaValidations] = useState<SchemaValidation[]>([])
    const [consistencyReports, setConsistencyReports] = useState<DataConsistencyReport[]>([])
    const [isRunningChecks, setIsRunningChecks] = useState(false)
    const [selectedTab, setSelectedTab] = useState('rules')
    const [filterStatus, setFilterStatus] = useState<string>('all')

    // Initialize with sample data
    useEffect(() => {
        const sampleRules: ValidationRule[] = [
            {
                id: '1',
                name: 'Email Format Validation',
                type: 'business',
                description: 'Ensures all email addresses follow proper format',
                status: 'active',
                lastRun: new Date(Date.now() - 3600000),
                violations: 0,
                severity: 'medium'
            },
            {
                id: '2',
                name: 'Required Fields Check',
                type: 'schema',
                description: 'Validates that all required fields are populated',
                status: 'active',
                lastRun: new Date(Date.now() - 1800000),
                violations: 2,
                severity: 'high'
            },
            {
                id: '3',
                name: 'Foreign Key Integrity',
                type: 'integrity',
                description: 'Ensures foreign key relationships are maintained',
                status: 'active',
                lastRun: new Date(Date.now() - 900000),
                violations: 0,
                severity: 'critical'
            },
            {
                id: '4',
                name: 'Data Consistency Check',
                type: 'consistency',
                description: 'Validates data consistency across related tables',
                status: 'active',
                lastRun: new Date(Date.now() - 7200000),
                violations: 1,
                severity: 'medium'
            }
        ]

        const sampleIntegrityChecks: DataIntegrityCheck[] = [
            {
                id: '1',
                table: 'users',
                checkType: 'not_null',
                status: 'passed',
                message: 'All required fields are populated',
                recordsAffected: 0,
                lastChecked: new Date()
            },
            {
                id: '2',
                table: 'orders',
                checkType: 'foreign_key',
                status: 'failed',
                message: 'Found 3 orphaned records without valid user references',
                recordsAffected: 3,
                lastChecked: new Date()
            },
            {
                id: '3',
                table: 'webhooks',
                checkType: 'unique',
                status: 'passed',
                message: 'All webhook URLs are unique',
                recordsAffected: 0,
                lastChecked: new Date()
            },
            {
                id: '4',
                table: 'events',
                checkType: 'data_type',
                status: 'warning',
                message: 'Date fields contain some invalid formats',
                recordsAffected: 5,
                lastChecked: new Date()
            }
        ]

        const sampleSchemaValidations: SchemaValidation[] = [
            {
                id: '1',
                schemaName: 'public',
                tableName: 'users',
                fieldName: 'email',
                expectedType: 'VARCHAR(255)',
                actualType: 'VARCHAR(255)',
                nullable: false,
                status: 'valid'
            },
            {
                id: '2',
                schemaName: 'public',
                tableName: 'users',
                fieldName: 'created_at',
                expectedType: 'TIMESTAMP',
                actualType: 'TIMESTAMP',
                nullable: false,
                status: 'valid'
            },
            {
                id: '3',
                schemaName: 'public',
                tableName: 'orders',
                fieldName: 'amount',
                expectedType: 'DECIMAL(10,2)',
                actualType: 'VARCHAR(50)',
                nullable: false,
                status: 'invalid',
                errorMessage: 'Data type mismatch: expected DECIMAL, found VARCHAR'
            }
        ]

        const sampleConsistencyReports: DataConsistencyReport[] = [
            {
                id: '1',
                checkName: 'User-Order Relationship',
                description: 'Ensures all orders have valid user references',
                status: 'failed',
                details: 'Found 3 orders with invalid user_id references',
                affectedRecords: 3,
                timestamp: new Date()
            },
            {
                id: '2',
                checkName: 'Webhook-Event Consistency',
                description: 'Validates webhook configurations match event types',
                status: 'passed',
                details: 'All webhook configurations are consistent with event types',
                affectedRecords: 0,
                timestamp: new Date()
            },
            {
                id: '3',
                checkName: 'Credit Balance Validation',
                description: 'Ensures credit balances are non-negative and consistent',
                status: 'warning',
                details: 'Found 2 users with negative credit balances',
                affectedRecords: 2,
                timestamp: new Date()
            }
        ]

        setValidationRules(sampleRules)
        setIntegrityChecks(sampleIntegrityChecks)
        setSchemaValidations(sampleSchemaValidations)
        setConsistencyReports(sampleConsistencyReports)
    }, [])

    const runAllChecks = async () => {
        setIsRunningChecks(true)

        // Simulate running checks
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Update timestamps and potentially change some statuses
        setValidationRules(prev => prev.map(rule => ({
            ...rule,
            lastRun: new Date(),
            violations: Math.floor(Math.random() * 5)
        })))

        setIntegrityChecks(prev => prev.map(check => ({
            ...check,
            lastChecked: new Date(),
            status: Math.random() > 0.7 ? 'failed' : Math.random() > 0.4 ? 'warning' : 'passed'
        })))

        setConsistencyReports(prev => prev.map(report => ({
            ...report,
            timestamp: new Date(),
            status: Math.random() > 0.8 ? 'failed' : Math.random() > 0.5 ? 'warning' : 'passed'
        })))

        setIsRunningChecks(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'passed':
            case 'valid':
            case 'active':
                return 'text-green-400'
            case 'failed':
            case 'invalid':
                return 'text-red-400'
            case 'warning':
                return 'text-yellow-400'
            case 'inactive':
                return 'text-gray-400'
            default:
                return 'text-white/60'
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'text-red-400'
            case 'high':
                return 'text-orange-400'
            case 'medium':
                return 'text-yellow-400'
            case 'low':
                return 'text-green-400'
            default:
                return 'text-white/60'
        }
    }

    const filteredRules = validationRules.filter(rule =>
        filterStatus === 'all' || rule.status === filterStatus
    )

    const filteredIntegrityChecks = integrityChecks.filter(check =>
        filterStatus === 'all' || check.status === filterStatus
    )

    const filteredSchemaValidations = schemaValidations.filter(validation =>
        filterStatus === 'all' || validation.status === filterStatus
    )

    const filteredConsistencyReports = consistencyReports.filter(report =>
        filterStatus === 'all' || report.status === filterStatus
    )

    return (
        <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Shield className="h-5 w-5" />
                        Data Validation & Integrity Checks
                    </CardTitle>
                    <CardDescription className="text-white/60">
                        Validate data integrity, schema compliance, and business rules across your application
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Alert className="border-blue-500/20 bg-blue-500/10">
                        <Database className="h-4 w-4" />
                        <AlertDescription className="text-blue-200">
                            Monitor data quality, enforce business rules, and maintain database integrity
                            to ensure reliable application performance.
                        </AlertDescription>
                    </Alert>

                    <div className="flex gap-4">
                        <Button onClick={runAllChecks} disabled={isRunningChecks}>
                            {isRunningChecks ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Running Checks...
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 h-4 w-4" />
                                    Run All Checks
                                </>
                            )}
                        </Button>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="passed">Passed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-white/10">
                            <TabsTrigger value="rules" className="text-white data-[state=active]:bg-white/20">
                                <FileText className="mr-2 h-4 w-4" />
                                Validation Rules
                            </TabsTrigger>
                            <TabsTrigger value="integrity" className="text-white data-[state=active]:bg-white/20">
                                <Link className="mr-2 h-4 w-4" />
                                Integrity Checks
                            </TabsTrigger>
                            <TabsTrigger value="schema" className="text-white data-[state=active]:bg-white/20">
                                <Database className="mr-2 h-4 w-4" />
                                Schema Validation
                            </TabsTrigger>
                            <TabsTrigger value="consistency" className="text-white data-[state=active]:bg-white/20">
                                <Hash className="mr-2 h-4 w-4" />
                                Consistency Reports
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="rules" className="space-y-4">
                            <ScrollArea className="h-96">
                                <div className="space-y-2">
                                    {filteredRules.map((rule) => (
                                        <Card key={rule.id} className="border-white/10 bg-white/5">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-blue-400">
                                                            {rule.type}
                                                        </Badge>
                                                        <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                                                            {rule.severity}
                                                        </Badge>
                                                        <Badge variant="outline" className={getStatusColor(rule.status)}>
                                                            {rule.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-white/60 text-sm">
                                                        Violations: {rule.violations}
                                                    </div>
                                                </div>

                                                <div className="text-white font-medium mb-2">{rule.name}</div>
                                                <div className="text-white/80 text-sm mb-2">{rule.description}</div>

                                                {rule.lastRun && (
                                                    <div className="text-white/60 text-sm">
                                                        Last run: {rule.lastRun.toLocaleString()}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="integrity" className="space-y-4">
                            <ScrollArea className="h-96">
                                <div className="space-y-2">
                                    {filteredIntegrityChecks.map((check) => (
                                        <Card key={check.id} className="border-white/10 bg-white/5">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-purple-400">
                                                            {check.table}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-cyan-400">
                                                            {check.checkType}
                                                        </Badge>
                                                        <Badge variant="outline" className={getStatusColor(check.status)}>
                                                            {check.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-white/60 text-sm">
                                                        Affected: {check.recordsAffected}
                                                    </div>
                                                </div>

                                                <div className="text-white/80 text-sm mb-2">{check.message}</div>

                                                <div className="text-white/60 text-sm">
                                                    Last checked: {check.lastChecked.toLocaleString()}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="schema" className="space-y-4">
                            <ScrollArea className="h-96">
                                <div className="space-y-2">
                                    {filteredSchemaValidations.map((validation) => (
                                        <Card key={validation.id} className="border-white/10 bg-white/5">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge variant="outline" className={getStatusColor(validation.status)}>
                                                        {validation.status}
                                                    </Badge>
                                                </div>

                                                <div className="text-white font-medium mb-2">
                                                    {validation.schemaName}.{validation.tableName}.{validation.fieldName}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-2">
                                                    <div>
                                                        <div className="text-white/60 text-sm">Expected Type</div>
                                                        <div className="text-white text-sm">{validation.expectedType}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-white/60 text-sm">Actual Type</div>
                                                        <div className="text-white text-sm">{validation.actualType}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-white/60 text-sm">Nullable:</span>
                                                    <Badge variant="outline" className={validation.nullable ? 'text-yellow-400' : 'text-green-400'}>
                                                        {validation.nullable ? 'Yes' : 'No'}
                                                    </Badge>
                                                </div>

                                                {validation.errorMessage && (
                                                    <Alert className="border-red-500/20 bg-red-500/10">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <AlertDescription className="text-red-200">
                                                            {validation.errorMessage}
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="consistency" className="space-y-4">
                            <ScrollArea className="h-96">
                                <div className="space-y-2">
                                    {filteredConsistencyReports.map((report) => (
                                        <Card key={report.id} className="border-white/10 bg-white/5">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge variant="outline" className={getStatusColor(report.status)}>
                                                        {report.status}
                                                    </Badge>
                                                    <div className="text-white/60 text-sm">
                                                        Affected: {report.affectedRecords}
                                                    </div>
                                                </div>

                                                <div className="text-white font-medium mb-2">{report.checkName}</div>
                                                <div className="text-white/80 text-sm mb-2">{report.description}</div>
                                                <div className="text-white/60 text-sm mb-2">{report.details}</div>

                                                <div className="text-white/60 text-sm">
                                                    {report.timestamp.toLocaleString()}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}