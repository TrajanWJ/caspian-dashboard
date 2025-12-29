"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function JoinPage() {
  const router = useRouter()
  const [referralCode, setReferralCode] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [joining, setJoining] = useState(false)

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setJoining(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, this would:
    // 1. Create user account
    // 2. Assign position in hierarchy based on referral code
    // 3. Store immutable parent relationship

    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">Join Caspian</CardTitle>
          <CardDescription className="text-muted-foreground">Your position in the network is permanent</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral">Referral code (optional)</Label>
              <Input
                id="referral"
                type="text"
                placeholder="Leave empty to join house"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="bg-secondary border-border font-mono"
              />
              <p className="text-xs text-muted-foreground">Without a code, you'll join under the house root</p>
            </div>

            <Button type="submit" className="w-full" disabled={joining}>
              {joining ? "Joining network..." : "Join network"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have access? </span>
            <Link href="/auth/login" className="text-foreground hover:text-accent transition-colors">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
