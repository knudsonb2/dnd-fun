import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Campaign as CampaignModel } from '../../models/campaign.model';
import { Character } from '../../models/character.model';
import CampaignDashboard from './CampaignDashboard';
import { loadCampaign, loadCharacters, saveCampaign } from '../../utils/storage';
import FantasyPageBanner from '../FantasyPageBanner';
import nightCitadel from '../../assets/fantasy/night-citadel.svg';

const Container = styled.div`
  display: grid;
`;

const Campaign = () => {
  const [campaign, setCampaign] = useState<CampaignModel>(loadCampaign);
  const [characters] = useState<Character[]>(loadCharacters);

  useEffect(() => {
    saveCampaign(campaign);
  }, [campaign]);

  return (
    <Container>
      <FantasyPageBanner
        title="Campaign Chronicle"
        subtitle="Track sessions, story beats, objectives, and world state like a living journal."
        imageSrc={nightCitadel}
        imageAlt="Fantasy citadel at night"
      />
      <CampaignDashboard
        campaign={campaign}
        characters={characters}
        onCampaignChange={setCampaign}
      />
    </Container>
  );
};

export default Campaign;
