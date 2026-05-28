import React from 'react';
import styled from 'styled-components';
import { Campaign } from '../../models/campaign.model';

const ObjectivesContainer = styled.div`
  background: var(--surface-muted);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 20px;
  box-shadow: var(--shadow-sm);
`;

const ObjectivesHeader = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
`;

const ObjectivesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ObjectiveCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ObjectiveTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--brand-2);
`;

const ObjectiveDescription = styled.p`
  margin: 0 0 15px 0;
  color: var(--text-muted);
`;

const ProgressContainer = styled.div`
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  height: 10px;
  background: color-mix(in oklch, var(--text-muted), white 82%);
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: ${props => props.progress >= 100 ? 'var(--accent)' : 'var(--brand-2)'};
  width: ${props => props.progress}%;
  transition: width 0.3s;
`;

const ProgressText = styled.span`
  font-size: 0.9em;
  color: var(--text-muted);
`;

const StatusIndicator = styled.span<{ completed: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
  color: white;
  background: ${props => props.completed ? 'var(--accent)' : 'color-mix(in oklch, var(--brand), black 10%)'};
`;

const CampaignObjectives: React.FC<{ objectives: Campaign['objectives'] }> = ({ objectives }) => {
  return (
    <ObjectivesContainer>
      <ObjectivesHeader>Campaign Objectives</ObjectivesHeader>
      <ObjectivesList>
        {objectives.length > 0 ? (
          objectives.map((objective, index) => (
            <ObjectiveCard key={index}>
              <ObjectiveTitle>{objective.title}</ObjectiveTitle>
              <ObjectiveDescription>{objective.description}</ObjectiveDescription>
              <ProgressContainer>
                <ProgressBar>
                  <ProgressFill progress={objective.progress} />
                </ProgressBar>
                <ProgressText>{objective.progress}% complete</ProgressText>
              </ProgressContainer>
              <StatusIndicator completed={objective.completed}>
                {objective.completed ? 'Completed' : 'In Progress'}
              </StatusIndicator>
            </ObjectiveCard>
          ))
        ) : (
          <p>No objectives set yet</p>
        )}
      </ObjectivesList>
    </ObjectivesContainer>
  );
};

export default CampaignObjectives;
