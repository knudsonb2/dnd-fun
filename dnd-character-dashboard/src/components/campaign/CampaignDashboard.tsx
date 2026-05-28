import React, { useState } from 'react';
import styled from 'styled-components';
import { Campaign } from '../../models/campaign.model';
import { Session } from '../../models/session.model';
import { Character } from '../../models/character.model';
import SessionList from './SessionList';
import CampaignNotes from './CampaignNotes';
import Timeline from './Timeline';
import CampaignObjectives from './CampaignObjectives';
import SessionDetail from './SessionDetail';
import SessionForm from './SessionForm';
import CampaignHazards from './CampaignHazards';

const DashboardContainer = styled.div`
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.h1`
  color: var(--text-strong);
  margin-bottom: 30px;
  text-align: center;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  background: ${props => props.$active ? 'linear-gradient(135deg, var(--brand), var(--brand-2))' : 'var(--surface-muted)'};
  color: ${props => props.$active ? 'white' : 'var(--text-default)'};
  border: 1px solid ${props => props.$active ? 'transparent' : 'var(--border)'};
  border-radius: 10px;
  cursor: pointer;
  margin-right: 0;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, var(--accent), color-mix(in oklch, var(--accent), black 14%));
  color: white;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
`;

const CampaignDashboard: React.FC<{
  campaign: Campaign;
  characters: Character[];
  onCampaignChange: (campaign: Campaign) => void;
}> = ({ campaign, characters, onCampaignChange }) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'notes' | 'timeline' | 'objectives' | 'hazards'>('sessions');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const createEmptySession = (): Session => ({
    id: Date.now().toString(),
    date: new Date(),
    time: '',
    summary: '',
    outcomes: [],
    participants: []
  });

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    setIsEditing(false);
  };

  const handleSaveSession = (session: Session) => {
    const existingIndex = campaign.sessions.findIndex((currentSession) => currentSession.id === session.id);

    if (existingIndex >= 0) {
      const sessions = [...campaign.sessions];
      sessions[existingIndex] = session;
      onCampaignChange({ ...campaign, sessions });
    } else {
      onCampaignChange({ ...campaign, sessions: [session, ...campaign.sessions] });
    }

    setSelectedSession(session);
    setIsEditing(false);
  };

  const handleCreateSession = () => {
    setSelectedSession(createEmptySession());
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedSession(null);
  };

  const handleAddHazard = (hazard: Campaign['hazards'][number]) => {
    onCampaignChange({
      ...campaign,
      hazards: [hazard, ...campaign.hazards]
    });
  };

  const handleToggleHazardActive = (hazardId: string) => {
    const hazards = campaign.hazards.map((hazard) =>
      hazard.id === hazardId ? { ...hazard, active: !hazard.active } : hazard
    );

    onCampaignChange({ ...campaign, hazards });
  };

  const handleUpdateHazard = (updatedHazard: Campaign['hazards'][number]) => {
    const hazards = campaign.hazards.map((hazard) =>
      hazard.id === updatedHazard.id ? updatedHazard : hazard
    );

    onCampaignChange({ ...campaign, hazards });
  };

  const handleDeleteHazard = (hazardId: string) => {
    const hazards = campaign.hazards.filter((hazard) => hazard.id !== hazardId);
    onCampaignChange({ ...campaign, hazards });
  };

  return (
    <DashboardContainer>
      <DashboardHeader>Campaign Dashboard</DashboardHeader>
      <HeaderActions>
        <ActionButton onClick={handleCreateSession}>New Session</ActionButton>
      </HeaderActions>
      
      <TabContainer>
        <TabButton 
          $active={activeTab === 'sessions'} 
          onClick={() => setActiveTab('sessions')}
        >
          Sessions
        </TabButton>
        <TabButton 
          $active={activeTab === 'notes'} 
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </TabButton>
        <TabButton 
          $active={activeTab === 'timeline'} 
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </TabButton>
        <TabButton 
          $active={activeTab === 'objectives'} 
          onClick={() => setActiveTab('objectives')}
        >
          Objectives
        </TabButton>
        <TabButton
          $active={activeTab === 'hazards'}
          onClick={() => setActiveTab('hazards')}
        >
          Hazards
        </TabButton>
      </TabContainer>
      
      {activeTab === 'sessions' && (
        <DashboardGrid>
          <SessionList 
            sessions={campaign.sessions} 
            characters={characters} 
            onSelect={handleSessionSelect}
          />
          <CampaignNotes campaign={campaign} onCampaignChange={onCampaignChange} />
        </DashboardGrid>
      )}
      
      {activeTab === 'notes' && <CampaignNotes campaign={campaign} onCampaignChange={onCampaignChange} />}
      
      {activeTab === 'timeline' && <Timeline sessions={campaign.sessions} />}
      
      {activeTab === 'objectives' && <CampaignObjectives objectives={campaign.objectives} />}

      {activeTab === 'hazards' && (
        <CampaignHazards
          hazards={campaign.hazards}
          onAddHazard={handleAddHazard}
          onToggleHazardActive={handleToggleHazardActive}
          onUpdateHazard={handleUpdateHazard}
          onDeleteHazard={handleDeleteHazard}
        />
      )}
      
      {selectedSession && (
        <>
          {isEditing ? (
            <SessionForm 
              session={selectedSession} 
              characters={characters} 
              onSave={handleSaveSession} 
              onCancel={handleCancelEdit}
            />
          ) : (
            <SessionDetail session={selectedSession} characters={characters} />
          )}
        </>
      )}
    </DashboardContainer>
  );
};

export default CampaignDashboard;
