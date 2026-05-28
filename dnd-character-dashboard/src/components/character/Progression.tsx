import React from 'react';
import styled from 'styled-components';
import { Character } from '../../models/character.model';

const ProgressionContainer = styled.div`
  margin-bottom: 2rem;
`;

const ProgressionHeader = styled.h2`
  color: var(--text-strong);
  border-bottom: 2px solid color-mix(in oklch, var(--brand), white 64%);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const XPContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 8px;
`;

const XPItem = styled.div`
  text-align: center;
`;

const XPName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: var(--brand-2);
`;

const XPValue = styled.div`
  font-size: 1.2rem;
  margin-top: 0.25rem;
`;

const ProficiencyBonus = styled.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--brand-2);
  margin-top: 0.5rem;
`;

const ClassFeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FeatureCard = styled.div`
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
`;

const FeatureName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: var(--text-strong);
`;

const FeatureDescription = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
`;

interface ProgressionProps {
  character: Character;
}

const Progression: React.FC<ProgressionProps> = ({ character }) => {
  const calculateLevel = (xp: number) => {
    // Simplified level calculation - in a real implementation this would be more complex
    if (xp < 300) return 1;
    if (xp < 900) return 2;
    if (xp < 2700) return 3;
    if (xp < 6500) return 4;
    if (xp < 14000) return 5;
    if (xp < 23000) return 6;
    if (xp < 34000) return 7;
    if (xp < 48000) return 8;
    if (xp < 64000) return 9;
    if (xp < 85000) return 10;
    return 11;
  };

  const currentLevel = calculateLevel(character.experience.totalXp);

  return (
    <ProgressionContainer>
      <ProgressionHeader>Character Progression</ProgressionHeader>
      
      <XPContainer>
        <XPItem>
          <XPName>Current XP</XPName>
          <XPValue>{character.experience.currentXp}</XPValue>
        </XPItem>
        <XPItem>
          <XPName>Next Level XP</XPName>
          <XPValue>{character.experience.nextLevelXp}</XPValue>
        </XPItem>
        <XPItem>
          <XPName>Total XP</XPName>
          <XPValue>{character.experience.totalXp}</XPValue>
        </XPItem>
        <XPItem>
          <XPName>Current Level</XPName>
          <XPValue>{currentLevel}</XPValue>
        </XPItem>
      </XPContainer>
      
      <ProficiencyBonus>
        Proficiency Bonus: {character.derivedStats.proficiencyBonus >= 0 ? '+' : ''}{character.derivedStats.proficiencyBonus}
      </ProficiencyBonus>
      
      <ClassFeaturesContainer>
        <FeatureCard>
          <FeatureName>Class Features</FeatureName>
          <FeatureDescription>
            {character.class} class features and abilities
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureName>Feats</FeatureName>
          <FeatureDescription>
            {character.level > 1 ? 'Feat available' : 'No feats yet'}
          </FeatureDescription>
        </FeatureCard>
      </ClassFeaturesContainer>
    </ProgressionContainer>
  );
};

export default Progression;
