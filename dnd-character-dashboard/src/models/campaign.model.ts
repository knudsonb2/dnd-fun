import { Session } from './session.model';

export type HazardType = 'trap' | 'poison' | 'disease' | 'curse' | 'environment';
export type HazardSeverity = 'low' | 'moderate' | 'high' | 'deadly';

export interface CampaignHazard {
  id: string;
  name: string;
  type: HazardType;
  severity: HazardSeverity;
  description: string;
  location: string;
  active: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  sessions: Session[];
  notes: string[];
  objectives: {
    title: string;
    description: string;
    completed: boolean;
    progress: number;
  }[];
  hazards: CampaignHazard[];
}
