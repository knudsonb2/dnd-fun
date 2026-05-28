import { Character } from '../../models/character.model';
import { Encounter } from '../../models/encounter.model';

export interface EncounterThresholds {
  easy: number;
  medium: number;
  hard: number;
  deadly: number;
}

export type ActionEconomyRisk = 'Low' | 'Moderate' | 'High';

export interface MonsterXpContribution {
  monsterId: string;
  quantity: number;
  xpEach: number;
  totalXp: number;
}

export interface MonsterQuantityDelta {
  monsterId: string;
  previousQuantity: number;
  currentQuantity: number;
  delta: number;
}

export const areMonsterGroupsEqual = (
  leftGroups: Encounter['monsterGroups'],
  rightGroups: Encounter['monsterGroups']
): boolean => {
  const leftSummary = leftGroups
    .reduce<Record<string, number>>((acc, group) => {
      acc[group.monsterId] = (acc[group.monsterId] ?? 0) + group.quantity;
      return acc;
    }, {});

  const rightSummary = rightGroups
    .reduce<Record<string, number>>((acc, group) => {
      acc[group.monsterId] = (acc[group.monsterId] ?? 0) + group.quantity;
      return acc;
    }, {});

  const leftKeys = Object.keys(leftSummary).sort();
  const rightKeys = Object.keys(rightSummary).sort();

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key, index) => key === rightKeys[index] && leftSummary[key] === rightSummary[key]);
};

export interface EncounterChangeCheckInput {
  currentName: string;
  savedName: string;
  currentEnvironment: string;
  savedEnvironment: string;
  currentGroups: Encounter['monsterGroups'];
  savedGroups: Encounter['monsterGroups'];
}

export const hasEncounterChanges = (input: EncounterChangeCheckInput): boolean => {
  const nameChanged = input.currentName.trim() !== input.savedName;
  const environmentChanged = input.currentEnvironment.trim() !== input.savedEnvironment;
  const groupsChanged = !areMonsterGroupsEqual(input.currentGroups, input.savedGroups);

  return nameChanged || environmentChanged || groupsChanged;
};

const thresholdsByLevel: Record<number, EncounterThresholds> = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 }
};

const fallbackThreshold = thresholdsByLevel[10];

export const getThresholdForLevel = (level: number): EncounterThresholds => thresholdsByLevel[level] ?? fallbackThreshold;

export const getMonsterCountMultiplier = (count: number): number => {
  if (count <= 0) return 1;
  if (count === 1) return 1;
  if (count === 2) return 1.5;
  if (count <= 6) return 2;
  if (count <= 10) return 2.5;
  if (count <= 14) return 3;
  return 4;
};

export const getTotalMonsters = (groups: Encounter['monsterGroups']): number =>
  groups.reduce((total, group) => total + group.quantity, 0);

export const getBaseXp = (groups: Encounter['monsterGroups'], monsterXpById: Record<string, number>): number =>
  groups.reduce((total, group) => total + (monsterXpById[group.monsterId] ?? 0) * group.quantity, 0);

export const getMonsterXpBreakdown = (
  groups: Encounter['monsterGroups'],
  monsterXpById: Record<string, number>
): MonsterXpContribution[] =>
  groups.map((group) => {
    const xpEach = monsterXpById[group.monsterId] ?? 0;
    return {
      monsterId: group.monsterId,
      quantity: group.quantity,
      xpEach,
      totalXp: xpEach * group.quantity
    };
  });

export const getAdjustedXp = (baseXp: number, totalMonsters: number): number =>
  Math.round(baseXp * getMonsterCountMultiplier(totalMonsters));

export const getAdjustedMultiplierForPartySize = (baseMultiplier: number, partySize: number): number => {
  if (partySize < 3) {
    return baseMultiplier + 0.5;
  }

  if (partySize > 5) {
    return Math.max(1, baseMultiplier - 0.5);
  }

  return baseMultiplier;
};

