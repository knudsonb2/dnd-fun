export const CONDITIONS = [
  { id: 'blinded', label: 'Blinded', effect: 'Auto-fail sight checks; attacks have disadvantage.' },
  { id: 'charmed', label: 'Charmed', effect: 'Cannot attack charmer; charmer has social advantage.' },
  { id: 'deafened', label: 'Deafened', effect: 'Auto-fail hearing checks.' },
  { id: 'frightened', label: 'Frightened', effect: 'Disadvantage while source is in sight; cannot move closer.' },
  { id: 'grappled', label: 'Grappled', effect: 'Speed becomes 0.' },
  { id: 'incapacitated', label: 'Incapacitated', effect: 'Cannot take actions or reactions.' },
  { id: 'invisible', label: 'Invisible', effect: 'Harder to target; attacks can have advantage.' },
  { id: 'paralyzed', label: 'Paralyzed', effect: 'Incapacitated; STR/DEX saves fail; nearby hits can crit.' },
  { id: 'poisoned', label: 'Poisoned', effect: 'Disadvantage on attack rolls and ability checks.' },
  { id: 'prone', label: 'Prone', effect: 'Melee attacks gain advantage; movement costs extra.' },
  { id: 'restrained', label: 'Restrained', effect: 'Speed 0; attacks against have advantage; DEX saves disadvantage.' },
  { id: 'stunned', label: 'Stunned', effect: 'Incapacitated; fails STR/DEX saves.' },
  { id: 'unconscious', label: 'Unconscious', effect: 'Incapacitated; drops prone; unaware of surroundings.' }
] as const;

export type ConditionId = (typeof CONDITIONS)[number]['id'];

const normalize = (value: string): string => value.trim().toLowerCase();

const conditionIdByLabel = new Map<string, ConditionId>(
  CONDITIONS.map((condition) => [normalize(condition.label), condition.id])
);

export const toConditionIdsFromLegacyText = (value: string): ConditionId[] => {
  const parts = value
    .split(',')
    .map(normalize)
    .filter(Boolean);

  const ids = parts
    .map((part) => conditionIdByLabel.get(part))
    .filter((entry): entry is ConditionId => Boolean(entry));

  return Array.from(new Set(ids));
};
