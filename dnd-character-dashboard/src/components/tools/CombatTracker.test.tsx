import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CombatTracker from './CombatTracker';
import { mockCharacters } from '../../data/mockCharacters';

describe('CombatTracker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('toggles a condition chip on a combatant', () => {
    render(<CombatTracker characters={[mockCharacters[0]]} />);

    const blindedChip = screen.getByRole('button', { name: 'Blinded' });
    expect(blindedChip).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(blindedChip);
    expect(blindedChip).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(blindedChip);
    expect(blindedChip).toHaveAttribute('aria-pressed', 'false');
  });

  test('rolls initiative for all combatants', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    render(<CombatTracker characters={[mockCharacters[0], mockCharacters[1]]} />);

    fireEvent.click(screen.getByRole('button', { name: /roll all initiative/i }));

    const rolledValues = screen.getAllByDisplayValue('11');
    expect(rolledValues.length).toBeGreaterThanOrEqual(2);
  });

  test('writes an event log entry for initiative roll', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.25);
    render(<CombatTracker characters={[mockCharacters[0]]} />);

    fireEvent.click(screen.getByRole('button', { name: /roll all initiative/i }));

    expect(screen.getByText(/rolled initiative for all combatants/i)).toBeInTheDocument();
  });

});
