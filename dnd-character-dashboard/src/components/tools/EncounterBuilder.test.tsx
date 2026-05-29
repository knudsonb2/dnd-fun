import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import EncounterBuilder from './EncounterBuilder';
import { mockCharacters } from '../../data/mockCharacters';

const savedEncounter = {
  id: 'saved-1',
  name: 'Goblin Roadblock',
  createdAt: '2026-01-01T00:00:00.000Z',
  difficulty: 'Medium' as const,
  environment: 'Road',
  monsterGroups: [{ monsterId: 'goblin', quantity: 2 }],
  combatStats: {
    initiative: 0,
    totalHp: 14,
    totalAc: 15
  }
};

describe('EncounterBuilder', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows unsaved state and toggles update button while editing', () => {
    localStorage.setItem('dnd:encounters', JSON.stringify([savedEncounter]));
    render(<EncounterBuilder characters={[mockCharacters[0], mockCharacters[1]]} />);

    fireEvent.click(screen.getByRole('button', { name: /load\/edit/i }));

    expect(screen.getByText(/saved state/i)).toBeInTheDocument();
    const updateButton = screen.getByRole('button', { name: /update encounter/i });
    expect(updateButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/update encounter name/i), {
      target: { value: 'Goblin Roadblock - Night' }
    });

    expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
    expect(updateButton).toBeEnabled();
  });

  test('resets draft and shows inline hints', () => {
    render(<EncounterBuilder characters={[mockCharacters[0]]} />);

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0' } });
    expect(screen.getByText(/invalid quantity was corrected/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /save encounter/i }));
    expect(screen.getByText(/auto-generated encounter name/i)).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('Dungeon'), { target: { value: 'Forest' } });
    fireEvent.click(screen.getByRole('button', { name: /reset draft/i }));
    expect(screen.getByDisplayValue('Dungeon')).toBeInTheDocument();
  });
});
