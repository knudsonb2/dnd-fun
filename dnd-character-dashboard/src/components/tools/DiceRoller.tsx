import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  loadDiceHistory,
  loadDiceSoundEnabled,
  saveDiceHistory,
  saveDiceSoundEnabled,
  DiceHistoryEntry
} from '../../utils/storage';
import FantasyPageBanner from '../FantasyPageBanner';
import dragonSigil from '../../assets/fantasy/dragon-sigil.svg';

const DICE_OPTIONS = [4, 6, 8, 10, 12, 20, 100] as const;
const ROLL_MODES = ['normal', 'advantage', 'disadvantage'] as const;

type RollMode = typeof ROLL_MODES[number];

type RollResult = {
  rolls: number[];
  selectedRoll: number;
  total: number;
  isNat20Crit: boolean;
  isNat1Crit: boolean;
};

type RollRecord = {
  id: number;
  count: number;
  sides: number;
  modifier: number;
  mode: RollMode;
  rolls: number[];
  selectedRoll: number;
  total: number;
  isNat20Crit: boolean;
  isNat1Crit: boolean;
};

type RollPreset = {
  id: string;
  name: string;
  count: number;
  sides: number;
  modifier: number;
  mode: RollMode;
};

const ROLL_PRESETS: RollPreset[] = [
  { id: 'd20-check', name: 'Ability Check (1d20)', count: 1, sides: 20, modifier: 0, mode: 'normal' },
  { id: 'greatsword', name: 'Greatsword (2d6+3)', count: 2, sides: 6, modifier: 3, mode: 'normal' },
  { id: 'fireball', name: 'Fireball (8d6)', count: 8, sides: 6, modifier: 0, mode: 'normal' },
  { id: 'adv-check', name: 'Advantage Check (1d20)', count: 1, sides: 20, modifier: 0, mode: 'advantage' }
];

const spin = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  30% { transform: rotate(90deg) scale(1.05); }
  70% { transform: rotate(210deg) scale(0.97); }
  100% { transform: rotate(360deg) scale(1); }
`;

const Container = styled.div`
  display: grid;
  gap: 0.8rem;
`;

const Card = styled.div`
  background: var(--surface-muted);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 16px;
  max-width: 460px;
  box-shadow: var(--shadow-sm);
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
`;

const RollButton = styled.button`
  border: none;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: white;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const ResultDie = styled.div<{ $rolling: boolean }>`
  width: 84px;
  height: 84px;
  border-radius: 10px;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  background: white;
  animation: ${({ $rolling }) => ($rolling ? spin : 'none')} 350ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const HistoryList = styled.ul`
  margin: 8px 0 0;
  padding-left: 18px;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CritTag = styled.span<{ $critType: 'success' | 'fail' }>`
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $critType }) => ($critType === 'success' ? '#0f5132' : '#842029')};
  background: ${({ $critType }) => ($critType === 'success' ? '#d1e7dd' : '#f8d7da')};
`;

const clampPositiveInt = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
};

const getSingleRoll = (sides: number): number => Math.floor(Math.random() * sides) + 1;

const buildRoll = (sides: number, count: number, modifier: number, mode: RollMode): RollResult => {
  const normalizedCount = clampPositiveInt(count);
  const normalizedSides = clampPositiveInt(sides);

  if (mode !== 'normal' && normalizedSides === 20 && normalizedCount === 1) {
    const first = getSingleRoll(normalizedSides);
    const second = getSingleRoll(normalizedSides);
    const selectedRoll = mode === 'advantage' ? Math.max(first, second) : Math.min(first, second);
    const total = selectedRoll + modifier;

    return {
      rolls: [first, second],
      selectedRoll,
      total,
      isNat20Crit: selectedRoll === 20,
      isNat1Crit: selectedRoll === 1
    };
  }

  const rolls = Array.from({ length: normalizedCount }, () => getSingleRoll(normalizedSides));
  const selectedRoll = rolls[0];
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
  const isSingleD20 = normalizedSides === 20 && normalizedCount === 1;

  return {
    rolls,
    selectedRoll,
    total,
    isNat20Crit: isSingleD20 && selectedRoll === 20,
    isNat1Crit: isSingleD20 && selectedRoll === 1
  };
};

const formatModifier = (modifier: number): string => (modifier >= 0 ? `+${modifier}` : `${modifier}`);

