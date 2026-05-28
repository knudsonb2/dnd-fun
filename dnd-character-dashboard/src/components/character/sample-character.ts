import { Character } from '../../models/character.model';

export const sampleCharacter: Character = {
  id: '1',
  name: 'Aelarion Swiftwind',
  race: 'Elf',
  class: 'Ranger',
  level: 5,
  abilityScores: {
    strength: 12,
    dexterity: 18,
    constitution: 14,
    intelligence: 10,
    wisdom: 16,
    charisma: 13
  },
  derivedStats: {
    armorClass: 16,
    hitPoints: 42,
    speed: 35,
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
    acrobatics: true,
    animalHandling: true,
    arcana: false,
    athletics: false,
    deception: false,
    history: false,
    insight: true,
    intimidation: false,
    investigation: false,
    medicine: false,
    nature: true,
    perception: true,
    performance: false,
    persuasion: false,
    religion: false,
    sleightOfHand: true,
    stealth: true,
    survival: true
  },
  inventory: {
    equipment: [
      'Longbow',
      'Shortsword',
      'Leather Armor',
      'Explorer\'s Pack',
      'Rope (50 ft)',
      'Healing Potion (2)',
      'Thieves\' Tools'
    ],
    currency: {
      platinum: 2,
      gold: 15,
      silver: 8,
      copper: 3
    }
  },
  spells: {
    knownSpells: [
      'Hunter\'s Mark',
      'Pass without Trace',
      'Find Familiar',
      'Moonbeam',
      'Conjure Animals'
    ],
    spellSlots: [
      { level: 1, slots: 4, prepared: 4 },
      { level: 2, slots: 3, prepared: 3 },
      { level: 3, slots: 2, prepared: 2 }
    ]
  },
  experience: {
    currentXp: 3500,
    nextLevelXp: 5000,
    totalXp: 18500
  }
};
