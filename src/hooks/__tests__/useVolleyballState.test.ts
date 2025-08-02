import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useVolleyballState } from '../useVolleyballState';
import type { Team, Court } from '../../types';

describe('useVolleyballState', () => {
  let result: any;

  beforeEach(() => {
    result = renderHook(() => useVolleyballState()).result;
  });

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      expect(result.current.teams).toHaveLength(3);
      expect(result.current.registeredTeams).toHaveLength(12);
      expect(result.current.teamQueue).toHaveLength(4);
      expect(result.current.kingsCourtQueue).toHaveLength(0);
      expect(result.current.gameEvents).toHaveLength(0);
    });
  });

  describe('team management', () => {
    it('should add a new team correctly', () => {
      const newTeam = {
        teamName: 'Test Team',
        player1: 'Alice',
        player2: 'Bob',
        player3: 'Charlie',
        player4: 'David'
      };

      act(() => {
        result.current.setFormData(newTeam);
        result.current.handleSubmit({ preventDefault: () => {} } as any);
      });

      expect(result.current.registeredTeams).toHaveLength(13);
      expect(result.current.registeredTeams[12].name).toBe('Test Team');
      expect(result.current.gameEvents).toHaveLength(1);
      expect(result.current.gameEvents[0].type).toBe('team_added');
    });

    it('should delete a team correctly', () => {
      const initialLength = result.current.registeredTeams.length;
      const teamToDelete = result.current.registeredTeams[0];

      act(() => {
        result.current.setDeletingTeamIndex(0);
        result.current.handleDeleteTeam(0);
      });

      expect(result.current.registeredTeams).toHaveLength(initialLength - 1);
      expect(result.current.registeredTeams.find((t: Team) => t.name === teamToDelete.name)).toBeUndefined();
      expect(result.current.gameEvents).toHaveLength(1);
      expect(result.current.gameEvents[0].type).toBe('team_deleted');
    });
  });

  describe('queue management', () => {
    it('should add teams to general queue correctly', () => {
      const initialQueueLength = result.current.teamQueue.length;
      const availableTeams = result.current.registeredTeams.filter((team: Team) => {
        const inQueue = result.current.teamQueue.some((qTeam: Team) => qTeam.name === team.name);
        const onCourt = result.current.teams.some((court: Court) => 
          court.team1.name === team.name || court.team2.name === team.name
        );
        return !inQueue && !onCourt;
      });

      act(() => {
        result.current.setSelectedTeams([0, 1]);
        result.current.handleAddSelectedTeamsToQueue();
      });

      expect(result.current.teamQueue).toHaveLength(initialQueueLength + 2);
      expect(result.current.gameEvents).toHaveLength(1);
      expect(result.current.gameEvents[0].type).toBe('teams_queued');
    });

    it('should remove teams from general queue correctly', () => {
      const initialQueueLength = result.current.teamQueue.length;
      const teamToRemove = result.current.teamQueue[0];

      act(() => {
        result.current.handleRemoveFromQueue(0);
      });

      expect(result.current.teamQueue).toHaveLength(initialQueueLength - 1);
      expect(result.current.teamQueue.find((t: Team) => t.name === teamToRemove.name)).toBeUndefined();
    });
  });

  describe('Kings Court queue management', () => {
    it('should add teams to Kings Court queue correctly', () => {
      const initialQueueLength = result.current.kingsCourtQueue.length;
      const availableTeams = result.current.registeredTeams.filter((team: Team) => {
        const inQueue = result.current.teamQueue.some((qTeam: Team) => qTeam.name === team.name);
        const inKingsCourtQueue = result.current.kingsCourtQueue.some((kTeam: Team) => kTeam.name === team.name);
        const onCourt = result.current.teams.some((court: Court) => 
          court.team1.name === team.name || court.team2.name === team.name
        );
        return !inQueue && !inKingsCourtQueue && !onCourt;
      });

      act(() => {
        result.current.setSelectedTeamsForKingsCourt([0, 1]);
        result.current.handleAddSelectedTeamsToKingsCourtQueue();
      });

      expect(result.current.kingsCourtQueue).toHaveLength(initialQueueLength + 2);
      expect(result.current.gameEvents).toHaveLength(1);
      expect(result.current.gameEvents[0].type).toBe('teams_added');
      expect(result.current.gameEvents[0].courtNumber).toBe('Kings Court');
    });

    it('should remove teams from Kings Court queue correctly', () => {
      // First add a team to the Kings Court queue
      act(() => {
        result.current.setSelectedTeamsForKingsCourt([0]);
        result.current.handleAddSelectedTeamsToKingsCourtQueue();
      });

      const initialQueueLength = result.current.kingsCourtQueue.length;
      const teamToRemove = result.current.kingsCourtQueue[0];

      act(() => {
        result.current.handleRemoveFromKingsCourtQueue(0);
      });

      expect(result.current.kingsCourtQueue).toHaveLength(initialQueueLength - 1);
      expect(result.current.kingsCourtQueue.find((t: Team) => t.name === teamToRemove.name)).toBeUndefined();
    });

    it('should select all available teams for Kings Court queue', () => {
      const availableTeams = result.current.registeredTeams.filter((team: Team) => {
        const inQueue = result.current.teamQueue.some((qTeam: Team) => qTeam.name === team.name);
        const inKingsCourtQueue = result.current.kingsCourtQueue.some((kTeam: Team) => kTeam.name === team.name);
        const onCourt = result.current.teams.some((court: Court) => 
          court.team1.name === team.name || court.team2.name === team.name
        );
        return !inQueue && !inKingsCourtQueue && !onCourt;
      });

      act(() => {
        result.current.handleSelectAllTeamsForKingsCourt();
      });

      expect(result.current.selectedTeamsForKingsCourt).toHaveLength(availableTeams.length);
    });
  });

  describe('court operations', () => {
    it('should clear teams from court correctly', () => {
      const court = result.current.teams[0];
      const initialTeam1 = court.team1;
      const initialTeam2 = court.team2;

      act(() => {
        result.current.handleClearTeams(0);
      });

      expect(result.current.teams[0].team1.name).toBe('No Team');
      expect(result.current.teams[0].team2.name).toBe('No Team');
      expect(result.current.gameEvents).toHaveLength(1);
      expect(result.current.gameEvents[0].type).toBe('court_cleared');
    });

    it('should fill court from queue correctly', () => {
      const court = result.current.teams[0];
      const initialTeam1 = court.team1;
      const initialTeam2 = court.team2;

      act(() => {
        result.current.handleFillFromQueue(0);
      });

      // Should fill with teams from queue
      expect(result.current.teams[0].team1.name).not.toBe('No Team');
      expect(result.current.teams[0].team2.name).not.toBe('No Team');
      expect(result.current.gameEvents).toHaveLength(1);
      expect(result.current.gameEvents[0].type).toBe('teams_added');
    });

    it('should fill Kings Court from Kings Court queue first', () => {
      // Add teams to Kings Court queue
      act(() => {
        result.current.setSelectedTeamsForKingsCourt([0, 1]);
        result.current.handleAddSelectedTeamsToKingsCourtQueue();
      });

      // Clear Kings Court
      act(() => {
        result.current.handleClearTeams(2);
      });

      // Fill Kings Court
      act(() => {
        result.current.handleFillFromQueue(2);
      });

      expect(result.current.teams[2].team1.name).not.toBe('No Team');
      expect(result.current.teams[2].team2.name).not.toBe('No Team');
      expect(result.current.kingsCourtQueue).toHaveLength(0); // Should use Kings Court queue first
    });
  });

  describe('game reporting', () => {
    it('should report game correctly for Challenger Court', () => {
      // Fill a Challenger Court
      act(() => {
        result.current.handleFillFromQueue(0);
      });

      const court = result.current.teams[0];
      const team1Score = '21';
      const team2Score = '19';

      act(() => {
        result.current.setReportingCourtIndex(0);
        result.current.setGameScoreData({ team1Score, team2Score });
        result.current.handleReportGameSubmit({ preventDefault: () => {} } as any);
      });

      expect(result.current.gameEvents).toHaveLength(2); // 1 for fill, 1 for game report
      const gameEvent = result.current.gameEvents[0];
      expect(gameEvent.type).toBe('game_reported');
      expect(gameEvent.score).toBe('21-19');
      expect(gameEvent.winner).toBe(court.team1);
      expect(gameEvent.loser).toBe(court.team2);
      
      // Winner should be added to Kings Court queue
      expect(result.current.kingsCourtQueue.some((t: Team) => t.name === court.team1.name)).toBe(true);
    });

    it('should report game correctly for Kings Court', () => {
      // Fill Kings Court
      act(() => {
        result.current.setSelectedTeamsForKingsCourt([0, 1]);
        result.current.handleAddSelectedTeamsToKingsCourtQueue();
        result.current.handleFillFromQueue(2);
      });

      const court = result.current.teams[2];
      const team1Score = '21';
      const team2Score = '19';

      act(() => {
        result.current.setReportingCourtIndex(2);
        result.current.setGameScoreData({ team1Score, team2Score });
        result.current.handleReportGameSubmit({ preventDefault: () => {} } as any);
      });

      expect(result.current.gameEvents).toHaveLength(3); // 1 for queue add, 1 for fill, 1 for game report
      const gameEvent = result.current.gameEvents[0];
      expect(gameEvent.type).toBe('game_reported');
      expect(gameEvent.score).toBe('21-19');
      expect(gameEvent.winner).toBe(court.team1);
      expect(gameEvent.loser).toBe(court.team2);
      
      // Winner should stay on Kings Court
      expect(result.current.teams[2].team1.name).toBe(court.team1.name);
    });
  });

  describe('modal state management', () => {
    it('should handle modal open/close states correctly', () => {
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.isAddToQueueModalOpen).toBe(false);
      expect(result.current.isAddToKingsCourtQueueModalOpen).toBe(false);

      act(() => {
        result.current.setIsModalOpen(true);
      });

      expect(result.current.isModalOpen).toBe(true);

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.isAddToQueueModalOpen).toBe(false);
      expect(result.current.isAddToKingsCourtQueueModalOpen).toBe(false);
    });
  });

  describe('event management', () => {
    it('should add game events with correct state snapshots', () => {
      act(() => {
        result.current.handleClearTeams(0);
      });

      const event = result.current.gameEvents[0];
      expect(event.stateSnapshot).toBeDefined();
      expect(event.stateSnapshot.teams).toBeDefined();
      expect(event.stateSnapshot.registeredTeams).toBeDefined();
      expect(event.stateSnapshot.teamQueue).toBeDefined();
      expect(event.stateSnapshot.kingsCourtQueue).toBeDefined();
    });

    it('should reset to event correctly', () => {
      // Create some events
      act(() => {
        result.current.handleClearTeams(0);
        result.current.handleClearTeams(1);
      });

      const eventId = result.current.gameEvents[1].id; // Second event

      act(() => {
        result.current.resetToEvent(eventId);
      });

      // Should only have events up to the reset point
      expect(result.current.gameEvents).toHaveLength(1);
    });
  });
}); 