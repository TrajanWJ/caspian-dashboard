export interface Event {
  id: string
  name: string
  date: string
  venue: string
  status: "active" | "past" | "upcoming"
  yourImpact: number
  networkImpact: number
}
