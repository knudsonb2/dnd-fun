import { CombatState } from '../../utils/storage';
import {
  applyCombatantHpDelta,
  filterCombatEvents,
  formatHpDeltaEventMessage,
  normalizeHpAmount,
  pushHistory,
  rollAllInitiative,
  undoHistory
} from './combat-state';

const baseState: CombatState = {
  round: 1,
  turnIndex: 0,
  enemyName: '',
  enemyHp: 10,
  combatants: [
    {
      id: 'pc-1',
      name: 'Aria',
      initiative: 0,
      hp: 22,
      maxHp: 22,
      isPlayer: true,
      conditionIds: [],
      concentrating: false
    }
  ],
  eventLog: []
};

describe('combat-state', () => {
  test('pushHistory prepends latest snapshot', () => {
    const first = { ...baseState, round: 1 };
    const second = { ...baseState, round: 2 };

    const history = pushHistory([first], second);

    expect(history[0].round).toBe(2);
    expect(history[1].round).toBe(1);
  });

  test('pushHistory enforces max history length', () => {
    const entries = Array.from({ length: 50 }, (_, index) => ({ ...baseState, round: index + 1 }));
    const next = { ...baseState, round: 99 };

    const history = pushHistory(entries, next);

    expect(history).toHaveLength(50);
    expect(history[0].round).toBe(99);
  });

  test('undoHistory returns previous snapshot and trims history', () => {
    const first = { ...baseState, round: 1 };
    const second = { ...baseState, round: 2 };

    const result = undoHistory([second, first]);

    expect(result.previous?.round).toBe(2);
    expect(result.history).toHaveLength(1);
    expect(result.history[0].round).toBe(1);
  });

  test('undoHistory returns null when history is empty', () => {
    const result = undoHistory([]);
    expect(result.previous).toBeNull();
    expect(result.history).toEqual([]);
  });

  test('rollAllInitiative uses provided deterministic roller', () => {
    const result = rollAllInitiative(baseState.combatants, () => 13);
    expect(result[0].initiative).toBe(13);
  });

  test('applyCombatantHpDelta clamps damage to zero', () => {
    const { combatants, nextHp } = applyCombatantHpDelta(baseState.combatants, 'pc-1', -50);
    expect(nextHp).toBe(0);
    expect(combatants[0].hp).toBe(0);
  });

  test('applyCombatantHpDelta clamps healing to max hp', () => {
    const wounded = [{ ...baseState.combatants[0], hp: 20 }];
    const { combatants, nextHp } = applyCombatantHpDelta(wounded, 'pc-1', 99);
    expect(nextHp).toBe(22);
    expect(combatants[0].hp).toBe(22);
  });

  test('formatHpDeltaEventMessage includes floor and cap notes', () => {
    const floored = formatHpDeltaEventMessage('Aria', -9, 0, 22);
    const capped = formatHpDeltaEventMessage('Aria', 9, 22, 22);
    expect(floored).toMatch(/floored at 0/i);
    expect(capped).toMatch(/capped at max hp/i);
  });

  test('normalizeHpAmount returns positive integers only', () => {
    expect(normalizeHpAmount('5')).toBe(5);
    expect(normalizeHpAmount('-7')).toBe(7);
    expect(normalizeHpAmount('2.9')).toBe(2);
    expect(normalizeHpAmount('foo')).toBe(0);
  });

  test('filterCombatEvents filters by event type', () => {
    const events = [
      { id: '1', round: 1, message: 'Aria took 5 HP (17/22).', createdAt: '2026-01-01T00:00:00.000Z' },
      { id: '2', round: 1, message: 'Aria healed 3 HP (20/22).', createdAt: '2026-01-01T00:00:01.000Z' },
      { id: '3', round: 1, message: 'Rolled initiative for all combatants.', createdAt: '2026-01-01T00:00:02.000Z' }
    ];

    expect(filterCombatEvents(events, 'damage')).toHaveLength(1);
    expect(filterCombatEvents(events, 'heal')).toHaveLength(1);
    expect(filterCombatEvents(events, 'initiative')).toHaveLength(1);
    expect(filterCombatEvents(events, 'all')).toHaveLength(3);
  });
});