export const getAdjustedXpWithPartySize = (
  baseXp: number,
  totalMonsters: number,
  partySize: number
): { adjustedXp: number; multiplier: number } => {
  const baseMultiplier = getMonsterCountMultiplier(totalMonsters);
  const multiplier = getAdjustedMultiplierForPartySize(baseMultiplier, partySize);
  return {
    adjustedXp: Math.round(baseXp * multiplier),
    multiplier
  };
};

export const getPartyThresholds = (characters: Character[]): EncounterThresholds =>
  characters.reduce(
    (acc, character) => {
      const threshold = getThresholdForLevel(character.level);
      return {
        easy: acc.easy + threshold.easy,
        medium: acc.medium + threshold.medium,
        hard: acc.hard + threshold.hard,
        deadly: acc.deadly + threshold.deadly
      };
    },
    { easy: 0, medium: 0, hard: 0, deadly: 0 }
  );

export const getEncounterDifficulty = (adjustedXp: number, partyThreshold: EncounterThresholds): Encounter['difficulty'] => {
  if (adjustedXp <= partyThreshold.easy) return 'Easy';
  if (adjustedXp <= partyThreshold.medium) return 'Medium';
  if (adjustedXp <= partyThreshold.hard) return 'Hard';
  return 'Deadly';
};

export const getActionEconomyRisk = (monsterCount: number, partySize: number): ActionEconomyRisk => {
  if (partySize <= 0 || monsterCount <= 0) {
    return 'Low';
  }

  const ratio = monsterCount / partySize;
  if (ratio >= 2) {
    return 'High';
  }

  if (ratio >= 1.25) {
    return 'Moderate';
  }

  return 'Low';
};

const xpToCrNumber: Record<number, number> = {
  10: 0,
  25: 0.125,
  50: 0.25,
  100: 0.5,
  200: 1,
  450: 2,
  700: 3,
  1100: 4,
  1800: 5,
  2300: 6,
  2900: 7,
  3900: 8,
  5000: 9,
  5900: 10
};

export const getAveragePartyLevel = (characters: Character[]): number => {
  if (characters.length === 0) {
    return 1;
  }

  const total = characters.reduce((sum, character) => sum + character.level, 0);
  return total / characters.length;
};

export const getApproximateCrFromXp = (xp: number): number => {
  const sortedThresholds = Object.keys(xpToCrNumber)
    .map(Number)
    .sort((a, b) => a - b);

  for (let index = sortedThresholds.length - 1; index >= 0; index -= 1) {
    const threshold = sortedThresholds[index];
    if (xp >= threshold) {
      return xpToCrNumber[threshold];
    }
  }

  return 0;
};

export const hasCrSpikeAgainstParty = (
  groups: Encounter['monsterGroups'],
  monsterXpById: Record<string, number>,
  characters: Character[]
): boolean => {
  const averageLevel = getAveragePartyLevel(characters);

  return groups.some((group) => {
    const approximateCr = getApproximateCrFromXp(monsterXpById[group.monsterId] ?? 0);
    return approximateCr > averageLevel + 2;
  });
};

const difficultyRank: Record<Encounter['difficulty'], number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Deadly: 4
};

export const getDifficultyDelta = (
  current: Encounter['difficulty'],
  previous: Encounter['difficulty']
): number => difficultyRank[current] - difficultyRank[previous];

export const getMonsterQuantityDiff = (
  currentGroups: Encounter['monsterGroups'],
  previousGroups: Encounter['monsterGroups']
): MonsterQuantityDelta[] => {
  const allMonsterIds = Array.from(
    new Set([...currentGroups.map((group) => group.monsterId), ...previousGroups.map((group) => group.monsterId)])
  );

  return allMonsterIds
    .map((monsterId) => {
      const currentQuantity = currentGroups
        .filter((group) => group.monsterId === monsterId)
        .reduce((sum, group) => sum + group.quantity, 0);
      const previousQuantity = previousGroups
        .filter((group) => group.monsterId === monsterId)
        .reduce((sum, group) => sum + group.quantity, 0);

      return {
        monsterId,
        previousQuantity,
        currentQuantity,
        delta: currentQuantity - previousQuantity
      };
    })
    .filter((entry) => entry.delta !== 0)
    .sort((left, right) => left.monsterId.localeCompare(right.monsterId));
};
