export interface CreditSnapshot {
  id: string
  date: string
  amount: number
  eventName: string
  type: "direct" | "network"
  status: "confirmed" | "pending"
}
