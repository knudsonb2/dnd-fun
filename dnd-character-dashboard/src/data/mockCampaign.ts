import { Campaign } from '../models/campaign.model';

export const mockCampaign: Campaign = {
  id: '1',
  title: 'The Lost City of Eldara',
  description: 'An adventure in the ancient ruins of Eldara',
  startDate: new Date('2023-01-15'),
  sessions: [
    {
      id: '1',
      date: new Date('2023-01-15'),
      time: '7:00 PM',
      summary: 'The party discovers the entrance to the ancient city',
      outcomes: ['Found the entrance to the city', 'Encountered a guard'],
      participants: ['char1', 'char2']
    },
    {
      id: '2',
      date: new Date('2023-01-22'),
      time: '7:00 PM',
      summary: 'The party explores the first chamber',
      outcomes: ['Discovered ancient artifacts', 'Solved a puzzle'],
      participants: ['char1', 'char2']
    }
  ],
  notes: [
    'The city was built around a powerful magical artifact',
    'NPC named Theron is the local guide',
    'The city has a complex maze-like structure',
    'Story element: The artifact is connected to the party members'
  ],
  objectives: [
    {
      title: 'Discover the City',
      description: 'Find the entrance to the lost city of Eldara',
      completed: true,
      progress: 100
    },
    {
      title: 'Find the Artifact',
      description: 'Locate the magical artifact that powers the city',
      completed: false,
      progress: 60
    }
  ],
  hazards: [
    {
      id: 'hazard-1',
      name: 'Needle Trap',
      type: 'trap',
      severity: 'moderate',
      description: 'A hidden pressure plate releases poisoned darts from the wall.',
      location: 'Eldara - Hall of Echoes',
      active: true
    },
    {
      id: 'hazard-2',
      name: 'Shadow Rot',
      type: 'disease',
      severity: 'high',
      description: 'A lingering magical blight that weakens creatures over time.',
      location: 'Eldara - Lower Catacombs',
      active: false
    }
  ]
};
