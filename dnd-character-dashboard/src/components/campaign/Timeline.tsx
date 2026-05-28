import React from 'react';
import styled from 'styled-components';
import { Session } from '../../models/session.model';

const TimelineContainer = styled.div`
  background: var(--surface-muted);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 30px;
`;

const TimelineHeader = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
`;

const TimelineList = styled.div`
  position: relative;
  padding-left: 30px;
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 30px;
  padding-left: 20px;
`;

const TimelineDot = styled.div`
  position: absolute;
  left: -30px;
  top: 0;
  width: 12px;
  height: 12px;
  background: var(--brand-2);
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const TimelineDate = styled.h3`
  margin: 0 0 5px 0;
  color: var(--brand-2);
`;

const TimelineSummary = styled.p`
  margin: 0;
  color: var(--text-muted);
`;

const Timeline: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <TimelineContainer>
      <TimelineHeader>Campaign Timeline</TimelineHeader>
      <TimelineList>
        {sortedSessions.map(session => (
          <TimelineItem key={session.id}>
            <TimelineDot />
            <TimelineDate>{new Date(session.date).toLocaleDateString()}</TimelineDate>
            <TimelineSummary>{session.summary}</TimelineSummary>
          </TimelineItem>
        ))}
      </TimelineList>
    </TimelineContainer>
  );
};

export default Timeline;
