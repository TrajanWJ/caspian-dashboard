import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Search className="h-8 w-8 text-white/40" />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <h2 className="mb-2 text-2xl font-bold text-white">Page not found</h2>
        <p className="mb-8 text-white/60">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-black hover:bg-white/90">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
