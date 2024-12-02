import { Panel } from "./panel"

// src/types/campaign.ts
export interface Campaign {
    id: string
    clientName: string
    startDate: Date
    endDate: Date
    panels: Panel[]
    status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING'
    trackingHistory: {
      user: string
      timestamp: Date
      action: string
    }[]
  }