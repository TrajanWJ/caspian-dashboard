"use client"

import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Database,
    RefreshCw,
    Calendar,
    Users,
    Ticket,
    DollarSign,
    Activity,
    TrendingUp,
    Search
} from "lucide-react"
import { useEffect, useState } from "react"

interface DatabaseEvent {
    id: string
    name: string
    event_id: string
    status: "active" | "upcoming" | "completed"
    total_revenue: number
    ticket_count: number
    promoter_count: number
    created_at: string
    last_sale_at: string | null
}

interface DatabaseOrder {
    id: string
    order_number: string
    event_name: string
    account_name: string
    account_email: string
    total: number
    items_count: number
    promoter_tracking_link: string | null
    processed_at: string
    status: "completed" | "cancelled" | "refunded"
}

interface DatabasePromoter {
    id: string
    tracking_link: string
    name: string
    email: string
    tier: "Bronze" | "Silver" | "Gold" | "Platinum"
    total_tickets_sold: number
    total_revenue_generated: number
    total_commission_earned: number
    active_events: number
    created_at: string
    last_sale_at: string | null
}

interface DatabaseMetrics {
    totalEvents: number
    totalOrders: number
    totalRevenue: number
    totalTicketsSold: number
    totalPromoters: number
    lastUpdated: string
}

