import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Activity, TrendingUp, Users, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <Activity className="h-4 w-4" />
            <span>Real-time analytics powered by Posh</span>
          </div>
          <h1 className="mb-6 max-w-4xl text-6xl font-bold leading-tight text-white md:text-7xl text-balance">
            Promoter analytics that drive results
          </h1>
          <p className="mb-12 max-w-2xl text-xl leading-relaxed text-white/60 text-pretty">
            Track sales, monitor performance, and scale your promoter network with real-time data and actionable
            insights.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/owner">
              <Button
                size="lg"
                className="group flex items-center gap-2 rounded-xl bg-white px-8 py-6 text-base font-semibold text-black hover:bg-white/90"
              >
                View Owner Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#promoters">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 px-8 py-6 text-base font-semibold text-white hover:bg-white/10"
              >
                Promoter Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">Everything you need to scale</h2>
          <p className="text-lg text-white/60">Powerful tools for promoters and event owners</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 backdrop-blur">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Real-time Performance</h3>
            <p className="leading-relaxed text-white/60">
              Track ticket sales, revenue, and commission as they happen with live webhook integration from Posh.
            </p>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 backdrop-blur">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Tiered Commission</h3>
            <p className="leading-relaxed text-white/60">
              Automatic tier progression from Bronze to Platinum as promoters sell more tickets and earn higher rates.
            </p>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-8 backdrop-blur">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Network Insights</h3>
            <p className="leading-relaxed text-white/60">
              Complete visibility into your promoter network with rankings, trends, and performance analytics.
            </p>
          </Card>
        </div>
      </div>

      {/* Promoter Access Section */}
      <div id="promoters" className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Promoter Access</h2>
            <p className="text-lg text-white/60">Quick access to test promoter dashboards</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/promoter/PROMO001">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:scale-[1.02] hover:bg-white/[0.07]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="mb-1 text-lg font-bold text-white">Alex Williams</div>
                    <div className="text-sm text-white/60">PROMO001</div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-2xl font-bold text-white">#1</div>
                    <div className="text-xs text-white/40">RANK</div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <div className="text-xs text-white/40">TIER</div>
                    <div className="font-semibold text-cyan-400">Platinum</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/40" />
                </div>
              </Card>
            </Link>

            <Link href="/promoter/PROMO002">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:scale-[1.02] hover:bg-white/[0.07]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="mb-1 text-lg font-bold text-white">Sam Chen</div>
                    <div className="text-sm text-white/60">PROMO002</div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-2xl font-bold text-white">#2</div>
                    <div className="text-xs text-white/40">RANK</div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <div className="text-xs text-white/40">TIER</div>
                    <div className="font-semibold text-yellow-400">Gold</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/40" />
                </div>
              </Card>
            </Link>

            <Link href="/promoter/PROMO003">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:scale-[1.02] hover:bg-white/[0.07]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="mb-1 text-lg font-bold text-white">Taylor Jones</div>
                    <div className="text-sm text-white/60">PROMO003</div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-2xl font-bold text-white">#3</div>
                    <div className="text-xs text-white/40">RANK</div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <div className="text-xs text-white/40">TIER</div>
                    <div className="font-semibold text-gray-400">Silver</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/40" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Developer Tools</h2>
            <p className="text-lg text-white/60">Test webhooks and view system logs</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/5 p-8 backdrop-blur">
              <h3 className="mb-4 text-xl font-bold text-white">Posh Webhook Endpoint</h3>
              <div className="mb-4 rounded-xl border border-white/10 bg-black/40 p-4">
                <code className="text-sm text-blue-400">
                  {typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}
                  /api/webhook/posh
                </code>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                Configure this endpoint in your Posh dashboard to receive real-time order notifications and
                automatically update promoter metrics.
              </p>
            </Card>

            <Card className="border-white/10 bg-white/5 p-8 backdrop-blur">
              <h3 className="mb-4 text-xl font-bold text-white">Test Webhook</h3>
              <p className="mb-6 text-sm leading-relaxed text-white/60">
                Send a test order to verify webhook integration and see real-time updates in action.
              </p>
              <Link href="/api/test-webhook" target="_blank">
                <Button className="w-full rounded-xl bg-white text-black hover:bg-white/90">Send Test Webhook</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-white/40">Promoter Analytics Dashboard</div>
            <div className="flex gap-6">
              <Link href="/owner/webhooks" className="text-sm text-white/60 hover:text-white">
                Webhook Logs
              </Link>
              <Link href="/owner/events" className="text-sm text-white/60 hover:text-white">
                Events
              </Link>
              <Link href="/owner/promoters" className="text-sm text-white/60 hover:text-white">
                All Promoters
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
