import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { sampleCharacter } from '../character/sample-character';
import Character from '../character/Character';
import fantasyMap from '../../assets/fantasy/fantasy-map.svg';
import arcaneOrb from '../../assets/fantasy/arcane-orb.svg';
import FantasyInspirationHub from './FantasyInspirationHub';

const Container = styled.div`
  display: grid;
  gap: 1.25rem;
`;

const ShowcaseGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0.85rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ShowcaseCard = styled.article<{ $span?: number }>`
  grid-column: span ${({ $span = 4 }) => $span};
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: color-mix(in oklch, var(--surface), black 4%);
  box-shadow: var(--shadow-sm);
  position: relative;
  min-height: 180px;

  @media (max-width: 900px) {
    grid-column: auto;
  }
`;

const CardMedia = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.72;
  transform: scale(1.01);
  transition: transform 220ms ease, opacity 220ms ease;

  ${ShowcaseCard}:hover & {
    transform: scale(1.05);
    opacity: 0.88;
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 35%, color-mix(in oklch, var(--surface), black 18%) 100%);
`;

const CardBody = styled.div`
  position: absolute;
  left: 0.8rem;
  right: 0.8rem;
  bottom: 0.65rem;
  display: grid;
  gap: 0.2rem;
`;

const CardTag = styled.span`
  display: inline-flex;
  width: fit-content;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
`;

const CardTitle = styled.h3`
  margin: 0;
  color: var(--text-strong);
`;

const CardText = styled.p`
  margin: 0;
  color: var(--text-default);
`;

const MiniActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const ActionPill = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  text-decoration: none;
  color: var(--text-default);
  background: color-mix(in oklch, var(--surface-muted), black 10%);

  &:hover {
    border-color: var(--border-strong);
    color: var(--text-strong);
  }
`;

const DashboardHeader = styled.h1`
  margin-bottom: 0.3rem;
`;

const Hero = styled.section`
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: linear-gradient(145deg, color-mix(in oklch, var(--brand), black 72%), color-mix(in oklch, var(--brand-2), black 72%));
`;

const HeroMedia = styled.div`
  margin-top: 0.8rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.8rem;

  img {
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--border);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0;
  color: var(--text-default);
`;

const CharacterLink = styled(Link)`
  display: block;
  margin: 0;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-strong);
  box-shadow: var(--shadow-sm);
  transition: transform 180ms ease, border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--border-strong);
  }
`;

const Dashboard = () => {
  return (
    <Container>
      <Hero>
        <DashboardHeader>D&D Character Dashboard</DashboardHeader>
        <HeroSubtitle>
          Plan encounters, track campaigns, and explore your character sheet with a cleaner, faster command center.
        </HeroSubtitle>
        <HeroMedia>
          <img src={fantasyMap} alt="Hand-drawn fantasy map illustration" loading="lazy" />
          <img src={arcaneOrb} alt="Arcane orb sigil" loading="lazy" />
        </HeroMedia>
      </Hero>
      
      <CharacterLink to="/character">
        ✨ Explore Sample Character: {sampleCharacter.name}
      </CharacterLink>

      <MiniActions>
        <ActionPill to="/campaign">Campaign Feed</ActionPill>
        <ActionPill to="/encounters">Encounter Forge</ActionPill>
        <ActionPill to="/combat">Battle Command</ActionPill>
        <ActionPill to="/dice">Arcane Dice</ActionPill>
      </MiniActions>

      <ShowcaseGrid>
        <ShowcaseCard $span={6}>
          <CardMedia src={fantasyMap} alt="World map spotlight" loading="lazy" />
          <CardOverlay />
          <CardBody>
            <CardTag>Featured Realm</CardTag>
            <CardTitle>Discover the Shattered Coast</CardTitle>
            <CardText>Track timelines, quests, and party progress through a living campaign chronicle.</CardText>
          </CardBody>
        </ShowcaseCard>

        <ShowcaseCard $span={3}>
          <CardMedia src={arcaneOrb} alt="Arcane orb" loading="lazy" />
          <CardOverlay />
          <CardBody>
            <CardTag>Utility</CardTag>
            <CardTitle>Roll Arcana</CardTitle>
          </CardBody>
        </ShowcaseCard>

        <ShowcaseCard $span={3}>
          <CardMedia src={arcaneOrb} alt="Combat sigil" loading="lazy" />
          <CardOverlay />
          <CardBody>
            <CardTag>Live Play</CardTag>
            <CardTitle>Run Initiative</CardTitle>
          </CardBody>
        </ShowcaseCard>
      </ShowcaseGrid>

      <FantasyInspirationHub />
      
      <Character character={sampleCharacter} />
    </Container>
  );
};

export default Dashboard;
