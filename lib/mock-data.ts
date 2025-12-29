// Mock data store for client-side use
export interface Promoter {
    id: string
    tracking_link: string
    first_name: string
    last_name: string
    email: string
    phone: string
    total_tickets_sold: number
    total_revenue_generated: number
    total_commission_earned: number
    tier: "Bronze" | "Silver" | "Gold" | "Platinum"
    rank: number
    commission_rate: number
    created_at: string
}

export interface Event {
    id: string
    name: string
    start_date: string
    end_date: string
    status: "upcoming" | "active" | "completed"
    total_tickets_sold: number
    total_revenue: number
    is_current: boolean
}

export interface Order {
    id: string
    order_number: string
    event_id: string
    promoter_id: string
    tracking_link: string
    account_first_name: string
    account_last_name: string
    account_email: string
    account_phone: string
    items: Array<{
        item_id: string
        name: string
        price: number
    }>
    subtotal: number
    total: number
    date_purchased: string
    cancelled: boolean
    refunded: boolean
    commission_earned: number
    received_at?: string
    event_name?: string
    promo_code?: string
}

export interface WebhookLog {
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

// Mock data
const mockPromoters: Promoter[] = [
    {
        id: "1",
        tracking_link: "john-doe",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        total_tickets_sold: 150,
        total_revenue_generated: 15000,
        total_commission_earned: 3000,
        tier: "Gold",
        rank: 1,
        commission_rate: 0.2,
        created_at: "2024-01-01T00:00:00Z"
    },
    {
        id: "2",
        tracking_link: "jane-smith",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@example.com",
        phone: "+1234567891",
        total_tickets_sold: 120,
        total_revenue_generated: 12000,
        total_commission_earned: 2400,
        tier: "Gold",
        rank: 2,
        commission_rate: 0.2,
        created_at: "2024-01-02T00:00:00Z"
    },
    {
        id: "3",
        tracking_link: "mike-wilson",
        first_name: "Mike",
        last_name: "Wilson",
        email: "mike@example.com",
        phone: "+1234567892",
        total_tickets_sold: 85,
        total_revenue_generated: 8500,
        total_commission_earned: 1700,
        tier: "Silver",
        rank: 3,
        commission_rate: 0.2,
        created_at: "2024-01-03T00:00:00Z"
    },
    {
        id: "4",
        tracking_link: "sarah-jones",
        first_name: "Sarah",
        last_name: "Jones",
        email: "sarah@example.com",
        phone: "+1234567893",
        total_tickets_sold: 65,
        total_revenue_generated: 6500,
        total_commission_earned: 1300,
        tier: "Silver",
        rank: 4,
        commission_rate: 0.2,
        created_at: "2024-01-04T00:00:00Z"
    },
    {
        id: "5",
        tracking_link: "david-brown",
        first_name: "David",
        last_name: "Brown",
        email: "david@example.com",
        phone: "+1234567894",
        total_tickets_sold: 45,
        total_revenue_generated: 4500,
        total_commission_earned: 900,
        tier: "Bronze",
        rank: 5,
        commission_rate: 0.2,
        created_at: "2024-01-05T00:00:00Z"
    }
]

const mockEvents: Event[] = [
    {
        id: "1",
        name: "Summer Music Festival 2024",
        start_date: "2024-08-15T00:00:00Z",
        end_date: "2024-08-15T23:59:59Z",
        status: "active",
        total_tickets_sold: 500,
        total_revenue: 25000,
        is_current: true
    },
    {
        id: "2",
        name: "Winter Concert Series",
        start_date: "2024-12-15T00:00:00Z",
        end_date: "2024-12-15T23:59:59Z",
        status: "upcoming",
        total_tickets_sold: 0,
        total_revenue: 0,
        is_current: false
    },
    {
        id: "3",
        name: "Spring Art Expo",
        start_date: "2024-04-20T00:00:00Z",
        end_date: "2024-04-20T23:59:59Z",
        status: "completed",
        total_tickets_sold: 320,
        total_revenue: 16000,
        is_current: false
    }
]

const mockOrders: Order[] = [
    {
        id: "1",
        order_number: "ORD-001",
        event_id: "1",
        promoter_id: "1",
        tracking_link: "john-doe",
        account_first_name: "Alice",
        account_last_name: "Johnson",
        account_email: "alice@example.com",
        account_phone: "+1234567895",
        items: [
            { item_id: "1", name: "General Admission", price: 50 }
        ],
        subtotal: 50,
        total: 50,
        date_purchased: "2024-07-15T10:30:00Z",
        cancelled: false,
        refunded: false,
        commission_earned: 10,
        received_at: "2024-07-15T10:30:00Z",
        event_name: "Summer Music Festival 2024",
        promo_code: "SUMMER20"
    },
    {
        id: "2",
        order_number: "ORD-002",
        event_id: "1",
        promoter_id: "2",
        tracking_link: "jane-smith",
        account_first_name: "Bob",
        account_last_name: "Williams",
        account_email: "bob@example.com",
        account_phone: "+1234567896",
        items: [
            { item_id: "1", name: "VIP Access", price: 100 }
        ],
        subtotal: 100,
        total: 100,
        date_purchased: "2024-07-15T11:15:00Z",
        cancelled: false,
        refunded: false,
        commission_earned: 20,
        received_at: "2024-07-15T11:15:00Z",
        event_name: "Summer Music Festival 2024",
        promo_code: "VIP50"
    },
    {
        id: "3",
        order_number: "ORD-003",
        event_id: "1",
        promoter_id: "1",
        tracking_link: "john-doe",
        account_first_name: "Carol",
        account_last_name: "Davis",
        account_email: "carol@example.com",
        account_phone: "+1234567897",
        items: [
            { item_id: "1", name: "General Admission", price: 50 }
        ],
        subtotal: 50,
        total: 50,
        date_purchased: "2024-07-15T12:00:00Z",
        cancelled: false,
        refunded: false,
        commission_earned: 10,
        received_at: "2024-07-15T12:00:00Z",
        event_name: "Summer Music Festival 2024",
        promo_code: "SUMMER20"
    }
]

const mockWebhookLogs: WebhookLog[] = [
    {
        id: "1",
        timestamp: "2024-07-15T10:30:00Z",
        type: "new_order",
        order_number: "ORD-001",
        promoter_id: "1",
        event_id: "1",
        success: true,
        raw_data: { total: 50, items: [{ name: "General Admission", price: 50 }] }
    },
    {
        id: "2",
        timestamp: "2024-07-15T11:15:00Z",
        type: "new_order",
        order_number: "ORD-002",
        promoter_id: "2",
        event_id: "1",
        success: true,
        raw_data: { total: 100, items: [{ name: "VIP Access", price: 100 }] }
    },
    {
        id: "3",
        timestamp: "2024-07-15T12:00:00Z",
        type: "new_order",
        order_number: "ORD-003",
        promoter_id: "1",
        event_id: "1",
        success: true,
        raw_data: { total: 50, items: [{ name: "General Admission", price: 50 }] }
    }
]

// Client-side data functions
export const getPromoters = async (): Promise<Promoter[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockPromoters]
}

