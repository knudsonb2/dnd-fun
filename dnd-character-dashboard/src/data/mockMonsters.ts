import { Monster } from '../models/monster.model';

export const mockMonsters: Monster[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    size: 'Small',
    type: 'Humanoid',
    alignment: 'Neutral Evil',
    abilityScores: { strength: 8, dexterity: 14, constitution: 10, intelligence: 10, wisdom: 8, charisma: 8 },
    derivedStats: { armorClass: 15, hitPoints: 7, speed: 30, proficiencyBonus: 2 },
    skills: [{ name: 'Stealth', bonus: 6 }],
    savingThrows: [],
    damageImmunities: [],
    damageResistances: [],
    damageVulnerabilities: [],
    legendaryActions: [],
    specialAbilities: [{ name: 'Nimble Escape', description: 'Can disengage or hide as a bonus action.' }]
  },
  {
    id: 'orc',
    name: 'Orc',
    size: 'Medium',
    type: 'Humanoid',
    alignment: 'Chaotic Evil',
    abilityScores: { strength: 16, dexterity: 12, constitution: 16, intelligence: 7, wisdom: 11, charisma: 10 },
    derivedStats: { armorClass: 13, hitPoints: 15, speed: 30, proficiencyBonus: 2 },
    skills: [{ name: 'Intimidation', bonus: 2 }],
    savingThrows: [],
    damageImmunities: [],
    damageResistances: [],
    damageVulnerabilities: [],
    legendaryActions: [],
    specialAbilities: [{ name: 'Aggressive', description: 'Can move up to speed toward an enemy as a bonus action.' }]
  },
  {
    id: 'ogre',
    name: 'Ogre',
    size: 'Large',
    type: 'Giant',
    alignment: 'Chaotic Evil',
    abilityScores: { strength: 19, dexterity: 8, constitution: 16, intelligence: 5, wisdom: 7, charisma: 7 },
    derivedStats: { armorClass: 11, hitPoints: 59, speed: 40, proficiencyBonus: 2 },
    skills: [],
    savingThrows: [],
    damageImmunities: [],
    damageResistances: [],
    damageVulnerabilities: [],
    legendaryActions: [],
    specialAbilities: []
  }
];

export const monsterXpById: Record<string, number> = {
  goblin: 50,
  orc: 100,
  ogre: 450
};
