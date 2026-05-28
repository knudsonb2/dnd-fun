import React from 'react';
import styled from 'styled-components';
import { Session } from '../../models/session.model';
import { Character } from '../../models/character.model';

const SessionListContainer = styled.div`
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
`;

const SessionListHeader = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
`;

const SessionItem = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
  }
`;

const SessionDate = styled.h3`
  margin: 0 0 10px 0;
  color: var(--brand-2);
`;

const SessionSummary = styled.p`
  margin: 0;
  color: var(--text-muted);
`;

const SessionParticipants = styled.div`
  margin-top: 10px;
  font-size: 0.9em;
`;

const ParticipantBadge = styled.span`
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  margin-right: 5px;
  font-size: 0.8em;
`;

const SessionList: React.FC<{ 
  sessions: Session[]; 
  characters: Character[]; 
  onSelect?: (session: Session) => void;
}> = ({ sessions, characters, onSelect }) => {

  const getCharacterName = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    return character ? character.name : 'Unknown Character';
  };

  const handleItemClick = (session: Session) => {
    if (onSelect) onSelect(session);
  };

  return (
    <SessionListContainer>
      <SessionListHeader>Session List</SessionListHeader>
      {sessions.map(session => (
        <SessionItem key={session.id} onClick={() => handleItemClick(session)}>
          <SessionDate>{new Date(session.date).toLocaleDateString()}</SessionDate>
          <SessionSummary>{session.summary}</SessionSummary>
          <SessionParticipants>
            <strong>Participants:</strong>{' '}
            {session.participants.map(participantId => (
              <ParticipantBadge key={participantId}>
                {getCharacterName(participantId)}
              </ParticipantBadge>
            ))}
          </SessionParticipants>
        </SessionItem>
      ))}
    </SessionListContainer>
  );
};

export default SessionList;
