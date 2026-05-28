import React from 'react';
import styled from 'styled-components';
import { Character } from '../../models/character.model';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
`;

const StatTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: var(--text-strong);
  font-size: 1rem;
`;

const AbilityScores = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AbilityScore = styled.div`
  text-align: center;
`;

const AbilityName = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const AbilityScoreValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const DerivedStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const DerivedStat = styled.div`
  text-align: center;
`;

const DerivedStatName = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const DerivedStatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const SavingThrowsContainer = styled.div`
  margin-top: 1rem;
`;

const SavingThrow = styled.div`
  display: inline-block;
  margin: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.9rem;
`;

const SkillsContainer = styled.div`
  margin-top: 1rem;
`;

const Skill = styled.div`
  display: inline-block;
  margin: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.9rem;
`;

interface CharacterStatsProps {
  character: Character;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ character }) => {
  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const getAbilityModifier = (ability: keyof Character['abilityScores']) => {
    return calculateModifier(character.abilityScores[ability]);
  };

  return (
    <StatsContainer>
      <StatCard>
        <StatTitle>Ability Scores</StatTitle>
        <AbilityScores>
          {Object.entries(character.abilityScores).map(([ability, score]) => (
            <AbilityScore key={ability}>
              <AbilityName>{ability.charAt(0).toUpperCase() + ability.slice(1)}</AbilityName>
              <AbilityScoreValue>{score} ({getAbilityModifier(ability as keyof Character['abilityScores']) >= 0 ? '+' : ''}{getAbilityModifier(ability as keyof Character['abilityScores'])})</AbilityScoreValue>
            </AbilityScore>
          ))}
        </AbilityScores>
      </StatCard>
      
      <StatCard>
        <StatTitle>Derived Stats</StatTitle>
        <DerivedStats>
          <DerivedStat>
            <DerivedStatName>Armor Class</DerivedStatName>
            <DerivedStatValue>{character.derivedStats.armorClass}</DerivedStatValue>
          </DerivedStat>
          <DerivedStat>
            <DerivedStatName>Hit Points</DerivedStatName>
            <DerivedStatValue>{character.derivedStats.hitPoints}</DerivedStatValue>
          </DerivedStat>
          <DerivedStat>
            <DerivedStatName>Speed</DerivedStatName>
            <DerivedStatValue>{character.derivedStats.speed} ft</DerivedStatValue>
          </DerivedStat>
          <DerivedStat>
            <DerivedStatName>Proficiency Bonus</DerivedStatName>
            <DerivedStatValue>{character.derivedStats.proficiencyBonus >= 0 ? '+' : ''}{character.derivedStats.proficiencyBonus}</DerivedStatValue>
          </DerivedStat>
        </DerivedStats>
      </StatCard>
      
      <StatCard>
        <StatTitle>Saving Throws</StatTitle>
        <SavingThrowsContainer>
          {Object.entries(character.savingThrows).map(([throwType, proficient]) => (
            <SavingThrow key={throwType}>
              {throwType.charAt(0).toUpperCase() + throwType.slice(1)} {proficient ? '(Proficient)' : ''}
            </SavingThrow>
          ))}
        </SavingThrowsContainer>
      </StatCard>
      
      <StatCard>
        <StatTitle>Skills</StatTitle>
        <SkillsContainer>
          {Object.entries(character.skills).map(([skill, trained]) => (
            <Skill key={skill}>
              {skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {trained ? '(Trained)' : ''}
            </Skill>
          ))}
        </SkillsContainer>
      </StatCard>
    </StatsContainer>
  );
};

export default CharacterStats;
