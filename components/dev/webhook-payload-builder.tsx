'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Play, Save, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface WebhookPayload {
    id: string
    name: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    url: string
    headers: Record<string, string>
    body: string
    createdAt: Date
}

const samplePayloads: WebhookPayload[] = [
    {
        id: '1',
        name: 'Order Created',
        method: 'POST',
        url: 'https://api.example.com/webhooks/order-created',
        headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': 'sha256=...'
        },
        body: JSON.stringify({
            event: 'order.created',
            data: {
                id: 'ord_123456',
                amount: 2999,
                currency: 'usd',
                customer: {
                    id: 'cus_123',
                    email: 'customer@example.com'
                },
                items: [
                    {
                        id: 'item_1',
                        name: 'Premium Widget',
                        quantity: 2,
                        price: 1499
                    }
                ]
            },
            timestamp: new Date().toISOString()
        }, null, 2),
        createdAt: new Date()
    },
    {
        id: '2',
        name: 'Payment Succeeded',
        method: 'POST',
        url: 'https://api.example.com/webhooks/payment-succeeded',
        headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': 'sha256=...'
        },
        body: JSON.stringify({
            event: 'payment.succeeded',
            data: {
                id: 'pay_123456',
                amount: 2999,
                currency: 'usd',
                status: 'succeeded',
                invoice: 'inv_123'
            },
            timestamp: new Date().toISOString()
        }, null, 2),
        createdAt: new Date()
    }
]

export function WebhookPayloadBuilder() {
    const [payloads, setPayloads] = useState<WebhookPayload[]>(samplePayloads)
    const [selectedPayload, setSelectedPayload] = useState<WebhookPayload | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const { toast } = useToast()

    const handleSave = () => {
        if (!selectedPayload) return

        if (isEditing) {
            setPayloads(prev => prev.map(p => p.id === selectedPayload.id ? selectedPayload : p))
        } else {
            const newPayload = {
                ...selectedPayload,
                id: Date.now().toString(),
                createdAt: new Date()
            }
            setPayloads(prev => [...prev, newPayload])
        }

        setIsEditing(false)
        toast({
            title: 'Payload saved',
            description: 'Your webhook payload has been saved successfully.'
        })
    }

    const handleDelete = (id: string) => {
        setPayloads(prev => prev.filter(p => p.id !== id))
        if (selectedPayload?.id === id) {
            setSelectedPayload(null)
        }
        toast({
            title: 'Payload deleted',
            description: 'The webhook payload has been removed.'
        })
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: 'Copied to clipboard',
            description: 'The payload has been copied to your clipboard.'
        })
    }

    const createNewPayload = () => {
        const newPayload: WebhookPayload = {
            id: '',
            name: 'New Payload',
            method: 'POST',
            url: '',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
            createdAt: new Date()
        }
        setSelectedPayload(newPayload)
        setIsEditing(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Webhook Payload Builder</h2>
                    <p className="text-muted-foreground">
                        Create and manage webhook payloads for testing
                    </p>
                </div>
                <Button onClick={createNewPayload}>
                    <Play className="w-4 h-4 mr-2" />
                    New Payload
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payload List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Saved Payloads</CardTitle>
                        <CardDescription>
                            Select a payload to edit or test
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {payloads.map((payload) => (
                            <div
                                key={payload.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedPayload?.id === payload.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                                onClick={() => setSelectedPayload(payload)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">{payload.name}</h4>
                                        <p className="text-sm text-muted-foreground">{payload.method} {payload.url}</p>
                                    </div>
                                    <Badge variant="outline">{payload.method}</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Payload Editor */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>
                            {selectedPayload ? (isEditing ? 'Edit Payload' : selectedPayload.name) : 'Select a Payload'}
                        </CardTitle>
                        {selectedPayload && (
                            <CardDescription>
                                Created {selectedPayload.createdAt.toLocaleDateString()}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        {selectedPayload ? (
                            <Tabs defaultValue="config" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="config">Configuration</TabsTrigger>
                                    <TabsTrigger value="body">Body</TabsTrigger>
                                    <TabsTrigger value="headers">Headers</TabsTrigger>
                                </TabsList>

                                <TabsContent value="config" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={selectedPayload.name}
                                                onChange={(e) => setSelectedPayload({ ...selectedPayload, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="method">Method</Label>
                                            <Select
                                                value={selectedPayload.method}
                                                onValueChange={(value: WebhookPayload['method']) =>
                                                    setSelectedPayload({ ...selectedPayload, method: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="GET">GET</SelectItem>
                                                    <SelectItem value="POST">POST</SelectItem>
                                                    <SelectItem value="PUT">PUT</SelectItem>
                                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="url">URL</Label>
                                        <Input
                                            id="url"
                                            value={selectedPayload.url}
                                            onChange={(e) => setSelectedPayload({ ...selectedPayload, url: e.target.value })}
                                            placeholder="https://api.example.com/webhook"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="body" className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Request Body</Label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopy(selectedPayload.body)}
                                            >
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={selectedPayload.body}
                                            onChange={(e) => setSelectedPayload({ ...selectedPayload, body: e.target.value })}
                                            rows={15}
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="headers" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Headers</Label>
                                        {Object.entries(selectedPayload.headers).map(([key, value]) => (
                                            <div key={key} className="flex gap-2">
                                                <Input
                                                    placeholder="Header name"
                                                    value={key}
                                                    onChange={(e) => {
                                                        const newHeaders = { ...selectedPayload.headers }
                                                        delete newHeaders[key]
                                                        newHeaders[e.target.value] = value
                                                        setSelectedPayload({ ...selectedPayload, headers: newHeaders })
                                                    }}
                                                />
                                                <Input
                                                    placeholder="Header value"
                                                    value={value}
                                                    onChange={(e) => setSelectedPayload({
                                                        ...selectedPayload,
                                                        headers: { ...selectedPayload.headers, [key]: e.target.value }
                                                    })}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newHeaders = { ...selectedPayload.headers }
                                                        delete newHeaders[key]
                                                        setSelectedPayload({ ...selectedPayload, headers: newHeaders })
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            onClick={() => setSelectedPayload({
                                                ...selectedPayload,
                                                headers: { ...selectedPayload.headers, '': '' }
                                            })}
                                        >
                                            Add Header
                                        </Button>
                                    </div>
                                </TabsContent>

                                <div className="flex gap-2 pt-4">
                                    <Button onClick={handleSave}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {isEditing ? 'Update' : 'Save'}
                                    </Button>
                                    {selectedPayload.id && (
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDelete(selectedPayload.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </Tabs>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Select a payload from the list or create a new one to get started
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}