import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mockEventDetail } from "@/lib/mock-event-data"
import { Sidebar } from "@/components/sidebar"

export default function EventDetailPage() {
  const event = mockEventDetail
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <main className="ml-64 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/events"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to events
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{event.name}</h1>
            <p className="mt-2 text-muted-foreground">
              {event.venue} · {formattedDate}
            </p>
          </div>

          {/* Total Credit */}
          <div className="mb-12">
            <div className="text-6xl font-semibold tracking-tighter text-foreground md:text-7xl">
              {event.totalCredit.toLocaleString()}
            </div>
            <p className="mt-2 text-muted-foreground">Total credit generated</p>
          </div>

          {/* Breakdown */}
          <div className="mb-12">
            <h2 className="mb-6 text-xl font-semibold tracking-tight">Breakdown</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-border bg-card p-6">
                <div className="mb-1 text-sm text-muted-foreground">Direct credit</div>
                <div className="mb-2 font-mono text-3xl font-semibold text-foreground">
                  {event.yourDirectCredit.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">{event.breakdown.directTickets} tickets</div>
              </Card>
              <Card className="border-border bg-card p-6">
                <div className="mb-1 text-sm text-muted-foreground">Network credit</div>
                <div className="mb-2 font-mono text-3xl font-semibold text-muted-foreground">
                  {event.networkCredit.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">{event.breakdown.indirectTickets} tickets</div>
              </Card>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="mb-12">
            <h2 className="mb-6 text-xl font-semibold tracking-tight">Top contributors</h2>
            <Card className="border-border bg-card p-6">
              <div className="space-y-4">
                {event.topContributors.map((contributor, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                        {contributor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{contributor.name}</div>
                        <div className="text-xs text-muted-foreground">{contributor.tickets} tickets</div>
                      </div>
                    </div>
                    <div className="font-mono text-lg font-semibold text-foreground">
                      {contributor.credit.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Referral Link */}
          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">Your referral link</h2>
            <Card className="border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <code className="flex-1 overflow-x-auto text-xs text-muted-foreground">{event.referralLink}</code>
                <Button size="sm" variant="outline" className="shrink-0 bg-transparent">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Share this link to track tickets sold through your network. All credit is automatically attributed.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
