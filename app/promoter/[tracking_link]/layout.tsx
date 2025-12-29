import type React from "react"
import { PromoterNav } from "@/components/promoter-nav"
import { getPromoterByTrackingLink } from "@/lib/data-store"
import { notFound } from "next/navigation"

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
      <PromoterNav trackingLink={tracking_link} promoterName={`${promoter.first_name} ${promoter.last_name}`} />
      {children}
    </div>
  )
}
