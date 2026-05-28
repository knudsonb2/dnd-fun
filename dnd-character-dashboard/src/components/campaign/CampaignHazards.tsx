import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { CampaignHazard, HazardSeverity, HazardType } from '../../models/campaign.model';

const HazardsContainer = styled.div`
  background: var(--surface-muted);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: grid;
  gap: 1rem;
`;

const HazardsHeader = styled.h2`
  color: var(--text-strong);
  margin: 0;
`;

const Form = styled.form`
  display: grid;
  gap: 0.65rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const Label = styled.label`
  display: grid;
  gap: 0.35rem;
  font-weight: 600;
  color: var(--text-default);
`;

const Input = styled.input`
  min-height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-strong);
  padding: 0.45rem 0.65rem;
`;

const Select = styled.select`
  min-height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-strong);
  padding: 0.45rem 0.65rem;
`;

const TextArea = styled.textarea`
  min-height: 80px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-strong);
  padding: 0.55rem 0.65rem;
  resize: vertical;
`;

const SubmitButton = styled.button`
  min-height: 40px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: 0.55rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  display: grid;
  gap: 0.15rem;
`;

const SummaryLabel = styled.span`
  font-size: 0.82rem;
  color: var(--text-muted);
`;

const SummaryValue = styled.strong`
  font-size: 1.12rem;
  color: var(--text-strong);
`;

const FilterGrid = styled.div`
  display: grid;
  gap: 0.65rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const HazardList = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const HazardCard = styled.article`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.8rem;
  display: grid;
  gap: 0.45rem;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  border-radius: 999px;
  border: 1px solid var(--border);
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
  color: var(--text-default);
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  min-height: 34px;
  width: fit-content;
  border-radius: 999px;
  border: 1px solid ${props => (props.$active ? 'transparent' : 'var(--border)')};
  background: ${props => (props.$active ? 'var(--accent)' : 'var(--surface-muted)')};
  color: ${props => (props.$active ? 'white' : 'var(--text-default)')};
  padding: 0.2rem 0.65rem;
  cursor: pointer;
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const SecondaryButton = styled.button`
  min-height: 34px;
  width: fit-content;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface-muted);
  color: var(--text-default);
  padding: 0.2rem 0.65rem;
  cursor: pointer;
