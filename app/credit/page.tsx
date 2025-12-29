import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCreditSnapshots } from "@/lib/mock-credit-data"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"

export default function CreditPage() {
  const totalCredit = mockCreditSnapshots.reduce((sum, s) => sum + s.amount, 0)
  const confirmedCredit = mockCreditSnapshots
    .filter((s) => s.status === "confirmed")
    .reduce((sum, s) => sum + s.amount, 0)
  const pendingCredit = mockCreditSnapshots.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.amount, 0)

  // Group by event
  const groupedSnapshots = mockCreditSnapshots.reduce(
    (acc, snapshot) => {
      if (!acc[snapshot.eventName]) {
        acc[snapshot.eventName] = []
      }
      acc[snapshot.eventName].push(snapshot)
      return acc
    },
    {} as Record<string, typeof mockCreditSnapshots>,
  )

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <main className="ml-64 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Credit</h1>
            <p className="mt-2 text-muted-foreground">Lifetime credit earned through your network</p>
          </div>

          {/* Summary Stats */}
          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            <Card className="border-border bg-card p-6">
              <div className="mb-1 text-sm text-muted-foreground">Lifetime credit</div>
              <div className="font-mono text-3xl font-semibold text-foreground">{totalCredit.toLocaleString()}</div>
            </Card>
            <Card className="border-border bg-card p-6">
              <div className="mb-1 text-sm text-muted-foreground">Confirmed</div>
              <div className="font-mono text-3xl font-semibold text-accent">{confirmedCredit.toLocaleString()}</div>
            </Card>
            <Card className="border-border bg-card p-6">
              <div className="mb-1 text-sm text-muted-foreground">Pending</div>
              <div className="font-mono text-3xl font-semibold text-muted-foreground">
                {pendingCredit.toLocaleString()}
              </div>
            </Card>
          </div>

          {/* Explanation */}
          <Card className="mb-8 border-border bg-card p-6">
            <h3 className="mb-2 font-semibold text-foreground">Understanding credit</h3>
            <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Credit represents the value you've created through ticket sales. Each transaction is captured as an
                immutable snapshot from Posh webhooks.
              </p>
              <p className="pt-2">
                <strong className="text-foreground">Credit earned</strong> is tracked separately from{" "}
                <strong className="text-foreground">money paid</strong>. Payouts are processed on a separate schedule.
              </p>
            </div>
          </Card>

          {/* Historical Snapshots */}
          <div>
            <h2 className="mb-6 text-xl font-semibold tracking-tight">Historical snapshots</h2>
            <div className="space-y-6">
              {Object.entries(groupedSnapshots).map(([eventName, snapshots]) => {
                const eventTotal = snapshots.reduce((sum, s) => sum + s.amount, 0)
                const eventDate = new Date(snapshots[0].date)
                const formattedDate = eventDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })

                return (
                  <Card key={eventName} className="border-border bg-card p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{eventName}</h3>
                        <p className="text-sm text-muted-foreground">{formattedDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-2xl font-semibold text-foreground">
                          {eventTotal.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">total</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {snapshots.map((snapshot) => (
                        <div
                          key={snapshot.id}
                          className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-mono text-xs",
                                snapshot.type === "direct" && "border-accent/30 bg-accent/10 text-accent",
                                snapshot.type === "network" && "border-border bg-muted text-muted-foreground",
                              )}
                            >
                              {snapshot.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                snapshot.status === "confirmed" && "border-accent/30 text-accent",
                                snapshot.status === "pending" && "border-border text-muted-foreground",
                              )}
                            >
                              {snapshot.status}
                            </Badge>
                          </div>
                          <div className="font-mono font-semibold text-foreground">
                            {snapshot.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
