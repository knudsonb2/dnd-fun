export interface Encounter {
  id: string;
  monsterGroups: {
    monsterId: string;
    quantity: number;
  }[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  environment: string;
  combatStats: {
    initiative: number;
    totalHp: number;
    totalAc: number;
  };
}