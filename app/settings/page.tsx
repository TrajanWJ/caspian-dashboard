"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

const mockUserData = {
  name: "Jordan Smith",
  email: "jordan@example.com",
  referralCode: "JSMITH-2025",
  referralLink: "https://caspian.app/join?ref=JSMITH-2025",
}

export default function SettingsPage() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text)
    if (type === "code") {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } else {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="owner" />
      <main className="ml-64 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
            <p className="mt-2 text-muted-foreground">Manage your profile and referral information</p>
          </div>

          <div className="space-y-6">
            {/* Referral Information */}
            <Card className="border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-semibold tracking-tight">Referral information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Referral code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={mockUserData.referralCode}
                      readOnly
                      className="flex-1 border-border bg-secondary font-mono"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(mockUserData.referralCode, "code")}
                      className="shrink-0 bg-transparent"
                    >
                      {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Referral link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={mockUserData.referralLink}
                      readOnly
                      className="flex-1 border-border bg-secondary text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(mockUserData.referralLink, "link")}
                      className="shrink-0 bg-transparent"
                    >
                      {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Share this link to invite others to join your network</p>
                </div>
              </div>
            </Card>

            {/* Profile Information */}
            <Card className="border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-semibold tracking-tight">Profile</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={mockUserData.name} className="border-border bg-secondary" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={mockUserData.email}
                    className="border-border bg-secondary"
                  />
                </div>

                <Button variant="default">Save changes</Button>
              </div>
            </Card>

            {/* About Position */}
            <Card className="border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold tracking-tight">About your position</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your position in the Caspian hierarchy is permanent and cannot be changed. This ensures the integrity of
                the network and accurate credit attribution. All relationships are immutable once established through the
                referral system.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
