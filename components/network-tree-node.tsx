"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PromoterNode } from "@/types/network"

interface NetworkTreeNodeProps {
  node: PromoterNode
  level: number
}

export function NetworkTreeNode({ node, level }: NetworkTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "group flex items-center justify-between rounded-md border border-border bg-card p-4 transition-all hover:border-accent/50",
          hasChildren && "cursor-pointer",
          level === 0 && "border-accent bg-accent/5",
        )}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {hasChildren && (
            <div className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          )}
          {!hasChildren && <div className="h-6 w-6" />}

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-medium">
            {node.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>

          <div>
            <div className="font-medium text-foreground">{node.name}</div>
            <div className="text-xs text-muted-foreground">{node.downstreamCount} downstream</div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-lg font-semibold text-foreground">{node.credit.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">credit</div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-8 space-y-2 border-l-2 border-border pl-6">
          {node.children!.map((child) => (
            <NetworkTreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
