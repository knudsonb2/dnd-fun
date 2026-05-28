import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Character } from '../../models/character.model';
import { loadCombatState, saveCombatState, CombatEvent, CombatState } from '../../utils/storage';
import { CONDITIONS, ConditionId } from '../../data/conditions';
import FantasyPageBanner from '../FantasyPageBanner';
import dragonSigil from '../../assets/fantasy/dragon-sigil.svg';
import {
  appendCombatEvent,
  applyCombatantHpDelta,
  filterCombatEvents,
  formatHpDeltaEventMessage,
  normalizeHpAmount,
  CombatEventType,
  createCombatEvent,
  pushHistory as pushCombatHistory,
  removeCombatant,
  rollAllInitiative as rollAllInitiativeForCombatants,
  sortCombatants,
  toggleCombatantCondition,
  undoHistory,
  updateCombatantConcentration,
  updateCombatantHp,
  updateCombatantInitiative
} from './combat-state';

type Combatant = {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  isPlayer: boolean;
  conditionIds: ConditionId[];
  concentrating: boolean;
};

const Container = styled.div`
  display: grid;
  gap: 0.8rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, minmax(80px, 1fr));
  gap: 8px;
  align-items: center;
`;

const Row = styled(Grid)`
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 8px;
`;

const Button = styled.button`
  border: 1px solid transparent;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: white;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  min-height: 44px;
`;

const ShortcutRow = styled.div`
  grid-column: span 8;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const ShortcutButton = styled.button<{ $variant: 'damage' | 'heal' }>`
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 6px 10px;
  min-height: 44px;
  cursor: pointer;
  color: white;
  background: ${({ $variant }) =>
    $variant === 'damage'
      ? 'linear-gradient(135deg, color-mix(in oklch, var(--brand), black 20%), color-mix(in oklch, var(--brand), black 35%))'
      : 'linear-gradient(135deg, var(--accent), color-mix(in oklch, var(--accent), black 18%))'};
`;

const LogFilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : 'var(--border)')};
  background: ${({ $active }) => ($active ? 'linear-gradient(135deg, var(--brand), var(--brand-2))' : 'var(--surface)')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--text-default)')};
  border-radius: 999px;
  padding: 6px 10px;
  min-height: 44px;
  cursor: pointer;
`;

const ImportInput = styled.input`
  display: block;
  margin-top: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
`;

const ConditionShelf = styled.div`
  grid-column: span 8;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const ConditionChip = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : 'var(--border)')};
  background: ${({ $active }) => ($active ? 'linear-gradient(135deg, var(--brand), var(--brand-2))' : 'var(--surface)')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--text-default)')};
  border-radius: 999px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 0.82rem;
`;

const EventLog = styled.ul`
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.3rem;
`;

const concentrationReminderByCondition: Partial<Record<ConditionId, string>> = {
  incapacitated: 'Concentration immediately ends.',
  paralyzed: 'Concentration immediately ends.',
  stunned: 'Concentration immediately ends.',
  unconscious: 'Concentration immediately ends.'
};

const createDefaultCombatants = (characters: Character[]): Combatant[] =>
  characters.map((character) => ({
    id: character.id,
    name: character.name,
    initiative: 0,
    hp: character.derivedStats.hitPoints,
    maxHp: character.derivedStats.hitPoints,
    isPlayer: true,
    conditionIds: [],
    concentrating: false
  }));

