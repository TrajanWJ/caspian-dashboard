"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Clock, Activity, Trash2, Download, RefreshCw, Play } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { useState, useEffect } from "react"

interface WebhookLog {
  id: string
  timestamp: string
  type: string
  order_number: string
  promoter_id: string | null
  event_id: string
  success: boolean
  error_message?: string
  raw_data: any
}

interface Order {
  id: string
  order_number: string
  event_name?: string
  account_first_name?: string
  account_last_name?: string
  account_email?: string
  promo_code?: string
  items: Array<{ item_id: string; name: string; price: number }>
  subtotal: number
  total: number
  cancelled: boolean
  refunded: boolean
  received_at?: string
}

export default function WebhooksPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [liveFeed, setLiveFeed] = useState<Order[]>([])
  const [testPayload, setTestPayload] = useState(`{
  "type": "new_order",
  "account_first_name": "Test",
  "account_last_name": "User",
  "account_email": "test@example.com",
  "account_phone": "+15555555555",
  "account_instagram": "",
  "event_name": "Test Event Name",
  "event_start": "2025-07-16T12:54:32.288Z",
  "event_end": "2025-07-16T13:54:32.288Z",
  "event_id": "600000000000000000000000",
  "items": [
    {
      "item_id": "600000000000000000000001",
      "name": "Test Ticket",
      "price": 10
    }
  ],
  "date_purchased": "2025-07-16T12:54:32.288Z",
  "promo_code": "TESTCODE",
  "subtotal": 10,
  "total": 11,
  "tracking_link": "posh-tracking-test",
  "order_number": "1",
  "update_date": "2025-07-16T12:54:32.288Z",
  "cancelled": false,
  "refunded": false,
  "disputed": false,
  "partialRefund": 0,
  "custom_fields": [
    {
      "type": "input",
      "answer": "Test Answer",
      "prompt": "Test Prompt?"
    }
  ],
  "isInPersonOrder": false
}`)
  const [testResults, setTestResults] = useState("Click 'Send Test Webhook' to test...")

  useEffect(() => {
    loadData()
    startLiveFeed()
  }, [])

  const loadData = async () => {
    try {
      const [logsRes, ordersRes] = await Promise.all([
        fetch('/api/webhook-logs'),
        fetch('/api/orders')
      ])
      const [logsData, ordersData] = await Promise.all([
        logsRes.json(),
        ordersRes.json()
      ])
      setLogs(logsData)
      setOrders(ordersData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const startLiveFeed = () => {
    // Simulate live feed updates
    const interval = setInterval(async () => {
      try {
        const ordersRes = await fetch('/api/orders')
        const ordersData = await ordersRes.json()
        const recentOrders = ordersData
          .filter((o: any) => !o.cancelled && !o.refunded)
          .slice(0, 5)
        setLiveFeed(recentOrders)
      } catch (error) {
        console.error('Error updating live feed:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }

  const clearFeed = () => {
    setLiveFeed([])
  }

  const refreshFeed = () => {
    loadData()
  }

  const clearOrders = async () => {
    if (!confirm('Are you sure you want to clear all orders? This cannot be undone.')) return
    // In a real app, this would make an API call
    alert('Orders cleared (simulated)')
  }

  const clearEvents = async () => {
    if (!confirm('Are you sure you want to clear all webhook events? This cannot be undone.')) return
    // In a real app, this would make an API call
    alert('Events cleared (simulated)')
  }

  const exportOrders = () => {
    if (orders.length === 0) {
      alert('No orders to export')
      return
    }

    const csv = [
      ['Order Number', 'Event Name', 'Customer Name', 'Email', 'Promo Code', 'Tickets', 'Total', 'Status', 'Date'],
      ...orders.map(order => [
        order.order_number,
        order.event_name || '',
        `${order.account_first_name || ''} ${order.account_last_name || ''}`.trim(),
        order.account_email || '',
        order.promo_code || '',
        order.items.length,
        order.total || 0,
        order.cancelled ? 'Cancelled' : order.refunded ? 'Refunded' : 'Active',
        order.received_at || ''
      ])
    ]

    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'posh_orders.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const copyWebhookUrl = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/api/webhook/posh` : ""
    if (url) {
      await navigator.clipboard.writeText(url)
      alert('Webhook URL copied to clipboard!')
    }
  }

  const sendTestWebhook = async () => {
    try {
      const response = await fetch('/api/webhook/posh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: testPayload
      })

      const result = await response.json()
      setTestResults(`Status: ${response.status}\n\n${JSON.stringify(result, null, 2)}`)

      if (response.ok) {
        // Refresh data
        loadData()
      }
    } catch (error) {
      setTestResults(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(dateString))
  }

  const successCount = logs.filter((l) => l.success).length
  const failureCount = logs.filter((l) => !l.success).length
  const totalOrders = orders.filter(o => !o.cancelled && !o.refunded).length
  const totalRevenue = orders.filter(o => !o.cancelled && !o.refunded).reduce((sum, o) => sum + (o.total || 0), 0)
  const totalTickets = orders.filter(o => !o.cancelled && !o.refunded).reduce((sum, o) => sum + o.items.length, 0)
  const recentOrdersCount = orders.filter(o => {
    const orderDate = new Date(o.received_at || '')
    const dayAgo = new Date()
    dayAgo.setDate(dayAgo.getDate() - 1)
    return orderDate > dayAgo && !o.cancelled && !o.refunded
  }).length

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Sidebar variant="owner" />
        <div className="ml-64 flex items-center justify-center min-h-screen">
          <div className="text-white">Loading webhook data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <div className="ml-64">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12">
            <h1 className="mb-2 text-3xl font-bold text-white">Webhook Activity</h1>
            <p className="text-white/60">Monitor webhook events, view live sales feed, and manage order data</p>
          </div>

          {/* Live Feed Section */}
          <Card className="mb-8 border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-red-400">🔴 Live Sales Feed</h2>
              <div className="flex gap-2">
                <Button onClick={clearFeed} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Feed
                </Button>
                <Button onClick={refreshFeed} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {liveFeed.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <div className="text-4xl mb-2">⏳</div>
                  <div>Waiting for webhook data...</div>
                  <div className="text-sm">Sales will appear here in real-time</div>
                </div>
              ) : (
                liveFeed.map((order) => (
                  <Card key={order.id} className="border-white/10 bg-green-500/10 p-4 backdrop-blur animate-in slide-in-from-left-5">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">🎫</div>
                      <div className="flex-1">
                        <div className="font-bold text-white">New Order: {order.order_number}</div>
                        <div className="text-sm text-white/60">
                          {order.account_first_name} {order.account_last_name} - {formatCurrency(order.total || 0)} - {order.promo_code || 'No promo'}
                        </div>
                        <div className="text-xs text-white/40">
                          {order.received_at ? formatDateTime(order.received_at) : 'Just now'}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>

          {/* Stats Overview */}
          <div className="grid gap-6 sm:grid-cols-4 mb-8">
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white/60">Total Orders</span>
              </div>
              <div className="text-4xl font-bold text-white">{totalOrders}</div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white/60">Successful</span>
              </div>
              <div className="text-4xl font-bold text-green-400">{successCount}</div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-white/60">Failed</span>
              </div>
              <div className="text-4xl font-bold text-red-400">{failureCount}</div>
            </Card>
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-white/60">Recent (24h)</span>
              </div>
              <div className="text-4xl font-bold text-white">{recentOrdersCount}</div>
            </Card>
          </div>

          {/* Data Management Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-600">
              <TabsTrigger value="orders" className="data-[state=active]:bg-purple-600">Orders</TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-purple-600">Webhook Events</TabsTrigger>
              <TabsTrigger value="test" className="data-[state=active]:bg-purple-600">Test Webhook</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Order Data</h3>
                  <div className="flex gap-2">
                    <Button onClick={exportOrders} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button onClick={clearOrders} variant="outline" size="sm" className="text-red-400 border-red-400/30">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-white/60 font-medium">Order #</th>
                        <th className="text-left p-3 text-white/60 font-medium">Event</th>
                        <th className="text-left p-3 text-white/60 font-medium">Customer</th>
                        <th className="text-left p-3 text-white/60 font-medium">Promo Code</th>
                        <th className="text-left p-3 text-white/60 font-medium">Tickets</th>
                        <th className="text-left p-3 text-white/60 font-medium">Total</th>
                        <th className="text-left p-3 text-white/60 font-medium">Status</th>
                        <th className="text-left p-3 text-white/60 font-medium">Date</th>
                        <th className="text-left p-3 text-white/60 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-8 text-white/40">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="p-3 text-white">{order.order_number}</td>
                            <td className="p-3 text-white">{order.event_name || 'N/A'}</td>
                            <td className="p-3 text-white">
                              {order.account_first_name} {order.account_last_name}
                            </td>
                            <td className="p-3 text-white">{order.promo_code || 'N/A'}</td>
                            <td className="p-3 text-white">{order.items.length}</td>
                            <td className="p-3 text-white">{formatCurrency(order.total || 0)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${order.cancelled ? 'bg-red-500/20 text-red-400' :
                                order.refunded ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                {order.cancelled ? 'Cancelled' : order.refunded ? 'Refunded' : 'Active'}
                              </span>
                            </td>
                            <td className="p-3 text-white/60">
                              {order.received_at ? formatDateTime(order.received_at) : 'N/A'}
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" className="text-blue-400">
                                👁️
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Webhook Events</h3>
                  <Button onClick={clearEvents} variant="outline" size="sm" className="text-red-400 border-red-400/30">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-white/60 font-medium">Type</th>
                        <th className="text-left p-3 text-white/60 font-medium">Promoter</th>
                        <th className="text-left p-3 text-white/60 font-medium">Amount</th>
                        <th className="text-left p-3 text-white/60 font-medium">Status</th>
                        <th className="text-left p-3 text-white/60 font-medium">Timestamp</th>
                        <th className="text-left p-3 text-white/60 font-medium">Payload</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-white/40">
                            No webhook events found
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => (
                          <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="p-3 text-white">{log.type}</td>
                            <td className="p-3 text-white">{log.promoter_id || 'N/A'}</td>
                            <td className="p-3 text-white">
                              {log.raw_data?.total ? formatCurrency(log.raw_data.total) : 'N/A'}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${log.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {log.success ? 'Success' : 'Failed'}
                              </span>
                            </td>
                            <td className="p-3 text-white/60">{formatDateTime(log.timestamp)}</td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" className="text-blue-400">
                                📄
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Test Webhook Tab */}
            <TabsContent value="test">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Test Webhook</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Webhook URL:</label>
                    <div className="flex gap-2">
                      <Input
                        value={typeof window !== "undefined" ? `${window.location.origin}/api/webhook/posh` : ""}
                        readOnly
                        className="bg-gray-800 border-gray-600 text-white font-mono"
                      />
                      <Button onClick={copyWebhookUrl} variant="outline">
                        📋 Copy
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Test Payload:</label>
                    <Textarea
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      rows={20}
                      className="bg-gray-800 border-gray-600 text-white font-mono"
                      placeholder="Paste your webhook payload here..."
                    />
                    <Button onClick={sendTestWebhook} className="mt-4 w-full bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      Send Test Webhook
                    </Button>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Test Results:</h4>
                    <pre className="bg-gray-800 border border-gray-600 rounded p-4 text-white font-mono text-sm overflow-x-auto max-h-60">
                      {testResults}
                    </pre>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
