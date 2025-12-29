import { getWebhookLogs } from "@/lib/data-store"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock, Activity } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default async function WebhooksPage() {
  const logs = await getWebhookLogs()

  const successCount = logs.filter((l) => l.success).length
  const failureCount = logs.filter((l) => !l.success).length

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(dateString))
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <div className="ml-64">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12">
            <h1 className="mb-2 text-3xl font-bold text-white">Webhook Activity</h1>
            <p className="text-white/60">Real-time log of Posh webhook events</p>
          </div>

          {/* Stats */}
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-white/40">
                <Activity className="h-4 w-4" />
                <span className="text-sm">TOTAL EVENTS</span>
              </div>
              <div className="text-4xl font-bold text-white">{logs.length}</div>
            </Card>
            <Card className="border-white/10 bg-green-500/10 p-6 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">SUCCESSFUL</span>
              </div>
              <div className="text-4xl font-bold text-green-400">{successCount}</div>
            </Card>
            <Card className="border-white/10 bg-red-500/10 p-6 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-red-400">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">FAILED</span>
              </div>
              <div className="text-4xl font-bold text-red-400">{failureCount}</div>
            </Card>
          </div>

          {/* Webhook URL */}
          <Card className="mb-8 border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 backdrop-blur">
            <div className="mb-2 text-sm font-medium text-white/60">Webhook Endpoint</div>
            <div className="font-mono text-sm text-white">
              {typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/api/webhook/posh
            </div>
            <p className="mt-3 text-xs text-white/40">
              Add this URL to your Posh dashboard to receive real-time order notifications
            </p>
          </Card>

          {/* Event Log */}
          <div className="space-y-3">
            <h2 className="mb-4 text-lg font-bold text-white">Recent Events</h2>
            {logs.map((log) => (
              <Card
                key={log.id}
                className={`border-white/10 p-6 backdrop-blur ${log.success ? "bg-white/5" : "bg-red-500/5 border-red-500/20"
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {log.success ? (
                      <CheckCircle2 className="mt-1 h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="mt-1 h-5 w-5 text-red-400" />
                    )}
                    <div>
                      <div className="mb-1 flex items-center gap-3">
                        <span className="font-bold text-white">{log.type}</span>
                        <span className="font-mono text-sm text-white/60">{log.order_number}</span>
                      </div>
                      <div className="mb-2 flex items-center gap-2 text-sm text-white/40">
                        <Clock className="h-3 w-3" />
                        <span>{formatDateTime(log.timestamp)}</span>
                      </div>
                      {log.error_message && <div className="mt-2 text-sm text-red-400">{log.error_message}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    {log.promoter_id && (
                      <div className="text-sm">
                        <div className="text-white/40">Promoter</div>
                        <div className="font-mono text-xs text-white">{log.promoter_id}</div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {logs.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                <p className="text-white/60">No webhook events yet. Waiting for incoming orders from Posh...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
