import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Database,
    RefreshCw,
    Search,
    Calendar,
    TrendingUp,
    Users,
    Ticket,
    DollarSign,
    Activity,
    Download,
    Upload,
    Settings
} from "lucide-react"
import { useEffect, useState } from "react"

interface DatabaseEvent {
    id: string
    name: string
    event_id: string
    status: "active" | "upcoming" | "completed"
    total_sales: number
    total_revenue: number
    created_at: string
    first_sale_at: string | null
    last_sale_at: string | null
    promoter_count: number
    ticket_count: number
}

interface DatabaseOrder {
    id: string
    order_number: string
    event_id: string
    event_name: string
    promoter_id: string | null
    promoter_tracking_link: string | null
    account_name: string
    account_email: string
    total: number
    items_count: number
    commission_earned: number
    status: "completed" | "cancelled" | "refunded"
    created_at: string
    processed_at: string
    webhook_timestamp: string
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
    avgOrderValue: number
    conversionRate: number
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
        avgOrderValue: 0,
        conversionRate: 0,
        lastUpdated: new Date().toISOString()
    })
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

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
            const totalPromoters = new Set(orders.map(order => order.promoter_id).filter(Boolean)).size
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

            setMetrics({
                totalEvents: events.length,
                totalOrders,
                totalRevenue,
                totalTicketsSold,
                totalPromoters,
                avgOrderValue,
                conversionRate: 0, // Would need traffic data to calculate
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

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.event_id.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || event.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="min-h-screen bg-black">
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
                            <Button variant="outline" className="border-border text-foreground hover:bg-card">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                </div>

                {/* Data Management Tabs */}
                <Card className="border-border bg-card">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Data Repository</h3>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search data..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Filter status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="events" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Events ({events.length})
                            </TabsTrigger>
                            <TabsTrigger value="orders" className="flex items-center gap-2">
                                <Ticket className="h-4 w-4" />
                                Orders ({orders.length})
                            </TabsTrigger>
                            <TabsTrigger value="promoters" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Promoters ({promoters.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="events" className="p-6">
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
                                                        <span className="ml-2 text-foreground font-medium">{formatCurrency(event.total_re