export default function DevDatabasePage() {
    // Development mode check - only accessible in development
    if (process.env.NODE_ENV !== "development" && !process.env.VERCEL_URL?.includes("localhost")) {
        notFound()
    }

    const [activeTab, setActiveTab] = useState("events")
    const [events, setEvents] = useState<DatabaseEvent[]>([])
    const [orders, setOrders] = useState<DatabaseOrder[]>([])
    const [promoters, setPromoters] = useState<DatabasePromoter[]>([])
    const [metrics, setMetrics] = useState<DatabaseMetrics>({
        totalEvents: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalTicketsSold: 0,
        totalPromoters: 0,
        lastUpdated: new Date().toISOString()
    })
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchDatabaseData = async () => {
        try {
            setIsLoading(true)

            // Fetch events
            const eventsResponse = await fetch('/api/events')
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json()
                setEvents(eventsData)
            }

            // Fetch orders
            const ordersResponse = await fetch('/api/orders')
            if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json()
                setOrders(ordersData)
            }

            // Fetch promoters
            const promotersResponse = await fetch('/api/promoters')
            if (promotersResponse.ok) {
                const promotersData = await promotersResponse.json()
                setPromoters(promotersData)
            }

            // Calculate metrics
            const totalOrders = orders.length
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
            const totalTicketsSold = orders.reduce((sum, order) => sum + (order.items_count || 0), 0)
            const totalPromoters = new Set(orders.map(order => order.promoter_tracking_link).filter(Boolean)).size

            setMetrics({
                totalEvents: events.length,
                totalOrders,
                totalRevenue,
                totalTicketsSold,
                totalPromoters,
                lastUpdated: new Date().toISOString()
            })

        } catch (error) {
            console.error('Error fetching database data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDatabaseData()
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'completed':
                return 'bg-green-500'
            case 'upcoming':
                return 'bg-blue-500'
            case 'cancelled':
            case 'refunded':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Platinum':
                return 'bg-purple-500'
            case 'Gold':
                return 'bg-yellow-500'
            case 'Silver':
                return 'bg-gray-400'
            case 'Bronze':
                return 'bg-orange-500'
            default:
                return 'bg-gray-500'
        }
    }

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.event_id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredOrders = orders.filter(order =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.event_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredPromoters = promoters.filter(promoter =>
        promoter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promoter.tracking_link.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promoter.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-4xl font-bold text-foreground">Database Management Center</h1>
                        <p className="text-muted-foreground">Centralized source of truth for webhook data processing and analytics</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={fetchDatabaseData}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search data..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <Card className="border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Events</p>
                            <p className="text-2xl font-bold text-foreground">{metrics.totalEvents}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                </Card>

                <Card className="border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.totalRevenue)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-500" />
                    </div>
                </Card>

                <Card className="border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                            <p className="text-2xl font-bold text-foreground">{metrics.totalOrders}</p>
                        </div>
                        <Ticket className="h-8 w-8 text-purple-500" />
                    </div>
                </Card>

                <Card className="border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Active Promoters</p>
                            <p className="text-2xl font-bold text-foreground">{metrics.totalPromoters}</p>
                        </div>
                        <Users className="h-8 w-8 text-yellow-500" />
                    </div>
                </Card>

                <Card className="border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Tickets</p>
                            <p className="text-2xl font-bold text-foreground">{metrics.totalTicketsSold}</p>
                        </div>
                        <Activity className="h-8 w-8 text-red-500" />
                    </div>
                </Card>
            </div>

            {/* Data Tabs */}
            <Card className="border-border bg-card">
                <div className="p-6 border-b border-border">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab("events")}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "events"
                                ? "bg-blue-600 text-white"
                                : "bg-card text-foreground hover:bg-card/80"
                                }`}
                        >
                            Events ({filteredEvents.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "orders"
                                ? "bg-blue-600 text-white"
                                : "bg-card text-foreground hover:bg-card/80"
                                }`}
                        >
                            Orders ({filteredOrders.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("promoters")}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "promoters"
                                ? "bg-blue-600 text-white"
                                : "bg-card text-foreground hover:bg-card/80"
                                }`}
                        >
                            Promoters ({filteredPromoters.length})
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === "events" && (
                        <ScrollArea className="h-[600px]">
                            <div className="space-y-4">
                                {filteredEvents.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        No events found. Events are automatically created when sales are detected.
                                    </div>
                                ) : (
                                    filteredEvents.map((event) => (
                                        <Card key={event.id} className="border-border bg-card/50 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`}></div>
                                                    <h4 className="font-semibold text-foreground">{event.name}</h4>
                                                    <Badge variant="outline">{event.event_id}</Badge>
                                                </div>
                                                <Badge className={getStatusColor(event.status)}>
                                                    {event.status}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Revenue:</span>
                                                    <span className="ml-2 text-foreground font-medium">{formatCurrency(event.total_revenue)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Tickets:</span>
                                                    <span className="ml-2 text-foreground font-medium">{event.ticket_count}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Promoters:</span>
                                                    <span className="ml-2 text-foreground font-medium">{event.promoter_count}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Created:</span>
                                                    <span className="ml-2 text-foreground font-medium">{formatDate(event.created_at)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Last Sale:</span>
                                                    <span className="ml-2 text-foreground font-medium">
                                                        {event.last_sale_at ? formatDate(event.last_sale_at) : 'Never'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    )}

                    {activeTab === "orders" && (
                        <ScrollArea className="h-[600px]">
                            <div className="space-y-4">
                                {filteredOrders.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        No orders found. Orders are created from webhook data.
                                    </div>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <Card key={order.id} className="border-border bg-card/50 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                                                    <h4 className="font-semibold text-foreground font-mono">{order.order_number}</h4>
                                                    <Badge variant="outline">{order.event_name}</Badge>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-foreground">{formatCurrency(order.total)}</div>
                                                    <div className="text-xs text-muted-foreground">{order.items_count} items</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Customer:</span>
                                                    <span className="ml-2 text-foreground">{order.account_name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Email:</span>
                                                    <span className="ml-2 text-foreground">{order.account_email}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Promoter:</span>
                                                    <span className="ml-2 text-foreground">
                                                        {order.promoter_tracking_link || 'Direct Sale'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Processed:</span>
                                                    <span className="ml-2 text-foreground">{formatDate(order.processed_at)}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    )}

                    {activeTab === "promoters" && (
                        <ScrollArea className="h-[600px]">
                            <div className="space-y-4">
                                {filteredPromoters.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        No promoters found. Promoters are tracked from referral data.
                                    </div>
                                ) : (
                                    filteredPromoters.map((promoter) => (
                                        <Card key={promoter.id} className="border-border bg-card/50 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${getTierColor(promoter.tier)}`}></div>
                                                    <h4 className="font-semibold text-foreground">{promoter.name}</h4>
                                                    <Badge variant="outline">{promoter.tracking_link}</Badge>
                                                </div>
                                                <Badge className={getTierColor(promoter.tier)}>
                                                    {promoter.tier}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Tickets Sold:</span>
                                                    <span className="ml-2 text-foreground font-medium">{promoter.total_tickets_sold}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Revenue:</span>
                                                    <span className="ml-2 text-foreground font-medium">{formatCurrency(promoter.total_revenue_generated)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Commission:</span>
                                                    <span className="ml-2 text-foreground font-medium">{formatCurrency(promoter.total_commission_earned)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Active Events:</span>
                                                    <span className="ml-2 text-foreground font-medium">{promoter.active_events}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Last Sale:</span>
                                                    <span className="ml-2 text-foreground font-medium">
                                                        {promoter.last_sale_at ? formatDate(promoter.last_sale_at) : 'Never'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </Card>
        </div>
    )
}