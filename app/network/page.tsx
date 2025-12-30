import { NetworkTreeNode } from "@/components/network-tree-node"
import { mockNetworkData } from "@/lib/mock-network-data"
import { Sidebar } from "@/components/sidebar"

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <main className="ml-64 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Network</h1>
            <p className="mt-2 text-muted-foreground">Your complete promoter hierarchy</p>
          </div>

          <div className="space-y-2">
            <NetworkTreeNode node={mockNetworkData} level={0} />
          </div>

          <div className="mt-12 rounded-md border border-border bg-card p-6">
            <h3 className="mb-2 font-semibold text-foreground">About your network</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your network represents permanent relationships built through ticket sales. Each node's position is
              immutable, and credit flows upward based on frozen snapshots from Posh webhooks. Growth here is permanent.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
