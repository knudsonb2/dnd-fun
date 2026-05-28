import React from 'react';
import styled from 'styled-components';
import { Character } from '../../models/character.model';

const SpellsContainer = styled.div`
  margin-bottom: 2rem;
`;

const SpellsHeader = styled.h2`
  color: var(--text-strong);
  border-bottom: 2px solid color-mix(in oklch, var(--brand), white 64%);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const SpellSlotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 8px;
`;

const SpellSlot = styled.div`
  text-align: center;
`;

const SpellSlotLevel = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: var(--brand-2);
`;

const SpellSlotCount = styled.div`
  font-size: 1.2rem;
  margin-top: 0.25rem;
`;

const SpellsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SpellCard = styled.div`
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
`;

const SpellName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: var(--text-strong);
`;

const SpellLevel = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
`;

interface SpellsProps {
  character: Character;
}

const Spells: React.FC<SpellsProps> = ({ character }) => {
  return (
    <SpellsContainer>
      <SpellsHeader>Spells</SpellsHeader>
      
      <SpellSlotsContainer>
        {character.spells.spellSlots.map((slot) => (
          <SpellSlot key={slot.level}>
            <SpellSlotLevel>Level {slot.level}</SpellSlotLevel>
            <SpellSlotCount>{slot.slots} slots</SpellSlotCount>
          </SpellSlot>
        ))}
      </SpellSlotsContainer>
      
      <SpellsList>
        {character.spells.knownSpells.map((spell, index) => (
          <SpellCard key={index}>
            <SpellName>{spell}</SpellName>
            <SpellLevel>Spell</SpellLevel>
          </SpellCard>
        ))}
      </SpellsList>
    </SpellsContainer>
  );
};

export default Spells;
