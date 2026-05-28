import React from 'react';
import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DiceRoller from './DiceRoller';
import { saveDiceHistory, saveDiceSoundEnabled } from '../../utils/storage';

const rollButtonRegex = /roll/i;

const getResultDie = (): HTMLElement => screen.getByText((_, element) => element?.getAttribute('aria-live') === 'polite');

describe('DiceRoller', () => {
  const mockPlay = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    mockPlay.mockClear();
    (global as unknown as { Audio: jest.Mock }).Audio = jest.fn().mockImplementation(() => ({
      play: mockPlay
    }));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('applies modifier to XdY rolls', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    render(<DiceRoller />);

    fireEvent.change(screen.getByLabelText(/count/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/^die$/i), { target: { value: '6' } });
    fireEvent.change(screen.getByLabelText(/modifier/i), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: rollButtonRegex }));
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(getResultDie()).toHaveTextContent('11');
    expect(screen.getByText(/\(normal\): \[4, 4\] =>\s*11/i)).toBeInTheDocument();
    expect(randomSpy).toHaveBeenCalledTimes(2);
  });

  test('uses higher roll for advantage and lower for disadvantage', () => {
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1);

    render(<DiceRoller />);

    fireEvent.change(screen.getByLabelText(/^die$/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/count/i), { target: { value: '1' } });

    fireEvent.change(screen.getByLabelText(/mode/i), { target: { value: 'advantage' } });
    fireEvent.click(screen.getByRole('button', { name: rollButtonRegex }));
    act(() => {
      jest.advanceTimersByTime(350);
    });
    expect(getResultDie()).toHaveTextContent('19');

    fireEvent.change(screen.getByLabelText(/mode/i), { target: { value: 'disadvantage' } });
    fireEvent.click(screen.getByRole('button', { name: rollButtonRegex }));
    act(() => {
      jest.advanceTimersByTime(350);
    });
    expect(getResultDie()).toHaveTextContent('3');
    expect(randomSpy).toHaveBeenCalledTimes(4);
  });

  test('shows critical success and critical fail for single d20', () => {
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.999).mockReturnValueOnce(0);
    render(<DiceRoller />);

    fireEvent.change(screen.getByLabelText(/^die$/i), { target: { value: '20' } });
    fireEvent.change(screen.getByLabelText(/count/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/mode/i), { target: { value: 'normal' } });

    fireEvent.click(screen.getByRole('button', { name: rollButtonRegex }));
    act(() => {
      jest.advanceTimersByTime(350);
    });
    expect(screen.getByText(/critical success/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: rollButtonRegex }));
    act(() => {
      jest.advanceTimersByTime(350);
    });
    expect(screen.getByText(/critical fail/i)).toBeInTheDocument();
  });

  test('applies a preset to roll configuration', () => {
    render(<DiceRoller />);

    fireEvent.change(screen.getByLabelText(/preset/i), { target: { value: 'greatsword' } });

    expect(screen.getByLabelText(/count/i)).toHaveValue(2);
    expect(screen.getByLabelText(/^die$/i)).toHaveValue('6');
    expect(screen.getByLabelText(/modifier/i)).toHaveValue(3);
    expect(screen.getByLabelText(/mode/i)).toHaveValue('normal');
  });

  test('loads persisted roll history from storage', () => {
    saveDiceHistory([
      {
        id: 1,
        count: 2,
        sides: 6,
        modifier: 3,
        mode: 'normal',
        rolls: [4, 4],
        selectedRoll: 4,
        total: 11,
        isNat20Crit: false,
        isNat1Crit: false
      }
    ]);

    render(<DiceRoller />);

    expect(screen.getByText(/\(normal\): \[4, 4\] =>\s*11/i)).toBeInTheDocument();
  });

  test('plays roll sound only when sound toggle is enabled', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    saveDiceSoundEnabled(false);
    render(<DiceRoller />);

    fireEvent.click(screen.getByRole('button', { name: rollButtonRegex }));
    act(() => {
      jest.advanceTimersByTime(350);
    });
    expect(mockPlay).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByLabelText(/roll sound/i));
    fireEvent.click(screen.getByRole('button', { name: rollButtonRegex }));
    act(() => {
      jest.advanceTimersByTime(350);
    });
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });
});
