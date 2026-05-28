import { Campaign } from '../models/campaign.model';
import { Character } from '../models/character.model';
import { Encounter } from '../models/encounter.model';
import { ConditionId, toConditionIdsFromLegacyText } from '../data/conditions';
import { mockCampaign } from '../data/mockCampaign';
import { mockCharacters } from '../data/mockCharacters';

const CAMPAIGN_KEY = 'dnd:campaign';
const CHARACTERS_KEY = 'dnd:characters';
const ENCOUNTERS_KEY = 'dnd:encounters';
const COMBAT_STATE_KEY = 'dnd:combat-state';
const DICE_HISTORY_KEY = 'dnd:dice-history';
const DICE_SOUND_ENABLED_KEY = 'dnd:dice-sound-enabled';

export interface SavedEncounter extends Encounter {
  name: string;
  createdAt: string;
}

export interface CombatantState {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  isPlayer: boolean;
  conditionIds: ConditionId[];
  concentrating: boolean;
}

export interface CombatState {
  round: number;
  turnIndex: number;
  enemyName: string;
  enemyHp: number;
  combatants: CombatantState[];
  eventLog: CombatEvent[];
}

export interface CombatEvent {
  id: string;
  round: number;
  message: string;
  createdAt: string;
}

type LegacyCombatantState = Omit<CombatantState, 'conditionIds'> & {
  conditionIds?: ConditionId[];
  conditions?: string;
};

type StoredCombatState = Omit<CombatState, 'combatants' | 'eventLog'> & {
  combatants?: LegacyCombatantState[];
  eventLog?: CombatEvent[];
};

export interface DiceHistoryEntry {
  id: number;
  count: number;
  sides: number;
  modifier: number;
  mode: 'normal' | 'advantage' | 'disadvantage';
  rolls: number[];
  selectedRoll: number;
  total: number;
  isNat20Crit: boolean;
  isNat1Crit: boolean;
}

const parseCampaignDates = (campaign: Campaign): Campaign => ({
  ...campaign,
  startDate: new Date(campaign.startDate),
  sessions: campaign.sessions.map((session) => ({
    ...session,
    date: new Date(session.date)
  })),
  hazards: Array.isArray(campaign.hazards) ? campaign.hazards : []
});

export const loadCampaign = (): Campaign => {
  const stored = localStorage.getItem(CAMPAIGN_KEY);
  if (!stored) {
    return mockCampaign;
  }

  try {
    const parsed = JSON.parse(stored) as Campaign;
    return parseCampaignDates(parsed);
  } catch {
    return mockCampaign;
  }
};

export const saveCampaign = (campaign: Campaign): void => {
  localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign));
};

export const loadCharacters = (): Character[] => {
  const stored = localStorage.getItem(CHARACTERS_KEY);
  if (!stored) {
    return mockCharacters;
  }

  try {
    return JSON.parse(stored) as Character[];
  } catch {
    return mockCharacters;
  }
};

export const saveCharacters = (characters: Character[]): void => {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
};

export const loadEncounters = (): SavedEncounter[] => {
  const stored = localStorage.getItem(ENCOUNTERS_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as SavedEncounter[];
  } catch {
    return [];
  }
};

export const saveEncounters = (encounters: SavedEncounter[]): void => {
  localStorage.setItem(ENCOUNTERS_KEY, JSON.stringify(encounters));
};

export const loadCombatState = (): CombatState | null => {
  const stored = localStorage.getItem(COMBAT_STATE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as StoredCombatState;

    if (!Array.isArray(parsed.combatants)) {
      return null;
    }

    const combatants: CombatantState[] = parsed.combatants.map((combatant) => {
      const conditionIds = Array.isArray(combatant.conditionIds)
        ? combatant.conditionIds
        : typeof combatant.conditions === 'string'
          ? toConditionIdsFromLegacyText(combatant.conditions)
          : [];

      return {
        id: combatant.id,
        name: combatant.name,
        initiative: combatant.initiative,
        hp: combatant.hp,
        maxHp: combatant.maxHp,
        isPlayer: combatant.isPlayer,
        conditionIds,
        concentrating: combatant.concentrating
      };
    });

    return {
      round: parsed.round ?? 1,
      turnIndex: parsed.turnIndex ?? 0,
      enemyName: parsed.enemyName ?? '',
      enemyHp: parsed.enemyHp ?? 10,
      combatants,
      eventLog: Array.isArray(parsed.eventLog) ? parsed.eventLog : []
    };
  } catch {
    return null;
  }
};

export const saveCombatState = (state: CombatState): void => {
  localStorage.setItem(COMBAT_STATE_KEY, JSON.stringify(state));
};

export const loadDiceHistory = (): DiceHistoryEntry[] => {
  const stored = localStorage.getItem(DICE_HISTORY_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as DiceHistoryEntry[];
  } catch {
    return [];
  }
};

export const saveDiceHistory = (history: DiceHistoryEntry[]): void => {
  localStorage.setItem(DICE_HISTORY_KEY, JSON.stringify(history));
};

export const loadDiceSoundEnabled = (): boolean => {
  const stored = localStorage.getItem(DICE_SOUND_ENABLED_KEY);
  if (!stored) {
    return false;
  }

  try {
    return JSON.parse(stored) as boolean;
  } catch {
    return false;
  }
};

export const saveDiceSoundEnabled = (enabled: boolean): void => {
  localStorage.setItem(DICE_SOUND_ENABLED_KEY, JSON.stringify(enabled));
};
