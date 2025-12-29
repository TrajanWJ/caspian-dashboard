import type { Event } from "@/types/event"

export const mockEvents: Event[] = [
  {
    id: "1",
    name: "Summer Rooftop Series",
    date: "2025-08-15",
    venue: "Skyline Rooftop",
    status: "active",
    yourImpact: 8420,
    networkImpact: 23180,
  },
  {
    id: "2",
    name: "Underground Legends",
    date: "2025-07-20",
    venue: "The Vault",
    status: "past",
    yourImpact: 12350,
    networkImpact: 38920,
  },
  {
    id: "3",
    name: "New Year Celebration",
    date: "2024-12-31",
    venue: "Grand Hall",
    status: "past",
    yourImpact: 18640,
    networkImpact: 56740,
  },
  {
    id: "4",
    name: "Spring Awakening",
    date: "2025-03-22",
    venue: "Garden Terrace",
    status: "past",
    yourImpact: 6890,
    networkImpact: 19430,
  },
]

export const mockEventDetail = {
  id: "2",
  name: "Underground Legends",
  date: "2025-07-20",
  venue: "The Vault",
  status: "past" as const,
  totalCredit: 38920,
  yourDirectCredit: 12350,
  networkCredit: 26570,
  referralLink: "https://posh.vip/underground-legends?ref=YOUR_CODE",
  breakdown: {
    directTickets: 34,
    indirectTickets: 78,
    directRevenue: 12350,
    indirectRevenue: 26570,
  },
  topContributors: [
    { name: "Sarah Chen", credit: 8240, tickets: 23 },
    { name: "Marcus Rodriguez", credit: 6430, tickets: 18 },
    { name: "Alex Kim", credit: 4890, tickets: 14 },
  ],
}
