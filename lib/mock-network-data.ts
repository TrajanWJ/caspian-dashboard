import type { PromoterNode } from "@/types/network"

export const mockNetworkData: PromoterNode = {
  id: "root",
  name: "You",
  credit: 47382,
  downstreamCount: 89,
  children: [
    {
      id: "1",
      name: "Sarah Chen",
      credit: 18240,
      downstreamCount: 34,
      children: [
        {
          id: "1-1",
          name: "James Wilson",
          credit: 8120,
          downstreamCount: 12,
          children: [
            { id: "1-1-1", name: "Emma Davis", credit: 2340, downstreamCount: 4 },
            { id: "1-1-2", name: "Michael Brown", credit: 1890, downstreamCount: 3 },
            { id: "1-1-3", name: "Sophia Martinez", credit: 1560, downstreamCount: 2 },
          ],
        },
        {
          id: "1-2",
          name: "Olivia Taylor",
          credit: 5430,
          downstreamCount: 8,
          children: [
            { id: "1-2-1", name: "Noah Anderson", credit: 1670, downstreamCount: 3 },
            { id: "1-2-2", name: "Ava Thomas", credit: 1230, downstreamCount: 2 },
          ],
        },
        { id: "1-3", name: "Ethan Garcia", credit: 2890, downstreamCount: 6 },
      ],
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      credit: 14650,
      downstreamCount: 28,
      children: [
        {
          id: "2-1",
          name: "Isabella Lee",
          credit: 6740,
          downstreamCount: 11,
          children: [
            { id: "2-1-1", name: "Liam White", credit: 2180, downstreamCount: 4 },
            { id: "2-1-2", name: "Mia Harris", credit: 1890, downstreamCount: 3 },
          ],
        },
        { id: "2-2", name: "Lucas Clark", credit: 4320, downstreamCount: 9 },
      ],
    },
    {
      id: "3",
      name: "Alex Kim",
      credit: 9870,
      downstreamCount: 15,
      children: [
        { id: "3-1", name: "Charlotte Lewis", credit: 4560, downstreamCount: 7 },
        { id: "3-2", name: "Benjamin Walker", credit: 3210, downstreamCount: 5 },
      ],
    },
    { id: "4", name: "Jordan Smith", credit: 2890, downstreamCount: 6 },
    { id: "5", name: "Taylor Johnson", credit: 1732, downstreamCount: 6 },
  ],
}
