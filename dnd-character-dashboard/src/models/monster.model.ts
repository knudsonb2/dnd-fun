export interface Monster {
  id: string;
  name: string;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
  type: string;
  alignment: string;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  derivedStats: {
    armorClass: number;
    hitPoints: number;
    speed: number;
    proficiencyBonus: number;
  };
  skills: {
    name: string;
    bonus: number;
  }[];
  savingThrows: {
    ability: string;
    bonus: number;
  }[];
  damageImmunities: string[];
  damageResistances: string[];
  damageVulnerabilities: string[];
  legendaryActions: {
    name: string;
    description: string;
  }[];
  specialAbilities: {
    name: string;
    description: string;
  }[];
}