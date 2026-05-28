import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Campaign } from '../../models/campaign.model';

const NotesContainer = styled.div`
  background: var(--surface-muted);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 20px;
  box-shadow: var(--shadow-sm);
`;

const NotesHeader = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
`;

const NotesSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  color: var(--brand-2);
  margin-top: 0;
  margin-bottom: 10px;
`;

const NotesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const NoteItem = styled.li`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 8px;
`;

const NoteText = styled.p`
  margin: 0;
`;

const FormRow = styled.form`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const NoteInput = styled.input`
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem;
`;

const SelectInput = styled.select`
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem;
  background: var(--surface);
`;

const Actions = styled.div`
  display: flex;
  gap: 0.45rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  border: 1px solid transparent;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: white;
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  cursor: pointer;
`;

const SecondaryButton = styled(Button)`
  background: var(--surface-muted);
  border-color: var(--border);
  color: var(--text-default);
`;

type NoteCategory = 'general' | 'location' | 'npc' | 'story';

const getNoteCategory = (note: string): NoteCategory => {
  const normalized = note.toLowerCase();
  if (normalized.startsWith('[location]')) {
    return 'location';
  }
  if (normalized.startsWith('[npc]')) {
    return 'npc';
  }
  if (normalized.startsWith('[story]')) {
    return 'story';
  }
  return 'general';
};

const stripNotePrefix = (note: string): string => note.replace(/^\[(location|npc|story)\]\s*/i, '');

const toStoredNote = (text: string, category: NoteCategory): string => {
  const trimmed = text.trim();
  if (category === 'general') {
    return trimmed;
  }
  return `[${category}] ${trimmed}`;
};

const CampaignNotes: React.FC<{
  campaign: Campaign;
  onCampaignChange: (campaign: Campaign) => void;
}> = ({ campaign, onCampaignChange }) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<NoteCategory>('general');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingCategory, setEditingCategory] = useState<NoteCategory>('general');

  const groupedNotes = useMemo(
    () => ({
      general: campaign.notes.filter((note) => getNoteCategory(note) === 'general'),
      location: campaign.notes.filter((note) => getNoteCategory(note) === 'location'),
      npc: campaign.notes.filter((note) => getNoteCategory(note) === 'npc'),
      story: campaign.notes.filter((note) => getNoteCategory(note) === 'story')
    }),
    [campaign.notes]
  );

  const updateNotes = (notes: string[]) => {
    onCampaignChange({ ...campaign, notes });
  };

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = newNoteText.trim();
    if (!trimmed) {
      return;
    }

    const nextNote = toStoredNote(trimmed, newNoteCategory);
    updateNotes([nextNote, ...campaign.notes]);
    setNewNoteText('');
    setNewNoteCategory('general');
  };

  const handleDeleteNote = (noteIndex: number) => {
    updateNotes(campaign.notes.filter((_, index) => index !== noteIndex));
    if (editingIndex === noteIndex) {
      setEditingIndex(null);
      setEditingText('');
      setEditingCategory('general');
    }
  };

  const beginEdit = (note: string, noteIndex: number) => {
    setEditingIndex(noteIndex);
    setEditingText(stripNotePrefix(note));
    setEditingCategory(getNoteCategory(note));
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
    setEditingCategory('general');
  };

  const saveEdit = () => {
    if (editingIndex === null) {
      return;
    }
    const trimmed = editingText.trim();
    if (!trimmed) {
      return;
    }

    const updated = campaign.notes.map((note, index) => {
      if (index !== editingIndex) {
        return note;
      }
      return toStoredNote(trimmed, editingCategory);
    });

    updateNotes(updated);
    cancelEdit();
  };

  const renderSection = (title: string, notes: string[], emptyText: string) => (
    <NotesSection>
      <SectionTitle>{title}</SectionTitle>
      <NotesList>
        {notes.length > 0 ? (
          campaign.notes
            .map((note, index) => ({ note, index }))
            .filter(({ note }) => notes.includes(note))
            .map(({ note, index }) => (
              <NoteItem key={`${note}-${index}`}>
                {editingIndex === index ? (
                  <>
                    <FormRow
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveEdit();
                      }}
                    >
                      <NoteInput
                        aria-label="Edit note text"
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                      />
                      <SelectInput
                        aria-label="Edit note category"
                        value={editingCategory}
                        onChange={(event) => setEditingCategory(event.target.value as NoteCategory)}
                      >
                        <option value="general">General</option>
                        <option value="location">Location</option>
                        <option value="npc">NPC</option>
                        <option value="story">Story</option>
                      </SelectInput>
                      <Button type="submit">Save</Button>
                    </FormRow>
                    <SecondaryButton type="button" onClick={cancelEdit}>Cancel</SecondaryButton>
                  </>
                ) : (
                  <>
                    <NoteText>{stripNotePrefix(note)}</NoteText>
                    <Actions>
                      <Button type="button" onClick={() => beginEdit(note, index)}>Edit</Button>
                      <SecondaryButton type="button" onClick={() => handleDeleteNote(index)}>Delete</SecondaryButton>
                    </Actions>
                  </>
                )}
              </NoteItem>
            ))
        ) : (
          <NoteItem>{emptyText}</NoteItem>
        )}
      </NotesList>
    </NotesSection>
  );

  return (
    <NotesContainer>
      <NotesHeader>Campaign Notes</NotesHeader>
      <FormRow onSubmit={handleAddNote}>
        <NoteInput
          aria-label="New campaign note"
          placeholder="Add a campaign note"
          value={newNoteText}
          onChange={(event) => setNewNoteText(event.target.value)}
        />
        <SelectInput
          aria-label="Note category"
          value={newNoteCategory}
          onChange={(event) => setNewNoteCategory(event.target.value as NoteCategory)}
        >
          <option value="general">General</option>
          <option value="location">Location</option>
          <option value="npc">NPC</option>
          <option value="story">Story</option>
        </SelectInput>
        <Button type="submit">Add Note</Button>
      </FormRow>
      
      {renderSection('General Campaign Notes', groupedNotes.general, 'No general notes yet')}
      {renderSection('Location Notes', groupedNotes.location, 'No location notes yet')}
      {renderSection('NPC Notes', groupedNotes.npc, 'No NPC notes yet')}
      {renderSection('Important Story Elements', groupedNotes.story, 'No important story elements yet')}
    </NotesContainer>
  );
};

export default CampaignNotes;
