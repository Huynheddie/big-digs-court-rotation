import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddToKingsCourtQueueModal } from '../AddToKingsCourtQueueModal';
import type { Team } from '../../../types';

// Mock the teams data
const mockAvailableTeams: Team[] = [
  {
    name: "Test Team 1",
    players: ["Player 1", "Player 2", "Player 3", "Player 4"]
  },
  {
    name: "Test Team 2", 
    players: ["Player 5", "Player 6", "Player 7", "Player 8"]
  },
  {
    name: "Test Team 3",
    players: ["Player 9", "Player 10", "Player 11", "Player 12"]
  }
];

describe('AddToKingsCourtQueueModal', () => {
  const mockOnToggleTeamSelection = vi.fn();
  const mockOnSelectAllTeams = vi.fn();
  const mockOnAddSelectedTeams = vi.fn();
  const mockOnCancel = vi.fn();
  const mockSetSelectedTeams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={false}
        availableTeams={mockAvailableTeams}
        selectedTeams={[]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    expect(screen.queryByText('Add Teams to Kings Court Queue')).not.toBeInTheDocument();
  });

  it('should render with correct title when open', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={mockAvailableTeams}
        selectedTeams={[]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    expect(screen.getByText('Add Teams to Kings Court Queue')).toBeInTheDocument();
  });

  it('should render all available teams', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={mockAvailableTeams}
        selectedTeams={[]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    expect(screen.getByText('Test Team 1')).toBeInTheDocument();
    expect(screen.getByText('Test Team 2')).toBeInTheDocument();
    expect(screen.getByText('Test Team 3')).toBeInTheDocument();
  });

  it('should render empty state when no teams available', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={[]}
        selectedTeams={[]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    expect(screen.getByText('No teams available for Kings Court queue')).toBeInTheDocument();
    expect(screen.getByText('All teams are either on courts or in queues')).toBeInTheDocument();
  });

  it('should call onToggleTeamSelection when team card is clicked', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={mockAvailableTeams}
        selectedTeams={[]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    const teamCards = screen.getAllByText(/Test Team/);
    fireEvent.click(teamCards[0]);

    expect(mockOnToggleTeamSelection).toHaveBeenCalledWith(0);
  });

  it('should call onSelectAllTeams when Select All button is clicked', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={mockAvailableTeams}
        selectedTeams={[]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    const selectAllButton = screen.getByText('Select All Available');
    fireEvent.click(selectAllButton);

    expect(mockOnSelectAllTeams).toHaveBeenCalledTimes(1);
  });

  it('should call onAddSelectedTeams when Add Selected Teams button is clicked', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={mockAvailableTeams}
        selectedTeams={[0, 1]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    const addButton = screen.getByText(/Add.*2.*Teams.*to Kings Court Queue/);
    fireEvent.click(addButton);

    expect(mockOnAddSelectedTeams).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={mockAvailableTeams}
        selectedTeams={[]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when backdrop is clicked', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={mockAvailableTeams}
        selectedTeams={[]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should show selected count when teams are selected', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={mockAvailableTeams}
        selectedTeams={[0, 1]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    expect(screen.getByText(/Add.*2.*Teams.*to Kings Court Queue/)).toBeInTheDocument();
  });

  it('should have correct styling for selected teams', () => {
    render(
      <AddToKingsCourtQueueModal
        isOpen={true}
        availableTeams={mockAvailableTeams}
        selectedTeams={[0]}
        onToggleTeamSelection={mockOnToggleTeamSelection}
        onSelectAllTeams={mockOnSelectAllTeams}
        onAddSelectedTeams={mockOnAddSelectedTeams}
        onCancel={mockOnCancel}
        setSelectedTeams={mockSetSelectedTeams}
      />
    );

    const selectedTeamCard = screen.getByText('Test Team 1').closest('div');
    expect(selectedTeamCard).toHaveClass('border-amber-400', 'bg-amber-200');
  });
}); 