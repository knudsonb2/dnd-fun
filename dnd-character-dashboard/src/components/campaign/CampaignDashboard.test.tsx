import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CampaignDashboard from './CampaignDashboard';
import { mockCampaign } from '../../data/mockCampaign';
import { mockCharacters } from '../../data/mockCharacters';

describe('CampaignDashboard hazards', () => {
  test('adds a new hazard from hazards tab form', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={{ ...mockCampaign, hazards: [] }}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hazards' }));
    fireEvent.change(screen.getByLabelText('Hazard Name'), { target: { value: 'Blade Hall Trap' } });
    fireEvent.change(screen.getByLabelText('Hazard Location'), { target: { value: 'Hall of Blades' } });
    fireEvent.change(screen.getByLabelText('Hazard Description'), {
      target: { value: 'Rotating blades activate when the center tile is pressed.' }
    });

    fireEvent.click(screen.getByRole('button', { name: /add hazard/i }));

    expect(onCampaignChange).toHaveBeenCalledTimes(1);
    const updatedCampaign = onCampaignChange.mock.calls[0][0];
    expect(updatedCampaign.hazards).toHaveLength(1);
    expect(updatedCampaign.hazards[0].name).toBe('Blade Hall Trap');
    expect(updatedCampaign.hazards[0].active).toBe(true);
  });

  test('toggles hazard active state', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={mockCampaign}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hazards' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Active' })[0]);

    expect(onCampaignChange).toHaveBeenCalledTimes(1);
    const updatedCampaign = onCampaignChange.mock.calls[0][0];
    expect(updatedCampaign.hazards[0].active).toBe(false);
  });

  test('filters hazards by type', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={mockCampaign}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hazards' }));
    fireEvent.change(screen.getByLabelText('Filter Hazard Type'), { target: { value: 'disease' } });

    expect(screen.getByText('Shadow Rot')).toBeInTheDocument();
    expect(screen.queryByText('Needle Trap')).not.toBeInTheDocument();
  });

  test('shows hazard summary stats', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={mockCampaign}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hazards' }));

    expect(screen.getByText('Total Hazards')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
    expect(screen.getByText('L0 • M1 • H1 • D0')).toBeInTheDocument();
  });

  test('quick action show active only filters resolved hazards', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={mockCampaign}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hazards' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show Active Only' }));

    expect(screen.getByText('Needle Trap')).toBeInTheDocument();
    expect(screen.queryByText('Shadow Rot')).not.toBeInTheDocument();
  });

  test('sorts hazards by severity with highest first', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={mockCampaign}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hazards' }));
    fireEvent.change(screen.getByLabelText('Sort Hazards'), { target: { value: 'severity' } });

    const hazardHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(hazardHeadings[0]).toHaveTextContent('Shadow Rot');
    expect(hazardHeadings[1]).toHaveTextContent('Needle Trap');
  });

  test('edits an existing hazard and saves changes', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={mockCampaign}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hazards' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit Hazard' })[0]);
    fireEvent.change(screen.getByLabelText('Edit Hazard Name'), { target: { value: 'Needle Trap Prime' } });
    fireEvent.change(screen.getByLabelText('Edit Hazard Severity'), { target: { value: 'deadly' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Hazard' }));

    expect(onCampaignChange).toHaveBeenCalled();
    const updatedCampaign = onCampaignChange.mock.calls[0][0];
    expect(updatedCampaign.hazards[0].name).toBe('Needle Trap Prime');
    expect(updatedCampaign.hazards[0].severity).toBe('deadly');
  });

  test('deletes a hazard from the list', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={mockCampaign}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hazards' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete Hazard' })[0]);

    expect(onCampaignChange).toHaveBeenCalledTimes(1);
    const updatedCampaign = onCampaignChange.mock.calls[0][0];
    expect(updatedCampaign.hazards).toHaveLength(1);
    expect(updatedCampaign.hazards[0].name).toBe('Shadow Rot');
  });
});

describe('CampaignDashboard notes', () => {
  test('adds a new campaign note with category tag', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={{ ...mockCampaign, notes: [] }}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Notes' }));
    fireEvent.change(screen.getByLabelText('New campaign note'), {
      target: { value: 'The old mill hides a portal key.' }
    });
    fireEvent.change(screen.getByLabelText('Note category'), {
      target: { value: 'location' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add Note' }));

    expect(onCampaignChange).toHaveBeenCalledTimes(1);
    const updatedCampaign = onCampaignChange.mock.calls[0][0];
    expect(updatedCampaign.notes[0]).toBe('[location] The old mill hides a portal key.');
  });

  test('edits an existing note and updates category', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={{ ...mockCampaign, notes: ['Scout report pending'] }}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Notes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByLabelText('Edit note text'), {
      target: { value: 'Scout report confirms cult movement' }
    });
    fireEvent.change(screen.getByLabelText('Edit note category'), {
      target: { value: 'story' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onCampaignChange).toHaveBeenCalledTimes(1);
    const updatedCampaign = onCampaignChange.mock.calls[0][0];
    expect(updatedCampaign.notes[0]).toBe('[story] Scout report confirms cult movement');
  });

  test('deletes an existing note', () => {
    const onCampaignChange = jest.fn();

    render(
      <CampaignDashboard
        campaign={{ ...mockCampaign, notes: ['Temporary note'] }}
        characters={mockCharacters}
        onCampaignChange={onCampaignChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Notes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onCampaignChange).toHaveBeenCalledTimes(1);
    const updatedCampaign = onCampaignChange.mock.calls[0][0];
    expect(updatedCampaign.notes).toEqual([]);
  });
});