`;

type FormState = {
  name: string;
  type: HazardType;
  severity: HazardSeverity;
  location: string;
  description: string;
};

const defaultFormState: FormState = {
  name: '',
  type: 'trap',
  severity: 'moderate',
  location: '',
  description: ''
};

const hazardTypes: HazardType[] = ['trap', 'poison', 'disease', 'curse', 'environment'];
const hazardSeverities: HazardSeverity[] = ['low', 'moderate', 'high', 'deadly'];
type HazardStatusFilter = 'all' | 'active' | 'resolved';
type HazardSort = 'newest' | 'oldest' | 'severity' | 'status';

const severityRank: Record<HazardSeverity, number> = {
  deadly: 4,
  high: 3,
  moderate: 2,
  low: 1
};

const getCreatedAtFromId = (id: string): number => {
  const [prefix] = id.split('-');
  const asNumber = Number(prefix);
  return Number.isFinite(asNumber) ? asNumber : 0;
};

const toTitleCase = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const createHazard = (form: FormState): CampaignHazard => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  name: form.name.trim(),
  type: form.type,
  severity: form.severity,
  location: form.location.trim(),
  description: form.description.trim(),
  active: true
});

const CampaignHazards: React.FC<{
  hazards: CampaignHazard[];
  onAddHazard: (hazard: CampaignHazard) => void;
  onToggleHazardActive: (hazardId: string) => void;
  onUpdateHazard: (hazard: CampaignHazard) => void;
  onDeleteHazard: (hazardId: string) => void;
}> = ({ hazards, onAddHazard, onToggleHazardActive, onUpdateHazard, onDeleteHazard }) => {
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [editingHazardId, setEditingHazardId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(defaultFormState);
  const [typeFilter, setTypeFilter] = useState<'all' | HazardType>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | HazardSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<HazardStatusFilter>('all');
  const [sortBy, setSortBy] = useState<HazardSort>('newest');

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.description.trim()) {
      return;
    }

    onAddHazard(createHazard(form));
    setForm(defaultFormState);
  };

  const summary = useMemo(() => {
    const activeCount = hazards.filter((hazard) => hazard.active).length;
    const resolvedCount = hazards.length - activeCount;

    return {
      total: hazards.length,
      active: activeCount,
      resolved: resolvedCount,
      low: hazards.filter((hazard) => hazard.severity === 'low').length,
      moderate: hazards.filter((hazard) => hazard.severity === 'moderate').length,
      high: hazards.filter((hazard) => hazard.severity === 'high').length,
      deadly: hazards.filter((hazard) => hazard.severity === 'deadly').length
    };
  }, [hazards]);

  const filteredHazards = useMemo(() => {
    return hazards.filter((hazard) => {
      const matchesType = typeFilter === 'all' || hazard.type === typeFilter;
      const matchesSeverity = severityFilter === 'all' || hazard.severity === severityFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && hazard.active) ||
        (statusFilter === 'resolved' && !hazard.active);

      return matchesType && matchesSeverity && matchesStatus;
    });
  }, [hazards, severityFilter, statusFilter, typeFilter]);

  const sortedHazards = useMemo(() => {
    const hazardsToSort = [...filteredHazards];

    return hazardsToSort.sort((a, b) => {
      if (sortBy === 'newest') {
        return getCreatedAtFromId(b.id) - getCreatedAtFromId(a.id);
      }

      if (sortBy === 'oldest') {
        return getCreatedAtFromId(a.id) - getCreatedAtFromId(b.id);
      }

      if (sortBy === 'severity') {
        return severityRank[b.severity] - severityRank[a.severity];
      }

      if (a.active === b.active) {
        return 0;
      }

      return a.active ? -1 : 1;
    });
  }, [filteredHazards, sortBy]);

  const clearFilters = () => {
    setTypeFilter('all');
    setSeverityFilter('all');
    setStatusFilter('all');
  };

  const showActiveOnly = () => {
    setStatusFilter('active');
  };

  const startEditingHazard = (hazard: CampaignHazard) => {
    setEditingHazardId(hazard.id);
    setEditForm({
      name: hazard.name,
      type: hazard.type,
      severity: hazard.severity,
      location: hazard.location,
      description: hazard.description
    });
  };

  const cancelEditingHazard = () => {
    setEditingHazardId(null);
    setEditForm(defaultFormState);
  };

  const saveEditingHazard = (hazard: CampaignHazard) => {
    if (!editForm.name.trim() || !editForm.location.trim() || !editForm.description.trim()) {
      return;
    }

    onUpdateHazard({
      ...hazard,
      name: editForm.name.trim(),
      type: editForm.type,
      severity: editForm.severity,
      location: editForm.location.trim(),
      description: editForm.description.trim()
    });

    cancelEditingHazard();
  };

  const updateEditField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <HazardsContainer>
      <HazardsHeader>Campaign Hazards</HazardsHeader>

      <SummaryGrid>
        <SummaryCard>
          <SummaryLabel>Total Hazards</SummaryLabel>
          <SummaryValue>{summary.total}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Active / Resolved</SummaryLabel>
          <SummaryValue>
            {summary.active} / {summary.resolved}
          </SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Severity Mix</SummaryLabel>
          <SummaryValue>
            L{summary.low} • M{summary.moderate} • H{summary.high} • D{summary.deadly}
          </SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <FilterGrid>
        <Label>
          Filter by Type
          <Select
            aria-label="Filter Hazard Type"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as 'all' | HazardType)}
          >
            <option value="all">All Types</option>
            {hazardTypes.map((hazardType) => (
              <option key={hazardType} value={hazardType}>
                {toTitleCase(hazardType)}
              </option>
            ))}
          </Select>
        </Label>

        <Label>
          Filter by Severity
          <Select
            aria-label="Filter Hazard Severity"
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value as 'all' | HazardSeverity)}
          >
            <option value="all">All Severities</option>
            {hazardSeverities.map((severity) => (
              <option key={severity} value={severity}>
                {toTitleCase(severity)}
              </option>
            ))}
          </Select>
        </Label>

        <Label>
          Sort Hazards
          <Select
            aria-label="Sort Hazards"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as HazardSort)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="severity">Severity</option>
            <option value="status">Status</option>
          </Select>
        </Label>

        <Label>
          Filter by Status
          <Select
            aria-label="Filter Hazard Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as HazardStatusFilter)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </Select>
        </Label>
      </FilterGrid>

      <MetaRow>
        <SubmitButton type="button" onClick={clearFilters}>
          Clear Filters
        </SubmitButton>
        <SubmitButton type="button" onClick={showActiveOnly}>
          Show Active Only
        </SubmitButton>
      </MetaRow>

      <Form onSubmit={handleSubmit}>
        <Label>
          Hazard Name
          <Input
            aria-label="Hazard Name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
        </Label>

        <Label>
          Location
          <Input
            aria-label="Hazard Location"
            value={form.location}
            onChange={(event) => updateField('location', event.target.value)}
          />
        </Label>

        <Label>
          Type
          <Select
            aria-label="Hazard Type"
            value={form.type}
            onChange={(event) => updateField('type', event.target.value as HazardType)}
          >
            {hazardTypes.map((hazardType) => (
              <option key={hazardType} value={hazardType}>
                {toTitleCase(hazardType)}
              </option>
            ))}
          </Select>
        </Label>

        <Label>
          Severity
          <Select
            aria-label="Hazard Severity"
            value={form.severity}
            onChange={(event) => updateField('severity', event.target.value as HazardSeverity)}
          >
            {hazardSeverities.map((severity) => (
              <option key={severity} value={severity}>
                {toTitleCase(severity)}
              </option>
            ))}
          </Select>
        </Label>

        <FullWidth>
          <Label>
            Description
            <TextArea
              aria-label="Hazard Description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </Label>
        </FullWidth>

        <FullWidth>
          <SubmitButton type="submit">Add Hazard</SubmitButton>
        </FullWidth>
      </Form>

      <HazardList>
        {sortedHazards.length === 0 ? (
          <p>No hazards tracked yet.</p>
        ) : (
          sortedHazards.map((hazard) => (
            <HazardCard key={hazard.id}>
              {editingHazardId === hazard.id ? (
                <>
                  <Label>
                    Hazard Name
                    <Input
                      aria-label="Edit Hazard Name"
                      value={editForm.name}
                      onChange={(event) => updateEditField('name', event.target.value)}
                    />
                  </Label>

                  <Label>
                    Location
                    <Input
                      aria-label="Edit Hazard Location"
                      value={editForm.location}
                      onChange={(event) => updateEditField('location', event.target.value)}
                    />
                  </Label>

                  <Label>
                    Type
                    <Select
                      aria-label="Edit Hazard Type"
                      value={editForm.type}
                      onChange={(event) => updateEditField('type', event.target.value as HazardType)}
                    >
                      {hazardTypes.map((hazardType) => (
                        <option key={hazardType} value={hazardType}>
                          {toTitleCase(hazardType)}
                        </option>
                      ))}
                    </Select>
                  </Label>

                  <Label>
                    Severity
                    <Select
                      aria-label="Edit Hazard Severity"
                      value={editForm.severity}
                      onChange={(event) => updateEditField('severity', event.target.value as HazardSeverity)}
                    >
                      {hazardSeverities.map((severity) => (
                        <option key={severity} value={severity}>
                          {toTitleCase(severity)}
                        </option>
                      ))}
                    </Select>
                  </Label>

                  <Label>
                    Description
                    <TextArea
                      aria-label="Edit Hazard Description"
                      value={editForm.description}
                      onChange={(event) => updateEditField('description', event.target.value)}
                    />
                  </Label>

                  <ActionRow>
                    <SubmitButton type="button" onClick={() => saveEditingHazard(hazard)}>
                      Save Hazard
                    </SubmitButton>
                    <SecondaryButton type="button" onClick={cancelEditingHazard}>
                      Cancel Edit
                    </SecondaryButton>
                  </ActionRow>
                </>
              ) : (
                <>
                  <h3>{hazard.name}</h3>
                  <MetaRow>
                    <Pill>{toTitleCase(hazard.type)}</Pill>
                    <Pill>{toTitleCase(hazard.severity)}</Pill>
                    <Pill>{hazard.location}</Pill>
                  </MetaRow>
                  <p>{hazard.description}</p>
                  <ActionRow>
                    <ToggleButton
                      type="button"
                      $active={hazard.active}
                      onClick={() => onToggleHazardActive(hazard.id)}
                    >
                      {hazard.active ? 'Active' : 'Resolved'}
                    </ToggleButton>
                    <SecondaryButton type="button" onClick={() => startEditingHazard(hazard)}>
                      Edit Hazard
                    </SecondaryButton>
                    <SecondaryButton type="button" onClick={() => onDeleteHazard(hazard.id)}>
                      Delete Hazard
                    </SecondaryButton>
                  </ActionRow>
                </>
              )}
            </HazardCard>
          ))
        )}
      </HazardList>
    </HazardsContainer>
  );
};

export default CampaignHazards;