export const getPromoterByTrackingLink = async (trackingLink: string): Promise<Promoter | null> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockPromoters.find(p => p.tracking_link === trackingLink) || null
}

export const getEvents = async (): Promise<Event[]> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockEvents]
}

export const getEventById = async (eventId: string): Promise<Event | null> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockEvents.find(e => e.id === eventId) || null
}

export const getOrders = async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockOrders]
}

export const getOrdersByPromoter = async (promoterId: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockOrders.filter(o => o.promoter_id === promoterId && !o.cancelled && !o.refunded)
}

export const getOrdersByEvent = async (eventId: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockOrders.filter(o => o.event_id === eventId && !o.cancelled && !o.refunded)
}

export const getWebhookLogs = async (): Promise<WebhookLog[]> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockWebhookLogs]
}

export const addOrder = async (order: Order): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    mockOrders.push(order)
}

export const addWebhookLog = async (log: WebhookLog): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    mockWebhookLogs.unshift(log) // Add to beginning for most recent first
    // Keep only last 100 logs
    const trimmed = mockWebhookLogs.slice(0, 100)
    mockWebhookLogs.length = 0
    mockWebhookLogs.push(...trimmed)
}

export const updateOrder = async (order: Order): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    const index = mockOrders.findIndex(o => o.id === order.id)
    if (index !== -1) {
        mockOrders[index] = order
    }
}

export const getOrderByOrderNumber = async (orderNumber: string): Promise<Order | null> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockOrders.find(o => o.order_number === orderNumber) || null
}

export const calculateTier = (ticketsSold: number): { tier: Promoter["tier"]; rate: number } => {
    if (ticketsSold >= 100) return { tier: "Platinum", rate: 0.35 }
    if (ticketsSold >= 50) return { tier: "Gold", rate: 0.3 }
    if (ticketsSold >= 25) return { tier: "Silver", rate: 0.25 }
    return { tier: "Bronze", rate: 0.2 }
}

export const recalculateRankings = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    const sorted = [...mockPromoters].sort((a, b) => b.total_tickets_sold - a.total_tickets_sold)

    for (let i = 0; i < sorted.length; i++) {
        sorted[i].rank = i + 1
    }
}