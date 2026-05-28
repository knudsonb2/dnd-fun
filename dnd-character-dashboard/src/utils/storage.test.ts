import { loadCampaign, loadCombatState } from './storage';

describe('storage campaign migration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('adds default hazards array when loading legacy campaign data', () => {
    localStorage.setItem(
      'dnd:campaign',
      JSON.stringify({
        id: 'legacy-campaign',
        title: 'Legacy Chronicle',
        description: 'Older saved campaign data',
        startDate: '2024-01-01T00:00:00.000Z',
        sessions: [],
        notes: [],
        objectives: []
      })
    );

    const campaign = loadCampaign();

    expect(campaign.hazards).toEqual([]);
  });
});

describe('storage combat state migration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('migrates legacy string conditions into conditionIds', () => {
    localStorage.setItem(
      'dnd:combat-state',
      JSON.stringify({
        round: 2,
        turnIndex: 1,
        enemyName: 'Ghoul',
        enemyHp: 22,
        combatants: [
          {
            id: 'a',
            name: 'Aria',
            initiative: 14,
            hp: 21,
            maxHp: 28,
            isPlayer: true,
            conditions: 'Poisoned, Grappled',
            concentrating: false
          }
        ]
      })
    );

    const state = loadCombatState();

    expect(state).not.toBeNull();
    expect(state?.combatants[0].conditionIds).toEqual(['poisoned', 'grappled']);
  });
});
