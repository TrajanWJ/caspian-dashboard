import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import { mockEvents } from "@/lib/mock-event-data"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"

export default function EventsPage() {
  const activeEvents = mockEvents.filter((e) => e.status === "active")
  const pastEvents = mockEvents.filter((e) => e.status === "past")

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <main className="ml-64 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Events</h1>
            <p className="mt-2 text-muted-foreground">Time windows where your network creates impact</p>
          </div>

          {activeEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-4 text-xl font-semibold tracking-tight">Active</h2>
              <div className="space-y-3">
                {activeEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Past events</h2>
            <div className="space-y-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function EventCard({ event }: { event: (typeof mockEvents)[0] }) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group border-border bg-card p-6 transition-all hover:border-accent/50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">{event.name}</h3>
              <Badge
                variant="secondary"
                className={cn(
                  event.status === "active" && "bg-accent/20 text-accent border-accent/30",
                  event.status === "past" && "bg-muted text-muted-foreground border-border",
                )}
              >
                {event.status}
              </Badge>
            </div>
            <div className="mb-4 text-sm text-muted-foreground">
              {event.venue} · {formattedDate}
            </div>
            <div className="flex gap-8">
              <div>
                <div className="font-mono text-2xl font-semibold text-foreground">
                  {event.yourImpact.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Your impact</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-semibold text-muted-foreground">
                  {event.networkImpact.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Network impact</div>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
        </div>
      </Card>
    </Link>
  )
}
