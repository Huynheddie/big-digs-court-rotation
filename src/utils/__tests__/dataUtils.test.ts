import { describe, it, expect } from 'vitest'
import { getAvailableTeams, isTeamOnCourt } from '../dataUtils'
import type { Team, Court } from '../../types'

describe('dataUtils', () => {
  const mockTeams: Team[] = [
    { name: 'Team A', players: ['Alice', 'Bob', 'Charlie', 'David'] },
    { name: 'Team B', players: ['Eve', 'Frank', 'Grace', 'Henry'] },
    { name: 'Team C', players: ['Ivy', 'Jack', 'Kate', 'Liam'] }
  ]

  const mockCourts: Court[] = [
    {
      court: 'Court 1',
      team1: { name: 'Team A', players: ['Alice', 'Bob', 'Charlie', 'David'] },
      team2: { name: 'No Team', players: ['', '', '', ''] },
      netColor: 'blue'
    },
    {
      court: 'Court 2',
      team1: { name: 'No Team', players: ['', '', '', ''] },
      team2: { name: 'No Team', players: ['', '', '', ''] },
      netColor: 'red'
    }
  ]

  const mockQueue: Team[] = [
    { name: 'Team B', players: ['Eve', 'Frank', 'Grace', 'Henry'] }
  ]

  describe('getAvailableTeams', () => {
    it('should return teams not on courts and not in queue', () => {
      const availableTeams = getAvailableTeams(mockTeams, mockQueue, mockCourts)
      
      expect(availableTeams).toHaveLength(1)
      expect(availableTeams[0].name).toBe('Team C')
    })

    it('should return all teams when none are on courts or in queue', () => {
      const emptyCourts: Court[] = [
        {
          court: 'Court 1',
          team1: { name: 'No Team', players: ['', '', '', ''] },
          team2: { name: 'No Team', players: ['', '', '', ''] },
          netColor: 'blue'
        }
      ]
      
      const availableTeams = getAvailableTeams(mockTeams, [], emptyCourts)
      
      expect(availableTeams).toHaveLength(3)
      expect(availableTeams.map(t => t.name)).toEqual(['Team A', 'Team B', 'Team C'])
    })

    it('should return empty array when all teams are on courts or in queue', () => {
      const fullCourts: Court[] = [
        {
          court: 'Court 1',
          team1: { name: 'Team A', players: ['Alice', 'Bob', 'Charlie', 'David'] },
          team2: { name: 'Team B', players: ['Eve', 'Frank', 'Grace', 'Henry'] },
          netColor: 'blue'
        }
      ]
      
      const availableTeams = getAvailableTeams(mockTeams, [mockTeams[2]], fullCourts)
      
      expect(availableTeams).toHaveLength(0)
    })
  })

  describe('isTeamOnCourt', () => {
    it('should return true when team is on a court', () => {
      const isOnCourt = isTeamOnCourt('Team A', mockCourts)
      expect(isOnCourt).toBe(true)
    })

    it('should return false when team is not on any court', () => {
      const isOnCourt = isTeamOnCourt('Team C', mockCourts)
      expect(isOnCourt).toBe(false)
    })

    it('should return true when team is on either team1 or team2 position', () => {
      const courtsWithTeamInBothPositions: Court[] = [
        {
          court: 'Court 1',
          team1: { name: 'Team A', players: ['Alice', 'Bob', 'Charlie', 'David'] },
          team2: { name: 'Team B', players: ['Eve', 'Frank', 'Grace', 'Henry'] },
          netColor: 'blue'
        }
      ]
      
      expect(isTeamOnCourt('Team A', courtsWithTeamInBothPositions)).toBe(true)
      expect(isTeamOnCourt('Team B', courtsWithTeamInBothPositions)).toBe(true)
    })

    it('should handle case insensitive team names', () => {
      const isOnCourt = isTeamOnCourt('team a', mockCourts)
      expect(isOnCourt).toBe(false) // Should be case sensitive
    })
  })
}) 