import { Character } from '../models/character.model';

export const mockCharacters: Character[] = [
  {
    id: 'char1',
    name: 'Aelarion',
    race: 'Elf',
    class: 'Ranger',
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 16,
      constitution: 12,
      intelligence: 14,
      wisdom: 15,
      charisma: 13
    },
    derivedStats: {
      armorClass: 14,
      hitPoints: 32,
      speed: 30,
      proficiencyBonus: 3
    },
    savingThrows: {
      strength: false,
      dexterity: true,
      constitution: false,
      intelligence: false,
      wisdom: true,
      charisma: false
    },
    skills: {
      acrobatics: false,
      animalHandling: true,
      arcana: false,
      athletics: false,
      deception: false,
      history: false,
      insight: false,
      intimidation: false,
      investigation: true,
      medicine: false,
      nature: true,
      perception: true,
      performance: false,
      persuasion: false,
      religion: false,
      sleightOfHand: false,
      stealth: true,
      survival: true
    },
    inventory: {
      equipment: ['Longbow', 'Leather Armor', 'Rope', 'Healing Potion'],
      currency: {
        platinum: 0,
        gold: 15,
        silver: 20,
        copper: 10
      }
    },
    spells: {
      knownSpells: ['Pass Without Trace', 'Find Familiar'],
      spellSlots: [
        { level: 1, slots: 4, prepared: 4 },
        { level: 2, slots: 2, prepared: 2 }
      ]
    },
    experience: {
      currentXp: 1200,
      nextLevelXp: 2000,
      totalXp: 3500
    }
  },
  {
    id: 'char2',
    name: 'Tharok',
    race: 'Dwarf',
    class: 'Fighter',
    level: 4,
    abilityScores: {
      strength: 18,
      dexterity: 12,
      constitution: 16,
      intelligence: 10,
      wisdom: 12,
      charisma: 11
    },
    derivedStats: {
      armorClass: 16,
      hitPoints: 38,
      speed: 25,
      proficiencyBonus: 2
    },
    savingThrows: {
      strength: true,
      dexterity: false,
      constitution: true,
      intelligence: false,
      wisdom: false,
      charisma: false
    },
    skills: {
      acrobatics: false,
      animalHandling: false,
      arcana: false,
      athletics: true,
      deception: false,
      history: false,
      insight: false,
      intimidation: false,
      investigation: false,
      medicine: false,
      nature: false,
      perception: false,
      performance: false,
      persuasion: false,
      religion: false,
      sleightOfHand: false,
      stealth: false,
      survival: false
    },
    inventory: {
      equipment: ['Battleaxe', 'Chain Mail', 'Shield'],
      currency: {
        platinum: 0,
        gold: 25,
        silver: 10,
        copper: 5
      }
    },
    spells: {
      knownSpells: [],
      spellSlots: []
    },
    experience: {
      currentXp: 1800,
      nextLevelXp: 2500,
      totalXp: 3800
    }
  }
];