const CombatTracker: React.FC<{ characters: Character[] }> = ({ characters }) => {
  const initialState = loadCombatState();
  const [combatants, setCombatants] = useState<Combatant[]>(initialState?.combatants ?? createDefaultCombatants(characters));
  const [round, setRound] = useState(initialState?.round ?? 1);
  const [turnIndex, setTurnIndex] = useState(initialState?.turnIndex ?? 0);
  const [enemyName, setEnemyName] = useState(initialState?.enemyName ?? '');
  const [enemyHp, setEnemyHp] = useState(initialState?.enemyHp ?? 10);
  const [eventLog, setEventLog] = useState<CombatEvent[]>(initialState?.eventLog ?? []);
  const [history, setHistory] = useState<CombatState[]>([]);
  const [customHpAmounts, setCustomHpAmounts] = useState<Record<string, string>>({});
  const [activeLogFilter, setActiveLogFilter] = useState<CombatEventType>('all');

  const sortedCombatants = useMemo(
    () => sortCombatants(combatants),
    [combatants]
  );

  const activeCombatant = sortedCombatants[turnIndex];

  useEffect(() => {
    const state: CombatState = {
      round,
      turnIndex,
      enemyName,
      enemyHp,
      combatants,
      eventLog
    };
    saveCombatState(state);
  }, [round, turnIndex, enemyName, enemyHp, combatants, eventLog]);

  const snapshotState = (): CombatState => ({
    round,
    turnIndex,
    enemyName,
    enemyHp,
    combatants,
    eventLog
  });

  const pushHistory = () => {
    const previous = snapshotState();
    setHistory((entries) => pushCombatHistory(entries, previous));
  };

  const appendEvent = (message: string, roundNumber = round) => {
    setEventLog((entries) => appendCombatEvent(entries, createCombatEvent(roundNumber, message)));
  };

  const nextTurn = () => {
    if (sortedCombatants.length === 0) return;
    pushHistory();
    const nextIndex = turnIndex + 1;
    if (nextIndex >= sortedCombatants.length) {
      setRound(round + 1);
      setTurnIndex(0);
      appendEvent(`Round ${round + 1} begins.`, round + 1);
      return;
    }
    setTurnIndex(nextIndex);
    appendEvent(`Turn advanced to ${sortedCombatants[nextIndex].name}.`);
  };

  const rollAllInitiative = () => {
    if (combatants.length === 0) {
      return;
    }

    pushHistory();
    const rolled = rollAllInitiativeForCombatants(combatants);
    setCombatants(rolled);
    setTurnIndex(0);
    appendEvent('Rolled initiative for all combatants.');
  };

  const undoLastAction = () => {
    const { previous, history: remaining } = undoHistory(history);
    if (!previous) {
      return;
    }

    setRound(previous.round);
    setTurnIndex(previous.turnIndex);
    setEnemyName(previous.enemyName);
    setEnemyHp(previous.enemyHp);
    setCombatants(previous.combatants);
    setEventLog(previous.eventLog);
    setHistory(remaining);
  };

  const exportCombatState = () => {
    const state: CombatState = {
      round,
      turnIndex,
      enemyName,
      enemyHp,
      combatants,
      eventLog
    };
    const payload = JSON.stringify(state, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dnd-combat-state.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importCombatState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as CombatState;
        if (!Array.isArray(parsed.combatants)) {
          return;
        }
        setCombatants(parsed.combatants);
        setRound(parsed.round ?? 1);
        setTurnIndex(parsed.turnIndex ?? 0);
        setEnemyName(parsed.enemyName ?? '');
        setEnemyHp(parsed.enemyHp ?? 10);
        setEventLog(parsed.eventLog ?? []);
        setHistory([]);
      } catch {
        return;
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetCombat = () => {
    pushHistory();
    setCombatants(createDefaultCombatants(characters));
    setRound(1);
    setTurnIndex(0);
    setEnemyName('');
    setEnemyHp(10);
    appendEvent('Combat reset.');
  };

  const toggleCondition = (combatantId: string, conditionId: ConditionId) => {
    pushHistory();
    setCombatants((currentCombatants) => toggleCombatantCondition(currentCombatants, combatantId, conditionId));

    const condition = CONDITIONS.find((entry) => entry.id === conditionId);
    if (condition) {
      appendEvent(`Toggled ${condition.label}.`);
    }
  };

  const applyHpShortcut = (combatant: Combatant, delta: number) => {
    pushHistory();
    setCombatants((currentCombatants) => {
      const { combatants: updatedCombatants, nextHp } = applyCombatantHpDelta(currentCombatants, combatant.id, delta);
      if (nextHp !== null) {
        appendEvent(formatHpDeltaEventMessage(combatant.name, delta, nextHp, combatant.maxHp));
      }
      return updatedCombatants;
    });
  };

  const applyCustomHpAmount = (combatant: Combatant, direction: 'damage' | 'heal') => {
    const amount = normalizeHpAmount(customHpAmounts[combatant.id] ?? '');
    if (amount === 0) {
      return;
    }

    const delta = direction === 'damage' ? -amount : amount;
    applyHpShortcut(combatant, delta);
  };

  const filteredEvents = useMemo(
    () => filterCombatEvents(eventLog, activeLogFilter),
    [eventLog, activeLogFilter]
  );

  return (
    <Container>
      <FantasyPageBanner
        title="Battle Command"
        subtitle="Run initiative, track conditions, and steer every round with clarity."
        imageSrc={dragonSigil}
        imageAlt="Arcane dragon sigil"
      />
      <h1>Combat Tracker</h1>
      <p>Round {round}{activeCombatant ? ` - Active: ${activeCombatant.name}` : ''}</p>
      <ButtonRow>
        <Button onClick={nextTurn}>Next Turn</Button>
        <Button onClick={rollAllInitiative}>Roll All Initiative</Button>
        <Button onClick={undoLastAction} disabled={history.length === 0}>Undo Last Action</Button>
      </ButtonRow>
      <ButtonRow>
        <Button onClick={exportCombatState}>Export JSON</Button>
        <Button onClick={resetCombat}>Reset Combat</Button>
      </ButtonRow>
      <ImportInput type="file" accept="application/json" onChange={importCombatState} />

      <h3 style={{ marginTop: '16px' }}>Add Enemy</h3>
      <Grid>
        <input value={enemyName} onChange={(event) => setEnemyName(event.target.value)} placeholder="Enemy name" />
        <input type="number" value={enemyHp} onChange={(event) => setEnemyHp(Number(event.target.value) || 1)} />
        <Button
          onClick={() => {
            if (!enemyName.trim()) return;
            pushHistory();
            setCombatants([
              ...combatants,
              {
                id: `${enemyName}-${Date.now()}`,
                name: enemyName,
                initiative: 0,
                hp: enemyHp,
                maxHp: enemyHp,
                isPlayer: false,
                conditionIds: [],
                concentrating: false
              }
            ]);
            appendEvent(`Added enemy ${enemyName.trim()} (${enemyHp} HP).`);
            setEnemyName('');
          }}
        >
          Add
        </Button>
      </Grid>

      <h3 style={{ marginTop: '20px' }}>Initiative Order</h3>
      {sortedCombatants.map((combatant) => (
        <Row key={combatant.id}>
          <strong>{combatant.name}</strong>
          <span>{combatant.isPlayer ? 'PC' : 'NPC'}</span>
          <input
            type="number"
            value={combatant.initiative}
            onChange={(event) => {
              const initiative = Number(event.target.value) || 0;
              pushHistory();
              setCombatants(updateCombatantInitiative(combatants, combatant.id, initiative));
              appendEvent(`Updated initiative for ${combatant.name} to ${initiative}.`);
            }}
          />
          <input
            type="number"
            value={combatant.hp}
            onChange={(event) => {
              const hp = Number(event.target.value) || 0;
              pushHistory();
              setCombatants(updateCombatantHp(combatants, combatant.id, hp));
              appendEvent(`Set ${combatant.name} HP to ${hp}.`);
            }}
          />
          <span>/ {combatant.maxHp}</span>
          <ShortcutRow>
            <ShortcutButton type="button" $variant="damage" onClick={() => applyHpShortcut(combatant, -1)}>-1 HP</ShortcutButton>
            <ShortcutButton type="button" $variant="damage" onClick={() => applyHpShortcut(combatant, -5)}>-5 HP</ShortcutButton>
            <ShortcutButton type="button" $variant="damage" onClick={() => applyHpShortcut(combatant, -10)}>-10 HP</ShortcutButton>
            <ShortcutButton type="button" $variant="heal" onClick={() => applyHpShortcut(combatant, 1)}>+1 HP</ShortcutButton>
            <ShortcutButton type="button" $variant="heal" onClick={() => applyHpShortcut(combatant, 5)}>+5 HP</ShortcutButton>
            <ShortcutButton type="button" $variant="heal" onClick={() => applyHpShortcut(combatant, 10)}>+10 HP</ShortcutButton>
          </ShortcutRow>
          <ShortcutRow>
            <input
              type="number"
              min={1}
              value={customHpAmounts[combatant.id] ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                setCustomHpAmounts((current) => ({ ...current, [combatant.id]: value }));
              }}
              placeholder="Custom HP"
              aria-label={`Custom HP amount for ${combatant.name}`}
            />
            <ShortcutButton type="button" $variant="damage" onClick={() => applyCustomHpAmount(combatant, 'damage')}>
              Apply Damage
            </ShortcutButton>
            <ShortcutButton type="button" $variant="heal" onClick={() => applyCustomHpAmount(combatant, 'heal')}>
              Apply Heal
            </ShortcutButton>
          </ShortcutRow>
          <span>{combatant.conditionIds.length > 0 ? `${combatant.conditionIds.length} active` : 'No conditions'}</span>
          <label>
            <input
              type="checkbox"
              checked={combatant.concentrating}
              onChange={(event) => {
                const concentrating = event.target.checked;
                pushHistory();
                setCombatants(updateCombatantConcentration(combatants, combatant.id, concentrating));
                appendEvent(`${combatant.name} ${concentrating ? 'started' : 'stopped'} concentrating.`);
              }}
            />{' '}
            Concentrating
          </label>
          <Button onClick={() => {
            pushHistory();
            setCombatants(removeCombatant(combatants, combatant.id));
            appendEvent(`Removed ${combatant.name} from combat.`);
          }}>Remove</Button>
          <ConditionShelf>
            {CONDITIONS.map((condition) => {
              const active = combatant.conditionIds.includes(condition.id);
              const reminder = concentrationReminderByCondition[condition.id];
              return (
                <ConditionChip
                  key={condition.id}
                  type="button"
                  $active={active}
                  aria-pressed={active}
                  title={`${condition.label}: ${condition.effect}${reminder ? ` ${reminder}` : ''}`}
                  onClick={() => toggleCondition(combatant.id, condition.id)}
                >
                  {condition.label}
                </ConditionChip>
              );
            })}
          </ConditionShelf>
        </Row>
      ))}
      <h3>Battle Log</h3>
      <LogFilterRow>
        {(['all', 'damage', 'heal', 'initiative', 'conditions', 'general'] as CombatEventType[]).map((type) => (
          <FilterButton
            key={type}
            type="button"
            $active={activeLogFilter === type}
            onClick={() => setActiveLogFilter(type)}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </FilterButton>
        ))}
      </LogFilterRow>
      <EventLog>
        {filteredEvents.length === 0 ? <li>No events for this filter.</li> : filteredEvents.slice(0, 12).map((event) => (
          <li key={event.id}>Round {event.round}: {event.message}</li>
        ))}
      </EventLog>
    </Container>
  );
};

export default CombatTracker;
