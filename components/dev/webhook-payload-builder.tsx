"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Code, Copy, Play, Save } from "lucide-react"

interface PayloadBuilderProps {
    onTestWebhook: (payload: any) => void
}

export function WebhookPayloadBuilder({ onTestWebhook }: PayloadBuilderProps) {
    const [payloadType, setPayloadType] = useState("new_order")
    const [payload, setPayload] = useState<any>({
        type: "new_order",
        account_first_name: "Test",
        account_last_name: "Customer",
        account_email: "test@example.com",
        account_phone: "+1234567890",
        event_name: "Summer Music Festival 2025",
        event_start: "2025-06-15T19:00:00Z",
        event_end: "2025-06-15T23:00:00Z",
        event_id: "event-001",
        items: [
            {
                item_id: "ticket-001",
                name: "General Admission",
                price: 45,
            }
        ],
        date_purchased: new Date().toISOString(),
        promo_code: "",
        subtotal: 45,
        total: 47.25,
        tracking_link: "PROMO001",
        order_number: `TEST-${Date.now()}`,
        update_date: new Date().toISOString(),
        cancelled: false,
        refunded: false,
        disputed: false,
        partialRefund: 0,
        custom_fields: [],
        isInPersonOrder: false,
    })

    const [isJsonValid, setIsJsonValid] = useState(true)
    const [jsonError, setJsonError] = useState("")

    const predefinedPayloads = {
        new_order: {
            type: "new_order",
            account_first_name: "Test",
            account_last_name: "Customer",
            account_email: "test@example.com",
            account_phone: "+1234567890",
            event_name: "Summer Music Festival 2025",
            event_start: "2025-06-15T19:00:00Z",
            event_end: "2025-06-15T23:00:00Z",
            event_id: "event-001",
            items: [
                {
                    item_id: "ticket-001",
                    name: "General Admission",
                    price: 45,
                }
            ],
            date_purchased: new Date().toISOString(),
            subtotal: 45,
            total: 47.25,
            tracking_link: "PROMO001",
            order_number: `TEST-${Date.now()}`,
            update_date: new Date().toISOString(),
            cancelled: false,
            refunded: false,
            disputed: false,
            partialRefund: 0,
            isInPersonOrder: false,
        },
        order_updated: {
            type: "order_updated",
            account_first_name: "Test",
            account_last_name: "Customer",
            account_email: "test@example.com",
            account_phone: "+1234567890",
            event_name: "Summer Music Festival 2025",
            event_start: "2025-06-15T19:00:00Z",
            event_end: "2025-06-15T23:00:00Z",
            event_id: "event-001",
            items: [
                {
                    item_id: "ticket-001",
                    name: "General Admission",
                    price: 45,
                }
            ],
            date_purchased: new Date().toISOString(),
            subtotal: 45,
            total: 47.25,
            tracking_link: "PROMO001",
            order_number: `TEST-${Date.now()}`,
            update_date: new Date().toISOString(),
            cancelled: false,
            refunded: false,
            disputed: false,
            partialRefund: 0,
            isInPersonOrder: false,
        },
        cancelled_order: {
            type: "order_updated",
            account_first_name: "Test",
            account_last_name: "Customer",
            account_email: "test@example.com",
            account_phone: "+1234567890",
            event_name: "Summer Music Festival 2025",
            event_start: "2025-06-15T19:00:00Z",
            event_end: "2025-06-15T23:00:00Z",
            event_id: "event-001",
            items: [
                {
                    item_id: "ticket-001",
                    name: "General Admission",
                    price: 45,
                }
            ],
            date_purchased: new Date().toISOString(),
            subtotal: 45,
            total: 47.25,
            tracking_link: "PROMO001",
            order_number: `TEST-${Date.now()}`,
            update_date: new Date().toISOString(),
            cancelled: true,
            refunded: false,
            disputed: false,
            partialRefund: 0,
            isInPersonOrder: false,
        }
    }

    const handlePresetChange = (type: string) => {
        setPayloadType(type)
        setPayload(predefinedPayloads[type as keyof typeof predefinedPayloads])
    }

    const handleJsonChange = (value: string) => {
        try {
            const parsed = JSON.parse(value)
            setPayload(parsed)
            setIsJsonValid(true)
            setJsonError("")
        } catch (error) {
            setIsJsonValid(false)
            setJsonError(error instanceof Error ? error.message : "Invalid JSON")
        }
    }

    const handleTestWebhook = () => {
        onTestWebhook(payload)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
        } catch (error) {
            console.error("Failed to copy to clipboard:", error)
        }
    }

    const formatJson = () => {
        try {
            // Simple JSON formatting
            const formatted = JSON.stringify(JSON.parse(JSON.stringify(payload)), null, 2)
            setPayload(JSON.parse(formatted))
        } catch (error) {
            console.error("Failed to format JSON:", error)
        }
    }

    const jsonString = JSON.stringify(payload, null, 2)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Preset Selection */}
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <h3 className="mb-4 text-lg font-semibold text-white">Preset Scenarios</h3>
                    <div className="space-y-3">
                        <div>
                            <Label className="text-white/60">Webhook Type</Label>
                            <Select value={payloadType} onValueChange={handlePresetChange}>
                                <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                    <SelectValue placeholder="Select webhook type" />
                                </SelectTrigger>
                                <SelectContent className="border-white/10 bg-white/5">
                                    <SelectItem value="new_order">New Order</SelectItem>
                                    <SelectItem value="order_updated">Order Updated</SelectItem>
                                    <SelectItem value="cancelled_order">Cancelled Order</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePresetChange("new_order")}
                                className={`border-white/20 text-white ${payloadType === "new_order" ? "bg-white/10" : ""}`}
                            >
                                New Order
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handlePresetChange("order_updated")}
                                className={`border-white/20 text-white ${payloadType === "order_updated" ? "bg-white/10" : ""}`}
                            >
                                Order Updated
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handlePresetChange("cancelled_order")}
                                className={`border-white/20 text-white ${payloadType === "cancelled_order" ? "bg-white/10" : ""}`}
                            >
                                Cancelled
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <h3 className="mb-4 text-lg font-semibold text-white">Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={handleTestWebhook} className="bg-green-500 hover:bg-green-600 text-white">
                            <Play className="mr-2 h-4 w-4" />
                            Test Webhook
                        </Button>
                        <Button variant="outline" onClick={copyToClipboard} className="border-white/20 text-white">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy JSON
                        </Button>
                        <Button variant="outline" onClick={formatJson} className="border-white/20 text-white">
                            <Code className="mr-2 h-4 w-4" />
                            Format JSON
                        </Button>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <Badge variant={isJsonValid ? "default" : "destructive"}>
                            {isJsonValid ? "Valid JSON" : "Invalid JSON"}
                        </Badge>
                        {!isJsonValid && (
                            <span className="text-sm text-red-400">{jsonError}</span>
                        )}
                    </div>
                </Card>
            </div>

            {/* JSON Editor */}
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">JSON Payload</h3>
                    <div className="text-sm text-white/60">
                        {Object.keys(payload).length} fields
                    </div>
                </div>
                <div className="relative">
                    <Textarea
                        value={jsonString}
                        onChange={(e) => handleJsonChange(e.target.value)}
                        className="min-h-[400px] font-mono text-sm border-white/20 bg-black text-white"
                        placeholder="Enter JSON payload..."
                    />
                    {!isJsonValid && (
                        <div className="absolute bottom-2 right-2 bg-red-500/20 border border-red-500/50 text-red-400 px-2 py-1 rounded text-sm">
                            JSON Error: {jsonError}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}