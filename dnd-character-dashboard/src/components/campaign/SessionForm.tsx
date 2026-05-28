import React, { useState } from 'react';
import styled from 'styled-components';
import { Session } from '../../models/session.model';
import { Character } from '../../models/character.model';

const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const FormHeader = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #007bff;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  box-sizing: border-box;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
  min-height: 100px;
`;

const FormButton = styled.button`
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background: #0056b3;
  }
`;

const CancelButton = styled(FormButton)`
  background: #6c757d;
  
  &:hover {
    background: #545b62;
  }
`;

const ParticipantCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ParticipantCheckboxInput = styled.input`
  margin-right: 8px;
`;

const SessionForm: React.FC<{ 
  session?: Session; 
  characters: Character[]; 
  onSave: (session: Session) => void; 
  onCancel: () => void;
}> = ({ session, characters, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Session>({
    id: session?.id || '',
    date: session?.date || new Date(),
    time: session?.time || '',
    summary: session?.summary || '',
    outcomes: session?.outcomes || [],
    participants: session?.participants || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (characterId: string) => {
    setFormData(prev => {
      const participants = [...prev.participants];
      const index = participants.indexOf(characterId);
      if (index > -1) {
        participants.splice(index, 1);
      } else {
        participants.push(characterId);
      }
      return { ...prev, participants };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <FormContainer>
      <FormHeader>{session ? 'Edit Session' : 'Create New Session'}</FormHeader>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Date:</FormLabel>
          <FormInput
            type="date"
            name="date"
            value={new Date(formData.date).toISOString().split('T')[0]}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Time:</FormLabel>
          <FormInput
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="e.g., 7:00 PM"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Summary:</FormLabel>
          <FormTextarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Brief summary of the session"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Participants:</FormLabel>
          {characters.map(character => (
            <ParticipantCheckbox key={character.id}>
              <ParticipantCheckboxInput
                type="checkbox"
                checked={formData.participants.includes(character.id)}
                onChange={() => handleParticipantChange(character.id)}
              />
              <span>{character.name}</span>
            </ParticipantCheckbox>
          ))}
        </FormGroup>
        
        <FormGroup>
          <FormButton type="submit">Save Session</FormButton>
          <CancelButton type="button" onClick={onCancel}>Cancel</CancelButton>
        </FormGroup>
      </form>
    </FormContainer>
  );
};

export default SessionForm;
