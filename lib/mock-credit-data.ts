import type { CreditSnapshot } from "@/types/credit"

export const mockCreditSnapshots: CreditSnapshot[] = [
  {
    id: "1",
    date: "2025-07-20",
    amount: 12350,
    eventName: "Underground Legends",
    type: "direct",
    status: "confirmed",
  },
  {
    id: "2",
    date: "2025-07-20",
    amount: 26570,
    eventName: "Underground Legends",
    type: "network",
    status: "confirmed",
  },
  {
    id: "3",
    date: "2025-08-15",
    amount: 8420,
    eventName: "Summer Rooftop Series",
    type: "direct",
    status: "pending",
  },
  {
    id: "4",
    date: "2025-08-15",
    amount: 14760,
    eventName: "Summer Rooftop Series",
    type: "network",
    status: "pending",
  },
  {
    id: "5",
    date: "2024-12-31",
    amount: 18640,
    eventName: "New Year Celebration",
    type: "direct",
    status: "confirmed",
  },
]
