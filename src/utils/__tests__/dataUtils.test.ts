import { describe, it, expect } from 'vitest';
import { getAvailableTeams, isTeamInQueue, isTeamOnCourt } from '../dataUtils';
import type { Team, Court } from '../../types';

describe('dataUtils', () => {
  const mockTeams: Team[] = [
    { name: 'Team A', players: ['Player 1', 'Player 2', 'Player 3', 'Player 4'] },
    { name: 'Team B', players: ['Player 5', 'Player 6', 'Player 7', 'Player 8'] },
    { name: 'Team C', players: ['Player 9', 'Player 10', 'Player 11', 'Player 12'] },
    { name: 'Team D', players: ['Player 13', 'Player 14', 'Player 15', 'Player 16'] }
  ];

  const mockCourts: Court[] = [
    {
      court: 'Challenger Court #1',
      team1: { name: 'No Team', players: ['', '', '', ''] },
      team2: { name: 'No Team', players: ['', '', '', ''] },
      status: 'inactive',
      score: '0-0',
      netColor: 'red'
    },
    {
      court: 'Challenger Court #2',
      team1: mockTeams[0],
      team2: mockTeams[1],
      status: 'active',
      score: '0-0',
      netColor: 'blue'
    },
    {
      court: 'Kings Court',
      team1: { name: 'No Team', players: ['', '', '', ''] },
      team2: { name: 'No Team', players: ['', '', '', ''] },
      status: 'inactive',
      score: '0-0',
      netColor: 'gold'
    }
  ];

  const mockTeamQueue: Team[] = [mockTeams[2]];
  const mockKingsCourtQueue: Team[] = [mockTeams[3]];

  describe('getAvailableTeams', () => {
    it('should return teams not in queue and not on courts', () => {
      const availableTeams = getAvailableTeams(mockTeams, mockCourts, mockTeamQueue);
      
      // Team A and B are on courts, Team C is in queue, so only Team D should be available
      expect(availableTeams).toHaveLength(1);
      expect(availableTeams[0].name).toBe('Team D');
    });

    it('should return teams not in queue, not on courts, and not in Kings Court queue', () => {
      const availableTeams = getAvailableTeams(mockTeams, mockCourts, mockTeamQueue, mockKingsCourtQueue);
      
      // Team A and B are on courts, Team C is in general queue, Team D is in Kings Court queue
      // So no teams should be available
      expect(availableTeams).toHaveLength(0);
    });

    it('should return all teams when no teams are in queue or on courts', () => {
      const emptyCourts: Court[] = [
        {
          court: 'Challenger Court #1',
          team1: { name: 'No Team', players: ['', '', '', ''] },
          team2: { name: 'No Team', players: ['', '', '', ''] },
          status: 'inactive',
          score: '0-0',
          netColor: 'red'
        },
        {
          court: 'Challenger Court #2',
          team1: { name: 'No Team', players: ['', '', '', ''] },
          team2: { name: 'No Team', players: ['', '', '', ''] },
          status: 'inactive',
          score: '0-0',
          netColor: 'blue'
        },
        {
          court: 'Kings Court',
          team1: { name: 'No Team', players: ['', '', '', ''] },
          team2: { name: 'No Team', players: ['', '', '', ''] },
          status: 'inactive',
          score: '0-0',
          netColor: 'gold'
        }
      ];

      const availableTeams = getAvailableTeams(mockTeams, emptyCourts, [], []);
      
      expect(availableTeams).toHaveLength(4);
      expect(availableTeams.map(t => t.name)).toEqual(['Team A', 'Team B', 'Team C', 'Team D']);
    });

    it('should handle empty teams array', () => {
      const availableTeams = getAvailableTeams([], mockCourts, mockTeamQueue, mockKingsCourtQueue);
      
      expect(availableTeams).toHaveLength(0);
    });

    it('should handle empty queue arrays', () => {
      const availableTeams = getAvailableTeams(mockTeams, mockCourts, [], []);
      
      // Only Team A and B are on courts, so Team C and D should be available
      expect(availableTeams).toHaveLength(2);
      expect(availableTeams.map(t => t.name)).toEqual(['Team C', 'Team D']);
    });
  });

  describe('isTeamInQueue', () => {
    it('should return true when team is in queue', () => {
      const result = isTeamInQueue(mockTeams[2], mockTeamQueue);
      expect(result).toBe(true);
    });

    it('should return false when team is not in queue', () => {
      const result = isTeamInQueue(mockTeams[0], mockTeamQueue);
      expect(result).toBe(false);
    });

    it('should handle empty queue', () => {
      const result = isTeamInQueue(mockTeams[0], []);
      expect(result).toBe(false);
    });

    it('should handle team with same name but different players', () => {
      const teamWithSameName: Team = {
        name: 'Team C',
        players: ['Different Player 1', 'Different Player 2', 'Different Player 3', 'Different Player 4']
      };
      const result = isTeamInQueue(teamWithSameName, mockTeamQueue);
      expect(result).toBe(true); // Should match by name
    });
  });

  describe('isTeamOnCourt', () => {
    it('should return true when team is on a court', () => {
      const result = isTeamOnCourt(mockTeams[0], mockCourts);
      expect(result).toBe(true);
    });

    it('should return false when team is not on any court', () => {
      const result = isTeamOnCourt(mockTeams[2], mockCourts);
      expect(result).toBe(false);
    });

    it('should handle empty courts array', () => {
      const result = isTeamOnCourt(mockTeams[0], []);
      expect(result).toBe(false);
    });

    it('should handle courts with no teams', () => {
      const emptyCourts: Court[] = [
        {
          court: 'Challenger Court #1',
          team1: { name: 'No Team', players: ['', '', '', ''] },
          team2: { name: 'No Team', players: ['', '', '', ''] },
          status: 'inactive',
          score: '0-0',
          netColor: 'red'
        }
      ];
      const result = isTeamOnCourt(mockTeams[0], emptyCourts);
      expect(result).toBe(false);
    });

    it('should match team by name regardless of players', () => {
      const teamWithSameName: Team = {
        name: 'Team A',
        players: ['Different Player 1', 'Different Player 2', 'Different Player 3', 'Different Player 4']
      };
      const result = isTeamOnCourt(teamWithSameName, mockCourts);
      expect(result).toBe(true); // Should match by name
    });
  });
}); 