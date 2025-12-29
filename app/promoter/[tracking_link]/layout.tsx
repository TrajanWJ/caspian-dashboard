import type React from "react"
import { getPromoterByTrackingLink } from "@/lib/data-store"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

export default async function PromoterLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tracking_link: string }>
}) {
  const { tracking_link } = await params
  const promoter = await getPromoterByTrackingLink(tracking_link)

  if (!promoter) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar
        variant="promoter"
        trackingLink={tracking_link}
        promoterName={`${promoter.first_name} ${promoter.last_name}`}
      />
      <div className="ml-64">
        {children}
      </div>
    </div>
  )
}
