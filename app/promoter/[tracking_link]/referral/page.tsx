"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Share2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

interface ReferralPageProps {
  params: Promise<{ tracking_link: string }>
}

export default function ReferralPage({ params }: ReferralPageProps) {
  const [tracking_link, setTrackingLink] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    params.then((resolvedParams) => {
      setTrackingLink(resolvedParams.tracking_link)
    })
  }, [params])

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const referralUrl = `https://posh.vip/e/summer-fest?promo=${tracking_link}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Get tickets to Summer Music Festival",
          text: "Join me at this amazing event!",
          url: referralUrl,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    }
  }

  if (!tracking_link) {
    return (
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="promoter" trackingLink={tracking_link} promoterName="Promoter" />
      <div className="ml-64">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-12">
            <h1 className="mb-2 text-3xl font-bold text-white">Your Referral Tools</h1>
            <p className="text-white/60">Share your unique link and earn commission on every sale</p>
          </div>

          {/* Referral Link Card */}
          <Card className="mb-8 border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 backdrop-blur">
            <div className="mb-6">
              <div className="mb-2 text-sm font-medium uppercase tracking-wider text-white/60">Your Tracking Code</div>
              <div className="text-4xl font-bold text-white">{tracking_link}</div>
            </div>

            <div className="mb-4">
              <div className="mb-2 text-sm text-white/60">Referral URL</div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl border border-white/20 bg-black/40 px-4 py-3 font-mono text-sm text-white">
                  {referralUrl}
                </div>
                <Button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-xl bg-white px-6 text-black hover:bg-white/90"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {typeof window !== "undefined" && typeof navigator.share === "function" && (
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex items-center gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
                Share Link
              </Button>
            )}
          </Card>

          {/* Tips for Success */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-white">Tips for Success</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-3 text-lg font-bold text-white">Share Everywhere</div>
                <p className="text-sm leading-relaxed text-white/60">
                  Post your link on social media, in group chats, and with friends. The more people who see it, the more
                  tickets you'll sell.
                </p>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-3 text-lg font-bold text-white">Personal Touch</div>
                <p className="text-sm leading-relaxed text-white/60">
                  Share why you're excited about the event. Personal recommendations convert better than generic links.
                </p>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-3 text-lg font-bold text-white">Create Urgency</div>
                <p className="text-sm leading-relaxed text-white/60">
                  Remind people when tickets are running low or prices are about to increase. Urgency drives action.
                </p>
              </Card>

              <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-3 text-lg font-bold text-white">Track Performance</div>
                <p className="text-sm leading-relaxed text-white/60">
                  Check your dashboard regularly to see what's working. Double down on successful strategies.
                </p>
              </Card>
            </div>
          </div>

          {/* Commission Tiers */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">Commission Structure</h2>
            <div className="grid gap-3">
              {[
                { tier: "Bronze", tickets: "0-24", rate: "20%", color: "from-orange-600 to-red-600" },
                { tier: "Silver", tickets: "25-49", rate: "25%", color: "from-gray-400 to-gray-600" },
                { tier: "Gold", tickets: "50-99", rate: "30%", color: "from-yellow-500 to-orange-500" },
                { tier: "Platinum", tickets: "100+", rate: "35%", color: "from-cyan-500 to-blue-500" },
              ].map((item) => (
                <Card key={item.tier} className="border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color}`} />
                      <div>
                        <div className="font-bold text-white">{item.tier}</div>
                        <div className="text-sm text-white/60">{item.tickets} tickets</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{item.rate}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