const DiceRoller: React.FC = () => {
  const [sides, setSides] = useState<number>(20);
  const [count, setCount] = useState<number>(1);
  const [modifier, setModifier] = useState<number>(0);
  const [mode, setMode] = useState<RollMode>('normal');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<RollRecord[]>(() => loadDiceHistory() as RollRecord[]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadDiceSoundEnabled());

  const formulaLabel = useMemo(() => `${count}d${sides}${modifier === 0 ? '' : formatModifier(modifier)}`, [count, sides, modifier]);

  useEffect(() => {
    saveDiceHistory(history as DiceHistoryEntry[]);
  }, [history]);

  useEffect(() => {
    saveDiceSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const playRollSound = () => {
    if (!soundEnabled) {
      return;
    }

    const audio = new Audio(
      'data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTAAAAAAAP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/'
    );
    const playback = audio.play();
    if (playback && typeof playback.catch === 'function') {
      void playback.catch(() => undefined);
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = ROLL_PRESETS.find((entry) => entry.id === presetId);
    if (!preset) {
      return;
    }

    setSelectedPreset(preset.id);
    setCount(preset.count);
    setSides(preset.sides);
    setModifier(preset.modifier);
    setMode(preset.mode);
  };

  const rollDie = () => {
    setRolling(true);
    window.setTimeout(() => {
      const result = buildRoll(sides, count, modifier, mode);
      const record: RollRecord = {
        id: Date.now(),
        count,
        sides,
        modifier,
        mode,
        rolls: result.rolls,
        selectedRoll: result.selectedRoll,
        total: result.total,
        isNat20Crit: result.isNat20Crit,
        isNat1Crit: result.isNat1Crit
      };
      setLastRoll(result);
      setHistory((prev) => [record, ...prev].slice(0, 8));
      playRollSound();
      setRolling(false);
    }, 320);
  };

  return (
    <Container>
      <FantasyPageBanner
        title="Arcane Dice Chamber"
        subtitle="Roll with style, advantage modes, and an immersive magical interface."
        imageSrc={dragonSigil}
        imageAlt="Mystic arcane symbol"
      />
      <h1>Dice Roller</h1>
      <Card>
        <Row>
          <label htmlFor="roll-preset">Preset</label>
          <select id="roll-preset" value={selectedPreset} onChange={(event) => applyPreset(event.target.value)}>
            <option value="">Custom</option>
            {ROLL_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </Row>

        <Row>
          <label htmlFor="dice-count">Count</label>
          <input
            id="dice-count"
            type="number"
            min={1}
            value={count}
            onChange={(event) => {
              setSelectedPreset('');
              setCount(clampPositiveInt(Number(event.target.value)));
            }}
          />
          <label htmlFor="dice-select">Die</label>
          <select
            id="dice-select"
            value={sides}
            onChange={(event) => {
              setSelectedPreset('');
              setSides(Number(event.target.value));
            }}
          >
            {DICE_OPTIONS.map((dieSides) => (
              <option key={dieSides} value={dieSides}>
                d{dieSides}
              </option>
            ))}
          </select>
          <label htmlFor="dice-modifier">Modifier</label>
          <input
            id="dice-modifier"
            type="number"
            value={modifier}
            onChange={(event) => {
              setSelectedPreset('');
              setModifier(Number(event.target.value) || 0);
            }}
          />
        </Row>

        <Row>
          <label htmlFor="roll-mode">Mode</label>
          <select
            id="roll-mode"
            value={mode}
            onChange={(event) => {
              setSelectedPreset('');
              setMode(event.target.value as RollMode);
            }}
          >
            {ROLL_MODES.map((rollMode) => (
              <option key={rollMode} value={rollMode}>
                {rollMode}
              </option>
            ))}
          </select>
          <ToggleLabel htmlFor="sound-toggle">
            <input
              id="sound-toggle"
              type="checkbox"
              checked={soundEnabled}
              onChange={(event) => setSoundEnabled(event.target.checked)}
            />
            Roll sound
          </ToggleLabel>
          <RollButton onClick={rollDie}>Roll {formulaLabel}</RollButton>
        </Row>

        <Row>
          <ResultDie $rolling={rolling} aria-live="polite">
            {lastRoll?.total ?? '-'}
          </ResultDie>
          <div>
            <strong>Result:</strong> {lastRoll?.total ?? 'No roll yet'}
            {lastRoll?.isNat20Crit && <CritTag $critType="success">Critical Success</CritTag>}
            {lastRoll?.isNat1Crit && <CritTag $critType="fail">Critical Fail</CritTag>}
            {lastRoll && (
              <div>
                Rolls: [{lastRoll.rolls.join(', ')}]{' '}
                {mode !== 'normal' && count === 1 && sides === 20 && `(selected ${lastRoll.selectedRoll})`}
              </div>
            )}
          </div>
        </Row>

        <h3>Recent Rolls</h3>
        <HistoryList>
          {history.map((entry) => (
            <li key={entry.id}>
              {entry.count}d{entry.sides}{entry.modifier === 0 ? '' : formatModifier(entry.modifier)} ({entry.mode}): [{entry.rolls.join(', ')}] =&gt;{' '}
              {entry.total}
              {entry.isNat20Crit && ' (Crit Success)'}
              {entry.isNat1Crit && ' (Crit Fail)'}
            </li>
          ))}
          {history.length === 0 && <li>No rolls recorded yet.</li>}
        </HistoryList>
      </Card>
    </Container>
  );
};

export default DiceRoller;
