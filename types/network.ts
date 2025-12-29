export interface PromoterNode {
  id: string
  name: string
  credit: number
  downstreamCount: number
  children?: PromoterNode[]
  isExpanded?: boolean
}
