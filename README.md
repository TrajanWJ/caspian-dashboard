# Promoter Analytics Platform

A comprehensive real-time analytics dashboard for tracking promoter performance, managing commission tiers, and monitoring event sales through Posh webhook integration.

## Features

### For Promoters
- **Real-time Dashboard**: Track tickets sold, revenue generated, and commission earned
- **Performance Analytics**: Detailed event-by-event performance with trend analysis
- **Transaction History**: Complete log of all sales with customer details
- **Referral Tools**: Easy-to-share tracking links with built-in copy functionality
- **Tier Progression**: Automatic advancement through Bronze → Silver → Gold → Platinum tiers
- **Live Rankings**: See where you stand among all promoters

### For Event Owners
- **Network Overview**: Complete visibility into all promoters and their performance
- **Revenue Analytics**: Track gross revenue, commission paid, and net earnings
- **Event Performance**: Detailed breakdown by event with profitability metrics
- **Promoter Management**: View all promoters with filtering and sorting
- **Webhook Monitoring**: Real-time log of all Posh webhook events
- **Top Performer Insights**: Identify and reward your best promoters

## Commission Tiers

| Tier | Tickets Required | Commission Rate |
|------|------------------|-----------------|
| Bronze | 0-24 | 20% |
| Silver | 25-49 | 25% |
| Gold | 50-99 | 30% |
| Platinum | 100+ | 35% |

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: Tailwind CSS v4 + shadcn/ui components
- **Data Storage**: JSON file-based (for testing/demo purposes)
- **Webhooks**: Posh integration for real-time order processing
- **Analytics**: Vercel Analytics

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

### Webhook Setup

Configure your Posh dashboard to send webhooks to:
```
https://your-domain.com/api/webhook/posh
```

The webhook handler processes:
- New orders (creates records, updates metrics)
- Order updates (handles refunds/cancellations)
- Automatic tier recalculation
- Real-time ranking updates

### Testing Webhooks

Send a test webhook:
```bash
curl http://localhost:3000/api/test-webhook
```

Or visit: `http://localhost:3000/api/test-webhook` in your browser

## Project Structure

```
├── app/
│   ├── promoter/[tracking_link]/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── performance/          # Performance analytics
│   │   ├── history/              # Transaction history
│   │   └── referral/             # Referral tools
│   ├── owner/
│   │   ├── page.tsx              # Network overview
│   │   ├── promoters/            # All promoters
│   │   ├── events/               # Event performance
│   │   └── webhooks/             # Webhook logs
│   ├── api/
│   │   ├── webhook/posh/         # Webhook endpoint
│   │   └── test-webhook/         # Test utility
│   └── page.tsx                  # Landing page
├── components/
│   ├── promoter-nav.tsx          # Promoter navigation
│   ├── owner-nav.tsx             # Owner navigation
│   └── ui/                       # shadcn components
├── lib/
│   ├── data-store.ts             # JSON data operations
│   └── analytics.ts              # Metrics calculations
└── data/
    ├── promoters.json            # Promoter records
    ├── events.json               # Event details
    ├── orders.json               # Order history
    └── webhook-logs.json         # Webhook activity
```

## Demo Access

### Promoters
- **Alex Williams**: [/promoter/PROMO001](http://localhost:3000/promoter/PROMO001) - Rank #1, Platinum
- **Sam Chen**: [/promoter/PROMO002](http://localhost:3000/promoter/PROMO002) - Rank #2, Gold
- **Taylor Jones**: [/promoter/PROMO003](http://localhost:3000/promoter/PROMO003) - Rank #3, Silver

### Owner
- **Dashboard**: [/owner](http://localhost:3000/owner)

## API Reference

### POST /api/webhook/posh

Receives Posh webhook events and processes orders.

**Request Body:**
```json
{
  "type": "new_order",
  "account_first_name": "John",
  "account_last_name": "Doe",
  "account_email": "john@example.com",
  "event_id": "event-001",
  "tracking_link": "PROMO001",
  "items": [
    { "item_id": "ticket-001", "name": "GA", "price": 45 }
  ],
  "subtotal": 45,
  "total": 47.50,
  "order_number": "ORDER-12345",
  "date_purchased": "2025-01-15T10:00:00Z",
  "cancelled": false,
  "refunded": false
}
```

**Response:**
```json
{
  "success": true,
  "order_id": "order-123",
  "promoter_id": "promoter-001",
  "commission_earned": 9.00
}
```

## Data Storage

Currently uses JSON files in `/data` directory for testing. For production:

1. Replace with database (Supabase/Neon recommended)
2. Update `lib/data-store.ts` with database queries
3. Add Row Level Security (RLS) policies
4. Implement proper authentication

## Design Philosophy

- **Dark-first aesthetic**: Professional, focused interface
- **Data clarity**: Large, bold numbers with clear hierarchy
- **Minimal chrome**: Let the data speak
- **Purposeful motion**: Subtle transitions that guide attention
- **Performance-focused**: Fast loading, smooth interactions

## Roadmap

- [ ] Database integration (Supabase/Neon)
- [ ] Email/password authentication
- [ ] Real-time updates via WebSockets
- [ ] Export functionality (CSV/PDF)
- [ ] Mobile app views
- [ ] Advanced filtering and search
- [ ] Custom date ranges
- [ ] Email notifications

## License

MIT

---

Built with [v0.app](https://v0.app)
```

```json file="" isHidden
