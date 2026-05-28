import { Character } from '../../models/character.model';
import {
  areMonsterGroupsEqual,
  getActionEconomyRisk,
  getApproximateCrFromXp,
  getAveragePartyLevel,
  getAdjustedMultiplierForPartySize,
  getAdjustedXp,
  getAdjustedXpWithPartySize,
  getBaseXp,
  getDifficultyDelta,
  getEncounterDifficulty,
  getMonsterQuantityDiff,
  getMonsterXpBreakdown,
  getMonsterCountMultiplier,
  getPartyThresholds,
  getThresholdForLevel,
  getTotalMonsters,
  hasCrSpikeAgainstParty
} from './encounter-math';

const createCharacter = (id: string, level: number): Character => ({
  id,
  name: id,
  race: 'Human',
  class: 'Fighter',
  level,
  abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
  derivedStats: { armorClass: 15, hitPoints: 12, speed: 30, proficiencyBonus: 2 },
  savingThrows: { strength: false, dexterity: false, constitution: false, intelligence: false, wisdom: false, charisma: false },
  skills: {
    acrobatics: false,
    animalHandling: false,
    arcana: false,
    athletics: false,
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
    equipment: [],
    currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }
  },
  spells: {
    knownSpells: [],
    spellSlots: []
  },
  experience: {
    currentXp: 0,
    nextLevelXp: 300,
    totalXp: 0
  }
});

describe('encounter-math', () => {
  test('thresholds fallback to level 10 for unsupported levels', () => {
    expect(getThresholdForLevel(99)).toEqual({ easy: 600, medium: 1200, hard: 1900, deadly: 2800 });
  });

  test('monster count multiplier follows expected tiers', () => {
    expect(getMonsterCountMultiplier(1)).toBe(1);
    expect(getMonsterCountMultiplier(2)).toBe(1.5);
    expect(getMonsterCountMultiplier(6)).toBe(2);
    expect(getMonsterCountMultiplier(10)).toBe(2.5);
    expect(getMonsterCountMultiplier(14)).toBe(3);
    expect(getMonsterCountMultiplier(20)).toBe(4);
  });

  test('computes total monsters and base XP from grouped monsters', () => {
    const groups = [
      { monsterId: 'goblin', quantity: 3 },
      { monsterId: 'ogre', quantity: 1 }
    ];
    const xpById = { goblin: 50, ogre: 450 };

    expect(getTotalMonsters(groups)).toBe(4);
    expect(getBaseXp(groups, xpById)).toBe(600);
    expect(getAdjustedXp(600, 4)).toBe(1200);
  });

  test('sums party thresholds by character level', () => {
    const characters = [createCharacter('c1', 1), createCharacter('c2', 3)];
    expect(getPartyThresholds(characters)).toEqual({
      easy: 100,
      medium: 200,
      hard: 300,
      deadly: 500
    });
  });

  test('returns difficulty bands from adjusted XP and thresholds', () => {
    const thresholds = { easy: 100, medium: 200, hard: 300, deadly: 400 };
    expect(getEncounterDifficulty(80, thresholds)).toBe('Easy');
    expect(getEncounterDifficulty(150, thresholds)).toBe('Medium');
    expect(getEncounterDifficulty(250, thresholds)).toBe('Hard');
    expect(getEncounterDifficulty(999, thresholds)).toBe('Deadly');
  });

  test('adjusts multiplier by party size', () => {
    expect(getAdjustedMultiplierForPartySize(2, 2)).toBe(2.5);
    expect(getAdjustedMultiplierForPartySize(2, 4)).toBe(2);
    expect(getAdjustedMultiplierForPartySize(2, 6)).toBe(1.5);
  });

  test('computes adjusted xp with party-size aware multiplier', () => {
    const result = getAdjustedXpWithPartySize(600, 4, 2);
    expect(result.multiplier).toBe(2.5);
    expect(result.adjustedXp).toBe(1500);
  });

  test('returns action economy risk tiers', () => {
    expect(getActionEconomyRisk(2, 4)).toBe('Low');
    expect(getActionEconomyRisk(5, 4)).toBe('Moderate');
    expect(getActionEconomyRisk(8, 4)).toBe('High');
  });

  test('creates per-group xp breakdown', () => {
    const groups = [
      { monsterId: 'goblin', quantity: 2 },
      { monsterId: 'ogre', quantity: 1 }
    ];
    const breakdown = getMonsterXpBreakdown(groups, { goblin: 50, ogre: 450 });
    expect(breakdown).toEqual([
      { monsterId: 'goblin', quantity: 2, xpEach: 50, totalXp: 100 },
      { monsterId: 'ogre', quantity: 1, xpEach: 450, totalXp: 450 }
    ]);
  });

  test('computes average party level', () => {
    const characters = [createCharacter('c1', 2), createCharacter('c2', 4), createCharacter('c3', 6)];
    expect(getAveragePartyLevel(characters)).toBe(4);
  });

  test('approximates cr from xp', () => {
    expect(getApproximateCrFromXp(450)).toBe(2);
    expect(getApproximateCrFromXp(100)).toBe(0.5);
    expect(getApproximateCrFromXp(5)).toBe(0);
  });

  test('flags cr spike monsters against party level', () => {
    const lowLevelParty = [createCharacter('c1', 1), createCharacter('c2', 1), createCharacter('c3', 1)];
    const groups = [{ monsterId: 'dragonish', quantity: 1 }];
    const hasSpike = hasCrSpikeAgainstParty(groups, { dragonish: 2300 }, lowLevelParty);
    expect(hasSpike).toBe(true);
  });

  test('computes difficulty deltas by tier', () => {
    expect(getDifficultyDelta('Hard', 'Medium')).toBe(1);
    expect(getDifficultyDelta('Easy', 'Deadly')).toBe(-3);
    expect(getDifficultyDelta('Deadly', 'Deadly')).toBe(0);
  });

  test('computes monster quantity diff against saved encounter', () => {
    const previousGroups = [
      { monsterId: 'goblin', quantity: 2 },
      { monsterId: 'orc', quantity: 1 }
    ];
    const currentGroups = [
      { monsterId: 'goblin', quantity: 3 },
      { monsterId: 'ogre', quantity: 1 }
    ];

    expect(getMonsterQuantityDiff(currentGroups, previousGroups)).toEqual([
      { monsterId: 'goblin', previousQuantity: 2, currentQuantity: 3, delta: 1 },
      { monsterId: 'ogre', previousQuantity: 0, currentQuantity: 1, delta: 1 },
      { monsterId: 'orc', previousQuantity: 1, currentQuantity: 0, delta: -1 }
    ]);
  });

  test('compares monster groups by aggregated quantity', () => {
    const first = [
      { monsterId: 'goblin', quantity: 1 },
      { monsterId: 'goblin', quantity: 2 },
      { monsterId: 'orc', quantity: 1 }
    ];
    const second = [
      { monsterId: 'orc', quantity: 1 },
      { monsterId: 'goblin', quantity: 3 }
    ];
    const third = [
      { monsterId: 'orc', quantity: 1 },
      { monsterId: 'goblin', quantity: 2 }
    ];

    expect(areMonsterGroupsEqual(first, second)).toBe(true);
    expect(areMonsterGroupsEqual(first, third)).toBe(false);
  });
});
