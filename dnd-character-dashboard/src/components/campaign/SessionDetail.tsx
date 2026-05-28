import React from 'react';
import styled from 'styled-components';
import { Session } from '../../models/session.model';
import { Character } from '../../models/character.model';

const DetailContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const DetailHeader = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailRow = styled.div`
  margin-bottom: 15px;
`;

const DetailLabel = styled.span`
  font-weight: bold;
  color: #007bff;
  margin-right: 10px;
`;

const DetailValue = styled.span`
  color: #666;
`;

const OutcomesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const OutcomeItem = styled.li`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 5px;
`;

const EditButton = styled.button`
  background: #28a745;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #218838;
  }
`;

const SessionDetail: React.FC<{ 
  session: Session; 
  characters: Character[]; 
  onEdit?: (session: Session) => void;
}> = ({ session, characters, onEdit }) => {
  const getCharacterName = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    return character ? character.name : 'Unknown Character';
  };

  return (
    <DetailContainer>
      <DetailHeader>
        Session Details
        {onEdit && (
          <EditButton onClick={() => onEdit(session)}>Edit Session</EditButton>
        )}
      </DetailHeader>
      
      <DetailRow>
        <DetailLabel>Date:</DetailLabel>
        <DetailValue>{new Date(session.date).toLocaleDateString()}</DetailValue>
      </DetailRow>
      
      <DetailRow>
        <DetailLabel>Time:</DetailLabel>
        <DetailValue>{session.time}</DetailValue>
      </DetailRow>
      
      <DetailRow>
        <DetailLabel>Summary:</DetailLabel>
        <DetailValue>{session.summary}</DetailValue>
      </DetailRow>
      
      <DetailRow>
        <DetailLabel>Participants:</DetailLabel>
        <DetailValue>
          {session.participants.map(participantId => (
            <span key={participantId}>{getCharacterName(participantId)} </span>
          ))}
        </DetailValue>
      </DetailRow>
      
      <DetailRow>
        <DetailLabel>Outcomes:</DetailLabel>
        <OutcomesList>
          {session.outcomes.map((outcome, index) => (
            <OutcomeItem key={index}>{outcome}</OutcomeItem>
          ))}
        </OutcomesList>
      </DetailRow>
    </DetailContainer>
  );
};

export default SessionDetail;