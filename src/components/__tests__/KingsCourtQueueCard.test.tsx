import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KingsCourtQueueCard } from '../KingsCourtQueueCard';
import type { Team } from '../../types';

// Mock the teams data
const mockTeams: Team[] = [
  {
    name: "Test Team 1",
    players: ["Player 1", "Player 2", "Player 3", "Player 4"]
  },
  {
    name: "Test Team 2", 
    players: ["Player 5", "Player 6", "Player 7", "Player 8"]
  }
];

describe('KingsCourtQueueCard', () => {
  const mockOnAddToQueue = vi.fn();
  const mockOnRemoveFromQueue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with correct title and queue count', () => {
    render(
      <KingsCourtQueueCard
        teamQueue={mockTeams}
        onAddToQueue={mockOnAddToQueue}
        onRemoveFromQueue={mockOnRemoveFromQueue}
      />
    );

    expect(screen.getByText('Kings Court Queue (2)')).toBeInTheDocument();
  });

  it('should render empty state when queue is empty', () => {
    render(
      <KingsCourtQueueCard
        teamQueue={[]}
        onAddToQueue={mockOnAddToQueue}
        onRemoveFromQueue={mockOnRemoveFromQueue}
      />
    );

    expect(screen.getByText('Kings Court Queue (0)')).toBeInTheDocument();
    expect(screen.getByText('No teams in Kings Court queue')).toBeInTheDocument();
  });

  it('should render team cards for each team in queue', () => {
    render(
      <KingsCourtQueueCard
        teamQueue={mockTeams}
        onAddToQueue={mockOnAddToQueue}
        onRemoveFromQueue={mockOnRemoveFromQueue}
      />
    );

    expect(screen.getByText('Test Team 1')).toBeInTheDocument();
    expect(screen.getByText('Test Team 2')).toBeInTheDocument();
    expect(screen.getByText('Player 1, Player 2, Player 3, Player 4')).toBeInTheDocument();
    expect(screen.getByText('Player 5, Player 6, Player 7, Player 8')).toBeInTheDocument();
  });

  it('should call onAddToQueue when Add Team button is clicked', () => {
    render(
      <KingsCourtQueueCard
        teamQueue={mockTeams}
        onAddToQueue={mockOnAddToQueue}
        onRemoveFromQueue={mockOnRemoveFromQueue}
      />
    );

    const addButton = screen.getByText('Add Team to Kings Court Queue');
    fireEvent.click(addButton);

    expect(mockOnAddToQueue).toHaveBeenCalledTimes(1);
  });

  it('should call onRemoveFromQueue when remove button is clicked', () => {
    render(
      <KingsCourtQueueCard
        teamQueue={mockTeams}
        onAddToQueue={mockOnAddToQueue}
        onRemoveFromQueue={mockOnRemoveFromQueue}
      />
    );

    const removeButtons = screen.getAllByLabelText('Remove team from Kings Court queue');
    fireEvent.click(removeButtons[0]);

    expect(mockOnRemoveFromQueue).toHaveBeenCalledWith(0);
  });

  it('should have correct styling classes', () => {
    render(
      <KingsCourtQueueCard
        teamQueue={mockTeams}
        onAddToQueue={mockOnAddToQueue}
        onRemoveFromQueue={mockOnRemoveFromQueue}
      />
    );

    const card = screen.getByText('Kings Court Queue (2)').closest('div');
    expect(card).toHaveClass('bg-gradient-to-br', 'from-amber-50', 'to-amber-100');
  });
}); 