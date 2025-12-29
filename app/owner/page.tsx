"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { OwnerSidebar } from "@/components/owner-sidebar"
import {
  getPromoters,
  getOrders,
  getEvents,
  getWebhookLogs,
  type Promoter,
  type Order,
  type Event,
  type WebhookLog
} from "@/lib/mock-data"
import {
  TrendingUp,
  Ticket,
  Users,
  Calendar,
  Target,
  Copy,
  Settings,
  Link,
  Zap,
  Award,
  DollarSign,
  Crown,
  Activity,
  Webhook,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Download,
  RefreshCw,
  Play,
  TestTube,
  FileText,
  UserCheck,
  Shield,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  BarChart3,
  Database,
  TestTube as TestTubeIcon
} from "lucide-react"

export default function UnifiedOwnerDashboard() {
  const [promoters, setPromoters] = useState<Promoter[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [chartType, setChartType] = useState("revenue")
  const [chartPeriod, setChartPeriod] = useState("30")
  const [selectedPromoter, setSelectedPromoter] = useState<Promoter | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [promotersData, ordersData, eventsData, logsData] = await Promise.all([
        getPromoters(),
        getOrders(),
        getEvents(),
        getWebhookLogs()
      ])
      setPromoters(promotersData)
      setOrders(ordersData)
      setEvents(eventsData)
      setWebhookLogs(logsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
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

  // Calculate metrics
  const activeOrders = orders.filter(o => !o.cancelled && !o.refunded)
  const totalTickets = activeOrders.reduce((sum, o) => sum + o.items.length, 0)
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.subtotal, 0)
  const totalCommission = promoters.reduce((sum, p) => sum + p.total_commission_earned, 0)
  const netRevenue = totalRevenue - totalCommission
  const activePromoters = promoters.filter(p => p.total_tickets_sold > 0).length
  const currentEvent = events.find(e => e.is_current)
  const revenueChange = 12.5

  // Generate chart data
  const generateChartData = () => {
    const periods = parseInt(chartPeriod)
    const data = []
    for (let i = periods; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      let value
      switch (chartType) {
        case "revenue":
          value = totalRevenue * (0.7 + Math.random() * 0.6)
          break
        case "tickets":
          value = totalTickets * (0.7 + Math.random() * 0.6)
          break
        case "commission":
          value = totalCommission * (0.7 + Math.random() * 0.6)
          break
        default:
          value = 0
      }
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: Math.round(value)
      })
    }
    return data
  }

  const chartData = generateChartData()

  const pieData = [
    { name: "Net Revenue", value: netRevenue, color: "#03dac6" },
    { name: "Commission", value: totalCommission, color: "#bb86fc" }
  ]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum": return "from-cyan-500 to-blue-500"
      case "Gold": return "from-yellow-500 to-orange-500"
      case "Silver": return "from-gray-400 to-gray-600"
      case "Bronze": return "from-orange-600 to-red-600"
      default: return "from-gray-500 to-gray-700"
    }
  }

  const copyWebhookUrl = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/api/webhook/posh` : ""
    if (url) {
      await navigator.clipboard.writeText(url)
      alert('Webhook URL copied to clipboard!')
    }
  }

  const exportOrders = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <OwnerSidebar />
        <div className="ml-80">
          <div className="mx-auto max-w-[calc(100vw-24rem)] px-6 py-12">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-white text-xl">Loading dashboard...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <OwnerSidebar />
      <div className="ml-80">
        <div className="mx-auto max-w-[calc(100vw-24rem)] px-6 py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-gray-600 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
              <TabsTrigger value="management" className="data-[state=active]:bg-purple-600">Management</TabsTrigger>
              <TabsTrigger value="webhooks" className="data-[state=active]:bg-purple-600">Webhooks</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
              <TabsTrigger value="config" className="data-[state=active]:bg-purple-600">Config</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Hero Section */}
              <div className="mb-12">
                <div className="mb-2 text-sm font-medium uppercase tracking-wider text-white/40">Total Revenue</div>
                <div className="mb-8 flex items-baseline gap-6">
                  <div className="text-7xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
                  <div className="flex flex-col">
                    <div className="text-xl text-white/60">Net: {formatCurrency(netRevenue)}</div>
                    <div className="text-sm text-red-400">-{formatCurrency(totalCommission)} commission</div>
                  </div>
                </div>

                {/* Webhook Status Banner */}
                <Card className="mb-8 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Link className="text-2xl">🔗</Link>
                      <div>
                        <div className="text-sm font-medium text-white/60">Webhook Status</div>
                        <div className="font-mono text-sm text-purple-400">
                          {typeof window !== "undefined" ? `${window.location.origin}/api/webhook/posh` : "Not configured"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={copyWebhookUrl} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button onClick={() => setActiveTab("config")} variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Key Metrics */}
                <div className="grid gap-6 lg:grid-cols-5">
                  <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-white/60">Active Promoters</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{activePromoters}</div>
                    <div className="mt-1 text-xs text-white/40">of {promoters.length} total</div>
                  </Card>

                  <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="mb-2 flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-white/60">Total Tickets</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{totalTickets}</div>
                  </Card>

                  <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-white/60">Gross Revenue</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
                  </Card>

                  <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-400" />
                      <span className="text-sm text-white/60">Commission Paid</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{formatCurrency(totalCommission)}</div>
                  </Card>

                  <Card className={`border-white/10 bg-white/5 p-6 backdrop-blur ${revenueChange > 0 ? 'border-green-500/30' : revenueChange < 0 ? 'border-red-500/30' : ''}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingUp className={`h-4 w-4 ${revenueChange > 0 ? 'text-green-400' : revenueChange < 0 ? 'text-red-400' : 'text-gray-400'}`} />
                      <span className="text-sm text-white/60">Revenue Change</span>
                    </div>
                    <div className={`text-4xl font-bold ${revenueChange > 0 ? 'text-green-400' : revenueChange < 0 ? 'text-red-400' : 'text-white'}`}>
                      {revenueChange > 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                    </div>
                  </Card>
                </div>
              </div>

              {/* Current Event Highlight */}
              {currentEvent && (
                <div className="mb-12">
                  <div className="mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-white/60" />
                    <h2 className="text-lg font-medium text-white">Active Event</h2>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  </div>
                  <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 backdrop-blur">
                    <div className="mb-6">
                      <h3 className="mb-2 text-2xl font-bold text-white">{currentEvent.name}</h3>
                      <p className="text-white/60">
                        {new Date(currentEvent.start_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <div>
                        <div className="mb-1 text-sm text-white/40">TICKETS SOLD</div>
                        <div className="text-3xl font-bold text-white">{currentEvent.total_tickets_sold}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm text-white/40">REVENUE</div>
                        <div className="text-3xl font-bold text-white">{formatCurrency(currentEvent.total_revenue)}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm text-white/40">STATUS</div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          Active
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Top Performers */}
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">Top Performers</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                  {promoters
                    .sort((a, b) => b.total_tickets_sold - a.total_tickets_sold)
                    .slice(0, 6)
                    .map((promoter, idx) => (
                      <Card key={promoter.id} className="border-white/10 bg-white/5 p-6 backdrop-blur">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-lg font-bold text-white">
                              #{idx + 1}
                            </div>
                            <div>
                              <div className="font-bold text-white">
                                {promoter.first_name} {promoter.last_name}
                              </div>
                              <div className="text-sm text-white/60">{promoter.tracking_link}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">{promoter.total_tickets_sold}</div>
                            <div className="text-xs text-white/40">tickets</div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                          <div>
                            <div className="text-xs text-white/40">REVENUE</div>
                            <div className="font-semibold text-white">{formatCurrency(promoter.total_revenue_generated)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-white/40">COMMISSION</div>
                            <div className="font-semibold text-red-400">
                              {formatCurrency(promoter.total_commission_earned)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-white/40">TIER</div>
                            <div className="font-semibold text-white">{promoter.tier}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Real-time timestamp */}
              <div className="mt-8 text-center">
                <div className="text-sm text-white/40">
                  Last updated: {currentTime.toLocaleString()}
                </div>
              </div>
            </TabsContent>

            {/* Management Tab */}
            <TabsContent value="management" className="space-y-8">
              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">Management Center</h1>
                <p className="text-white/60">Manage promoters, accounts, and events</p>
              </div>

              {/* Management Stats */}
              <div className="grid gap-6 sm:grid-cols-4 mb-8">
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-2 text-sm text-white/40">Total Promoters</div>
                  <div className="text-4xl font-bold text-white">{promoters.length}</div>
                </Card>
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-2 text-sm text-white/40">Active Users</div>
                  <div className="text-4xl font-bold text-white">{activePromoters}</div>
                </Card>
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-2 text-sm text-white/40">Total Events</div>
                  <div className="text-4xl font-bold text-white">{events.length}</div>
                </Card>
                <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-2 text-sm text-white/40">Total Orders</div>
                  <div className="text-4xl font-bold text-white">{orders.length}</div>
                </Card>
              </div>

              {/* Promoters Management */}
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Promoters</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Promoter
                  </Button>
                </div>

                <div className="space-y-4">
                  {promoters.map((promoter) => (
                    <Card key={promoter.id} className="border-white/10 bg-white/5 p-6 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                            <UserCheck className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <div className="mb-1 flex items-center gap-3">
                              <h3 className="text-lg font-bold text-white">{promoter.first_name} {promoter.last_name}</h3>
                              <Badge className={`border bg-gradient-to-r ${getTierColor(promoter.tier)} text-white`}>
                                <Award className="h-3 w-3 mr-1" />
                                {promoter.tier}
                              </Badge>
                            </div>
                            <div className="text-sm text-white/60">{promoter.email}</div>
                            <div className="text-xs text-white/40">Tracking: {promoter.tracking_link}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-white/40">Performance</div>
                            <div className="text-lg font-bold text-white">
                              {promoter.total_tickets_sold} tickets
                            </div>
                            <div className="text-sm text-green-400">
                              {formatCurrency(promoter.total_revenue_generated)}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-900 border-gray-700">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Edit Promoter</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-white">First Name</label>
                                    <Input defaultValue={promoter.first_name} className="bg-gray-800 border-gray-600 text-white" />
                                  </div>
                                  <div>
                                    <label className="text-white">Last Name</label>
                                    <Input defaultValue={promoter.last_name} className="bg-gray-800 border-gray-600 text-white" />
                                  </div>
                                  <div>
                                    <label className="text-white">Email</label>
                                    <Input defaultValue={promoter.email} className="bg-gray-800 border-gray-600 text-white" />
                                  </div>
                                  <Button className="w-full">Update Promoter</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-900 border-gray-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">Delete Promoter</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-400">
                                    Are you sure you want to delete {promoter.first_name} {promoter.last_name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Webhooks Tab */}
            <TabsContent value="webhooks" className="space-y-8">
              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">Webhook Management</h1>
                <p className="text-white/60">Monitor webhook activity and manage order data</p>
              </div>

              {/* Live Feed Section */}
              <Card className="mb-8 border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-red-400">🔴 Live Sales Feed</h2>
                  <div className="flex gap-2">
                    <Button onClick={loadData} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-white/40">
                      <div className="text-4xl mb-2">⏳</div>
                      <div>Waiting for webhook data...</div>
                      <div className="text-sm">Sales will appear here in real-time</div>
                    </div>
                  ) : (
                    orders.slice(0, 5).map((order) => (
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

              {/* Webhook Events */}
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Webhook Events</h3>
                  <div className="flex gap-2">
                    <Button onClick={exportOrders} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-white/60 font-medium">Type</th>
                        <th className="text-left p-3 text-white/60 font-medium">Order #</th>
                        <th className="text-left p-3 text-white/60 font-medium">Promoter</th>
                        <th className="text-left p-3 text-white/60 font-medium">Amount</th>
                        <th className="text-left p-3 text-white/60 font-medium">Status</th>
                        <th className="text-left p-3 text-white/60 font-medium">Timestamp</th>
                        <th className="text-left p-3 text-white/60 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {webhookLogs.map((log) => (
                        <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-3 text-white">{log.type}</td>
                          <td className="p-3 text-white">{log.order_number}</td>
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
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-8">
              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-white/60">Advanced performance analytics and insights</p>
              </div>

              {/* Charts Section */}
              <div className="grid gap-6 lg:grid-cols-3 mb-8">
                <div className="lg:col-span-2">
                  <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">📈 Performance Analytics</h2>
                      <div className="flex gap-3">
                        <Select value={chartType} onValueChange={setChartType}>
                          <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="revenue">Revenue</SelectItem>
                            <SelectItem value="tickets">Tickets</SelectItem>
                            <SelectItem value="commission">Commission</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={chartPeriod} onValueChange={setChartPeriod}>
                          <SelectTrigger className="w-24 bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="7">7 Days</SelectItem>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="date" stroke="#b3b3b3" />
                          <YAxis stroke="#b3b3b3" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e1e1e",
                              border: "1px solid #333",
                              borderRadius: "8px"
                            }}
                            labelStyle={{ color: "#b3b3b3" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={chartType === "revenue" ? "#03dac6" : chartType === "tickets" ? "#bb86fc" : "#ffd700"}
                            strokeWidth={3}
                            dot={{ fill: chartType === "revenue" ? "#03dac6" : chartType === "tickets" ? "#bb86fc" : "#ffd700" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {/* Revenue Breakdown */}
                <div>
                  <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                    <h2 className="mb-6 text-xl font-bold text-white">💹 Revenue Breakdown</h2>
                    <div className="h-64 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e1e1e",
                              border: "1px solid #333",
                              borderRadius: "8px"
                            }}
                            formatter={(value) => formatCurrency(value)}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#03dac6]"></div>
                          <span className="text-sm text-white/60">Net Revenue</span>
                        </div>
                        <span className="font-bold text-white">{formatCurrency(netRevenue)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#bb86fc]"></div>
                          <span className="text-sm text-white/60">Commission</span>
                        </div>
                        <span className="font-bold text-white">{formatCurrency(totalCommission)}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Config Tab */}
            <TabsContent value="config" className="space-y-8">
              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">Configuration</h1>
                <p className="text-white/60">System settings and webhook configuration</p>
              </div>

              {/* Webhook Setup */}
              <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 backdrop-blur">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Webhook className="h-6 w-6 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Webhook Setup</h2>
                  </div>
                  <p className="text-white/60 mb-6">
                    Configure your Posh webhook endpoint to receive real-time order notifications.
                  </p>
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
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                      <div className="mb-4 flex items-center gap-2">
                        <TestTubeIcon className="h-5 w-5 text-green-400" />
                        <h3 className="font-bold text-white">Test Webhook</h3>
                      </div>
                      <p className="text-white/60 text-sm mb-4">
                        Send a test webhook to verify your configuration.
                      </p>
                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Send Test
                      </Button>
                    </Card>

                    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                      <div className="mb-4 flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-400" />
                        <h3 className="font-bold text-white">System Stats</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/60 text-sm">Total Orders:</span>
                          <span className="text-white font-medium">{orders.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60 text-sm">Total Revenue:</span>
                          <span className="text-white font-medium">{formatCurrency(totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60 text-sm">Active Promoters:</span>
                          <span className="text-white font-medium">{activePromoters}</span>
                        </div>
                      </div>
                    </Card>
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
