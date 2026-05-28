import React from 'react';
import styled from 'styled-components';
import { Character } from '../../models/character.model';
import CharacterStats from './CharacterStats';
import Inventory from './Inventory';
import Spells from './Spells';
import Progression from './Progression';
import { sampleCharacter } from './sample-character';
import FantasyPageBanner from '../FantasyPageBanner';
import dragonSigil from '../../assets/fantasy/dragon-sigil.svg';

const Container = styled.div`
  display: grid;
  gap: 1rem;
`;

const CharacterHeader = styled.h1`
  margin-bottom: 0;
`;

const CharacterComponent: React.FC<{ character?: Character }> = ({ character = sampleCharacter }) => {
  return (
    <Container>
      <FantasyPageBanner
        title="Character Codex"
        subtitle="Shape your hero's identity, stats, spells, and growth path."
        imageSrc={dragonSigil}
        imageAlt="Arcane dragon sigil artwork"
      />
      <CharacterHeader>{character.name}</CharacterHeader>
      <CharacterStats character={character} />
      <Inventory character={character} />
      <Spells character={character} />
      <Progression character={character} />
    </Container>
  );
};

export default CharacterComponent;
