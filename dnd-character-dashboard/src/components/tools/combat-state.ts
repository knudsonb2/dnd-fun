import { ConditionId } from '../../data/conditions';
import { CombatEvent, CombatState } from '../../utils/storage';

export type Combatant = CombatState['combatants'][number];
export type CombatEventType = 'all' | 'damage' | 'heal' | 'initiative' | 'conditions' | 'general';

export const sortCombatants = (combatants: Combatant[]): Combatant[] =>
  [...combatants].sort((a, b) => {
    if (b.initiative !== a.initiative) {
      return b.initiative - a.initiative;
    }

    return a.name.localeCompare(b.name);
  });

export const createCombatEvent = (round: number, message: string, now = new Date()): CombatEvent => ({
  id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
  round,
  message,
  createdAt: now.toISOString()
});

export const appendCombatEvent = (eventLog: CombatEvent[], event: CombatEvent): CombatEvent[] =>
  [event, ...eventLog].slice(0, 60);

export const rollAllInitiative = (combatants: Combatant[], roll = () => Math.floor(Math.random() * 20) + 1): Combatant[] =>
  combatants.map((combatant) => ({ ...combatant, initiative: roll() }));

export const updateCombatantHp = (combatants: Combatant[], combatantId: string, hp: number): Combatant[] =>
  combatants.map((entry) => (entry.id === combatantId ? { ...entry, hp } : entry));

export const clampHp = (hp: number, maxHp: number): number =>
  Math.min(maxHp, Math.max(0, hp));

export const applyCombatantHpDelta = (
  combatants: Combatant[],
  combatantId: string,
  delta: number
): { combatants: Combatant[]; nextHp: number | null } => {
  const target = combatants.find((entry) => entry.id === combatantId);
  if (!target) {
    return { combatants, nextHp: null };
  }

  const nextHp = clampHp(target.hp + delta, target.maxHp);
  return {
    combatants: updateCombatantHp(combatants, combatantId, nextHp),
    nextHp
  };
};

export const formatHpDeltaEventMessage = (
  combatantName: string,
  delta: number,
  nextHp: number,
  maxHp: number
): string => {
  const direction = delta < 0 ? 'took' : 'healed';
  const amount = Math.abs(delta);
  const capTag = nextHp === 0 ? ' (floored at 0)' : nextHp === maxHp ? ' (capped at max HP)' : '';
  return `${combatantName} ${direction} ${amount} HP (${nextHp}/${maxHp})${capTag}.`;
};

export const normalizeHpAmount = (value: string | number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.floor(Math.abs(parsed)));
};

export const getCombatEventType = (event: CombatEvent): CombatEventType => {
  const message = event.message.toLowerCase();
  if (message.includes('initiative') || message.includes('turn advanced') || message.includes('round')) {
    return 'initiative';
  }

  if (message.includes('took') && message.includes('hp')) {
    return 'damage';
  }

  if (message.includes('healed') && message.includes('hp')) {
    return 'heal';
  }

  if (message.includes('condition') || message.includes('concentrating') || message.includes('toggled')) {
    return 'conditions';
  }

  return 'general';
};

export const filterCombatEvents = (events: CombatEvent[], type: CombatEventType): CombatEvent[] => {
  if (type === 'all') {
    return events;
  }

  return events.filter((event) => getCombatEventType(event) === type);
};

export const updateCombatantInitiative = (
  combatants: Combatant[],
  combatantId: string,
  initiative: number
): Combatant[] => combatants.map((entry) => (entry.id === combatantId ? { ...entry, initiative } : entry));

export const updateCombatantConcentration = (
  combatants: Combatant[],
  combatantId: string,
  concentrating: boolean
): Combatant[] => combatants.map((entry) => (entry.id === combatantId ? { ...entry, concentrating } : entry));

export const removeCombatant = (combatants: Combatant[], combatantId: string): Combatant[] =>
  combatants.filter((entry) => entry.id !== combatantId);

export const toggleCombatantCondition = (
  combatants: Combatant[],
  combatantId: string,
  conditionId: ConditionId
): Combatant[] =>
  combatants.map((entry) => {
    if (entry.id !== combatantId) {
      return entry;
    }

    const active = entry.conditionIds.includes(conditionId);
    return {
      ...entry,
      conditionIds: active ? entry.conditionIds.filter((id) => id !== conditionId) : [...entry.conditionIds, conditionId]
    };
  });

export const pushHistory = (history: CombatState[], snapshot: CombatState): CombatState[] =>
  [snapshot, ...history].slice(0, 50);

export const undoHistory = (history: CombatState[]): { previous: CombatState | null; history: CombatState[] } => {
  const [previous, ...remaining] = history;
  return {
    previous: previous ?? null,
    history: remaining
  };
};
