"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Sidebar } from "@/components/sidebar"
import { Copy, Settings, Webhook, TestTube, Database, Users, Ticket, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

export default function ConfigPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        webhookUrl: ""
    })
    const [settings, setSettings] = useState({
        rankingVisibility: true,
        commissionRate: 20,
        tierThresholds: {
            bronze: 10,
            silver: 50,
            gold: 200,
            platinum: 201
        }
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const [promotersRes, ordersRes, eventsRes] = await Promise.all([
                fetch('/api/promoters'),
                fetch('/api/orders'),
                fetch('/api/events')
            ])

            const [promoters, orders, events] = await Promise.all([
                promotersRes.json(),
                ordersRes.json(),
                eventsRes.json()
            ])

            const activeOrders = orders.filter((o: any) => !o.cancelled && !o.refunded)
            const totalRevenue = activeOrders.reduce((sum: number, o: any) => sum + o.subtotal, 0)

            setStats({
                totalUsers: promoters.length + 1, // +1 for admin
                totalOrders: activeOrders.length,
                totalRevenue,
                webhookUrl: typeof window !== "undefined" ? `${window.location.origin}/api/webhook/posh` : ""
            })
            setLoading(false)
        }
        loadData()
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const copyWebhookUrl = async () => {
        if (stats.webhookUrl) {
            await navigator.clipboard.writeText(stats.webhookUrl)
            // Could add toast notification here
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <Sidebar variant="owner" />
                <div className="ml-64 flex items-center justify-center min-h-screen">
                    <div className="text-white">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            <Sidebar variant="owner" />
            <div className="ml-64">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="mb-12">
                        <h1 className="mb-2 text-3xl font-bold text-white">Configuration</h1>
                        <p className="text-white/60">System-wide settings and webhook setup</p>
                    </div>

                    {/* Webhook Setup Guide */}
                    <Card className="mb-8 border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 backdrop-blur">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Webhook className="h-6 w-6 text-blue-400" />
                                <h2 className="text-xl font-bold text-white">Webhook Setup Guide</h2>
                            </div>
                            <p className="text-white/60 mb-6">
                                Follow these steps to connect your Posh account and start receiving real-time order notifications.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-2">Copy Webhook URL</h3>
                                    <p className="text-white/40 text-sm mb-3">
                                        Copy the webhook endpoint URL below to use in your Posh dashboard.
                                    </p>
                                    <div className="flex gap-3">
                                        <Input
                                            value={stats.webhookUrl}
                                            readOnly
                                            className="bg-gray-800/50 border-gray-600 text-white font-mono text-sm"
                                        />
                                        <Button onClick={copyWebhookUrl} variant="outline">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-2">Configure in Posh</h3>
                                    <p className="text-white/40 text-sm mb-3">
                                        Log into your Posh dashboard and navigate to Settings → Webhooks. Add a new webhook with the URL above.
                                    </p>
                                    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                                        <p className="text-xs text-gray-400 mb-2">Required Settings:</p>
                                        <ul className="text-xs text-gray-300 space-y-1">
                                            <li>• Event Type: <span className="text-blue-400">Order Created</span></li>
                                            <li>• Format: <span className="text-blue-400">JSON</span></li>
                                            <li>• Active: <span className="text-green-400">Enabled</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-2">Test Connection</h3>
                                    <p className="text-white/40 text-sm mb-3">
                                        Use the webhook testing interface to verify your setup is working correctly.
                                    </p>
                                    <Button variant="outline" className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10">
                                        <TestTube className="h-4 w-4 mr-2" />
                                        Test Webhook
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* System Statistics */}
                    <div className="mb-8">
                        <h2 className="mb-6 text-xl font-bold text-white">System Statistics</h2>
                        <div className="grid gap-6 sm:grid-cols-4">
                            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                                <div className="mb-2 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-purple-400" />
                                    <span className="text-sm text-white/60">Total Users</span>
                                </div>
                                <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                            </Card>

                            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                                <div className="mb-2 flex items-center gap-2">
                                    <Database className="h-4 w-4 text-blue-400" />
                                    <span className="text-sm text-white/60">Total Orders</span>
                                </div>
                                <div className="text-3xl font-bold text-white">{stats.totalOrders}</div>
                            </Card>

                            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                                <div className="mb-2 flex items-center gap-2">
                                    <Ticket className="h-4 w-4 text-green-400" />
                                    <span className="text-sm text-white/60">Total Tickets</span>
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    {stats.totalOrders * 2} {/* Rough estimate */}
                                </div>
                            </Card>

                            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                                <div className="mb-2 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-yellow-400" />
                                    <span className="text-sm text-white/60">Total Revenue</span>
                                </div>
                                <div className="text-3xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</div>
                            </Card>
                        </div>
                    </div>

                    {/* Global Settings */}
                    <Card className="border-white/10 bg-white/5 p-8 backdrop-blur">
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <Settings className="h-6 w-6 text-purple-400" />
                                <h2 className="text-xl font-bold text-white">Global Settings</h2>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="ranking-visibility" className="text-white font-medium">
                                        Promoter Ranking Visibility
                                    </Label>
                                    <p className="text-sm text-white/60">
                                        Allow promoters to see their ranking position on leaderboards
                                    </p>
                                </div>
                                <Switch
                                    id="ranking-visibility"
                                    checked={settings.rankingVisibility}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, rankingVisibility: checked }))}
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="commission-rate" className="text-white font-medium">
                                        Default Commission Rate (%)
                                    </Label>
                                    <Input
                                        id="commission-rate"
                                        type="number"
                                        value={settings.commissionRate}
                                        onChange={(e) => setSettings(prev => ({ ...prev, commissionRate: Number(e.target.value) }))}
                                        className="bg-gray-800/50 border-gray-600 text-white mt-2"
                                    />
                                </div>

                                <div>
                                    <Label className="text-white font-medium">
                                        Environment
                                    </Label>
                                    <div className="mt-2 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md">
                                        <span className="text-white text-sm">
                                            {process.env.NODE_ENV === "production" ? "Production" : "Development"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-white font-medium mb-3 block">
                                    Tier Thresholds (Tickets Sold)
                                </Label>
                                <div className="grid gap-4 sm:grid-cols-4">
                                    <div>
                                        <Label htmlFor="bronze-threshold" className="text-xs text-white/60">Bronze</Label>
                                        <Input
                                            id="bronze-threshold"
                                            type="number"
                                            value={settings.tierThresholds.bronze}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                tierThresholds: { ...prev.tierThresholds, bronze: Number(e.target.value) }
                                            }))}
                                            className="bg-gray-800/50 border-gray-600 text-white mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="silver-threshold" className="text-xs text-white/60">Silver</Label>
                                        <Input
                                            id="silver-threshold"
                                            type="number"
                                            value={settings.tierThresholds.silver}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                tierThresholds: { ...prev.tierThresholds, silver: Number(e.target.value) }
                                            }))}
                                            className="bg-gray-800/50 border-gray-600 text-white mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="gold-threshold" className="text-xs text-white/60">Gold</Label>
                                        <Input
                                            id="gold-threshold"
                                            type="number"
                                            value={settings.tierThresholds.gold}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                tierThresholds: { ...prev.tierThresholds, gold: Number(e.target.value) }
                                            }))}
                                            className="bg-gray-800/50 border-gray-600 text-white mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="platinum-threshold" className="text-xs text-white/60">Platinum</Label>
                                        <Input
                                            id="platinum-threshold"
                                            type="number"
                                            value={settings.tierThresholds.platinum}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                tierThresholds: { ...prev.tierThresholds, platinum: Number(e.target.value) }
                                            }))}
                                            className="bg-gray-800/50 border-gray-600 text-white mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <Button className="w-full sm:w-auto">
                                    Save Settings
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}