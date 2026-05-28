export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
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
  savingThrows: {
    strength: boolean;
    dexterity: boolean;
    constitution: boolean;
    intelligence: boolean;
    wisdom: boolean;
    charisma: boolean;
  };
  skills: {
    acrobatics: boolean;
    animalHandling: boolean;
    arcana: boolean;
    athletics: boolean;
    deception: boolean;
    history: boolean;
    insight: boolean;
    intimidation: boolean;
    investigation: boolean;
    medicine: boolean;
    nature: boolean;
    perception: boolean;
    performance: boolean;
    persuasion: boolean;
    religion: boolean;
    sleightOfHand: boolean;
    stealth: boolean;
    survival: boolean;
  };
  inventory: {
    equipment: string[];
    currency: {
      platinum: number;
      gold: number;
      silver: number;
      copper: number;
    };
  };
  spells: {
    knownSpells: string[];
    spellSlots: {
      level: number;
      slots: number;
      prepared: number;
    }[];
  };
  experience: {
    currentXp: number;
    nextLevelXp: number;
    totalXp: number;
  };
}