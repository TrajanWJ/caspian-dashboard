"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Sidebar } from "@/components/sidebar"
import { Edit, Trash2, User, Shield, Crown } from "lucide-react"
import { useState, useEffect } from "react"

interface User {
    id: string
    username: string
    email: string
    role: "admin" | "promoter"
    active: boolean
    created_at: string
    total_tickets_sold?: number
    total_revenue_generated?: number
    promo_codes?: Array<{ id: string; code: string }>
}

export default function AccountsPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const promotersRes = await fetch('/api/promoters')
            const promoters = await promotersRes.json()
            const mockUsers: User[] = [
                {
                    id: "admin-1",
                    username: "admin",
                    email: "admin@example.com",
                    role: "admin",
                    active: true,
                    created_at: "2024-01-01T00:00:00Z",
                },
                ...promoters.map((p: any) => ({
                    id: p.id,
                    username: p.first_name + " " + p.last_name,
                    email: p.email,
                    role: "promoter" as const,
                    active: true,
                    created_at: p.created_at,
                    total_tickets_sold: p.total_tickets_sold,
                    total_revenue_generated: p.total_revenue_generated,
                    promo_codes: [] // Would need to be populated from actual data
                }))
            ]
            setUsers(mockUsers)
            setLoading(false)
        }
        loadData()
    }, [])

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(dateString))
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "admin":
                return <Crown className="h-4 w-4" />
            case "promoter":
                return <User className="h-4 w-4" />
            default:
                return <Shield className="h-4 w-4" />
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-purple-500/20 text-purple-400 border-purple-500/30"
            case "promoter":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const getStatusColor = (active: boolean) => {
        return active
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-red-500/20 text-red-400 border-red-500/30"
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
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
                        <h1 className="mb-2 text-3xl font-bold text-white">Account Management</h1>
                        <p className="text-white/60">Complete administrative control over all user accounts</p>
                    </div>

                    {/* Summary Stats */}
                    <div className="mb-12 grid gap-6 sm:grid-cols-4">
                        <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div className="mb-2 text-sm text-white/40">Total Users</div>
                            <div className="text-4xl font-bold text-white">{users.length}</div>
                        </Card>
                        <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div className="mb-2 text-sm text-white/40">Active Users</div>
                            <div className="text-4xl font-bold text-white">
                                {users.filter((u) => u.active).length}
                            </div>
                        </Card>
                        <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div className="mb-2 text-sm text-white/40">Administrators</div>
                            <div className="text-4xl font-bold text-white">
                                {users.filter((u) => u.role === "admin").length}
                            </div>
                        </Card>
                        <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div className="mb-2 text-sm text-white/40">Promoters</div>
                            <div className="text-4xl font-bold text-white">
                                {users.filter((u) => u.role === "promoter").length}
                            </div>
                        </Card>
                    </div>

                    {/* User Directory */}
                    <div className="space-y-4">
                        {users
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((user) => (
                                <Card key={user.id} className="border-white/10 bg-white/5 p-6 backdrop-blur">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                                {getRoleIcon(user.role)}
                                            </div>
                                            <div>
                                                <div className="mb-1 flex items-center gap-3">
                                                    <h3 className="text-lg font-bold text-white">{user.username}</h3>
                                                    <Badge className={`border ${getRoleColor(user.role)}`}>
                                                        {user.role}
                                                    </Badge>
                                                    <Badge className={`border ${getStatusColor(user.active)}`}>
                                                        {user.active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-white/60">{user.email}</div>
                                                <div className="text-xs text-white/40">Joined {formatDate(user.created_at)}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {user.role === "promoter" && (
                                                <div className="text-right">
                                                    <div className="text-sm text-white/40">Performance</div>
                                                    <div className="text-lg font-bold text-white">
                                                        {user.total_tickets_sold || 0} tickets
                                                    </div>
                                                    <div className="text-sm text-green-400">
                                                        {formatCurrency(user.total_revenue_generated || 0)}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-gray-900 border-gray-700">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-white">Edit Account</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <Label htmlFor="username" className="text-white">Username</Label>
                                                                <Input
                                                                    id="username"
                                                                    defaultValue={user.username}
                                                                    className="bg-gray-800 border-gray-600 text-white"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="email" className="text-white">Email</Label>
                                                                <Input
                                                                    id="email"
                                                                    type="email"
                                                                    defaultValue={user.email}
                                                                    className="bg-gray-800 border-gray-600 text-white"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="role" className="text-white">Role</Label>
                                                                <Select defaultValue={user.role}>
                                                                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-gray-800 border-gray-600">
                                                                        <SelectItem value="admin">Administrator</SelectItem>
                                                                        <SelectItem value="promoter">Promoter</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="status" className="text-white">Status</Label>
                                                                <Select defaultValue={user.active ? "active" : "inactive"}>
                                                                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-gray-800 border-gray-600">
                                                                        <SelectItem value="active">Active</SelectItem>
                                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <Button className="w-full">Update Account</Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {user.username !== "admin" && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-gray-900 border-gray-700">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-white">Delete Account</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-gray-400">
                                                                    Are you sure you want to delete {user.username}? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Promo Codes Section */}
                                    {user.role === "promoter" && user.promo_codes && user.promo_codes.length > 0 && (
                                        <div className="mt-6 border-t border-white/10 pt-6">
                                            <div className="mb-3 text-sm font-medium text-white/60">Promo Codes</div>
                                            <div className="flex flex-wrap gap-2">
                                                {user.promo_codes.map((code) => (
                                                    <Badge key={code.id} variant="outline" className="border-blue-400/30 text-blue-400">
                                                        {code.code}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}