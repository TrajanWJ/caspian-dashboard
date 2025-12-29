import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

// Mock data - in production this comes from server
const mockData = {
  totalImpact: "47,382",
  directPromoters: 12,
  totalNodes: 89,
  depth: 3,
  recentGrowth: "+24",
}

export default function DashboardPage() {
  return (
    <main className="px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Primary Impact Display */}
        <div className="space-y-3">
          <div className="text-8xl font-semibold tracking-tighter text-foreground md:text-9xl">
            {mockData.totalImpact}
          </div>
          <p className="text-lg text-muted-foreground">Total impact</p>
          <p className="text-sm text-muted-foreground">Value created by your network</p>
        </div>

        {/* Position Stats */}
        <div>
          <h2 className="mb-6 text-xl font-semibold tracking-tight">Your position</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border bg-card p-6">
              <div className="text-3xl font-semibold text-foreground">{mockData.depth}</div>
              <p className="mt-1 text-sm text-muted-foreground">Depth in network</p>
            </Card>
            <Card className="border-border bg-card p-6">
              <div className="text-3xl font-semibold text-foreground">{mockData.directPromoters}</div>
              <p className="mt-1 text-sm text-muted-foreground">Direct promoters</p>
            </Card>
            <Card className="border-border bg-card p-6">
              <div className="text-3xl font-semibold text-foreground">{mockData.totalNodes}</div>
              <p className="mt-1 text-sm text-muted-foreground">Total downstream</p>
            </Card>
          </div>
        </div>

        {/* Network Preview */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Network preview</h2>
            <span className="text-sm text-accent">{mockData.recentGrowth} this week</span>
          </div>
          <Card className="border-border bg-card p-8">
            <div className="space-y-4">
              <NetworkPreviewNode name="You" level={0} nodes={mockData.directPromoters} />
              <div className="ml-8 space-y-3 border-l border-border pl-8">
                <NetworkPreviewNode name="Sarah Chen" level={1} nodes={8} />
                <NetworkPreviewNode name="Marcus Rodriguez" level={1} nodes={6} />
                <NetworkPreviewNode name="Alex Kim" level={1} nodes={4} />
                <div className="text-sm text-muted-foreground">+ {mockData.directPromoters - 3} more</div>
              </div>
            </div>
          </Card>
          <div className="mt-4">
            <Link href="/network">
              <Button variant="outline" className="group bg-transparent">
                View full network
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function NetworkPreviewNode({ name, level, nodes }: { name: string; level: number; nodes: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-secondary" />
        <div>
          <div className="text-sm font-medium text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{nodes} downstream</div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">Level {level}</div>
    </div>
  )
}
