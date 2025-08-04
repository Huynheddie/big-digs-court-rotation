import { v4 as uuidv4 } from 'uuid';
import type { 
  Team, 
  Court, 
  CourtWithTeams, 
  QueueEntry, 
  QueueEntryWithTeam, 
  GameEvent,
  CreateTeamData,
  UpdateTeamData
} from '../types';

// In-memory data storage
class DataStore {
  private teams: Map<string, Team> = new Map();
  private courts: Map<string, Court> = new Map();
  private generalQueue: Map<string, QueueEntry> = new Map();
  private kingsCourtQueue: Map<string, QueueEntry> = new Map();
  private gameEvents: GameEvent[] = [];

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default courts
    const defaultCourts: Court[] = [
      {
        id: uuidv4(),
        name: 'Court 1',
        team1Id: null,
        team2Id: null,
        status: 'empty',
        score: '',
        netColor: 'red',
        team1ConsecutiveWins: 0,
        team2ConsecutiveWins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Court 2',
        team1Id: null,
        team2Id: null,
        status: 'empty',
        score: '',
        netColor: 'blue',
        team1ConsecutiveWins: 0,
        team2ConsecutiveWins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Kings Court',
        team1Id: null,
        team2Id: null,
        status: 'empty',
        score: '',
        netColor: 'amber',
        team1ConsecutiveWins: 0,
        team2ConsecutiveWins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    defaultCourts.forEach(court => {
      this.courts.set(court.id, court);
    });

    // Initialize some default teams
    const defaultTeams: CreateTeamData[] = [
      {
        name: 'Team Alpha',
        player1: 'Alice Johnson',
        player2: 'Bob Smith',
        player3: 'Carol Davis',
        player4: 'David Wilson',
      },
      {
        name: 'Team Beta',
        player1: 'Eve Brown',
        player2: 'Frank Miller',
        player3: 'Grace Lee',
        player4: 'Henry Taylor',
      },
      {
        name: 'Team Gamma',
        player1: 'Ivy Chen',
        player2: 'Jack Anderson',
        player3: 'Kate Martinez',
        player4: 'Liam Rodriguez',
      },
    ];

    defaultTeams.forEach(teamData => {
      this.createTeam(teamData);
    });
  }

  // Team operations
  createTeam(teamData: CreateTeamData): Team {
    const team: Team = {
      id: uuidv4(),
      name: teamData.name,
      players: [
        teamData.player1 || '',
        teamData.player2 || '',
        teamData.player3 || '',
        teamData.player4 || '',
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.teams.set(team.id, team);
    return team;
  }

  getTeam(id: string): Team | null {
    return this.teams.get(id) || null;
  }

  getAllTeams(): Team[] {
    return Array.from(this.teams.values());
  }

  updateTeam(id: string, updates: UpdateTeamData): Team | null {
    const team = this.teams.get(id);
    if (!team) return null;

    const updatedTeam: Team = {
      ...team,
      name: updates.name ?? team.name,
      players: [
        updates.player1 ?? team.players[0] ?? '',
        updates.player2 ?? team.players[1] ?? '',
        updates.player3 ?? team.players[2] ?? '',
        updates.player4 ?? team.players[3] ?? '',
      ],
      updatedAt: new Date(),
    };

    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  deleteTeam(id: string): boolean {
    // Remove team from all courts
    this.courts.forEach(court => {
      if (court.team1Id === id) {
        this.updateCourt(court.id, { team1Id: null });
      }
      if (court.team2Id === id) {
        this.updateCourt(court.id, { team2Id: null });
      }
    });

    // Remove team from all queues
    this.removeTeamFromAllQueues(id);

    return this.teams.delete(id);
  }

  // Court operations
  getCourt(id: string): Court | null {
    return this.courts.get(id) || null;
  }

  getAllCourts(): Court[] {
    return Array.from(this.courts.values());
  }

  getCourtWithTeams(id: string): CourtWithTeams | null {
    const court = this.courts.get(id);
    if (!court) return null;

    return {
      ...court,
      team1: court.team1Id ? this.teams.get(court.team1Id) || null : null,
      team2: court.team2Id ? this.teams.get(court.team2Id) || null : null,
    };
  }

  getAllCourtsWithTeams(): CourtWithTeams[] {
    return Array.from(this.courts.values()).map(court => ({
      ...court,
      team1: court.team1Id ? this.teams.get(court.team1Id) || null : null,
      team2: court.team2Id ? this.teams.get(court.team2Id) || null : null,
    }));
  }

  updateCourt(id: string, updates: Partial<Court>): Court | null {
    const court = this.courts.get(id);
    if (!court) return null;

    const updatedCourt: Court = {
      ...court,
      ...updates,
      updatedAt: new Date(),
    };

    this.courts.set(id, updatedCourt);
    return updatedCourt;
  }

  assignTeamsToCourt(courtId: string, team1Id: string, team2Id: string): Court | null {
    const court = this.courts.get(courtId);
    if (!court) return null;

    // Verify teams exist
    if (!this.teams.has(team1Id) || !this.teams.has(team2Id)) {
      return null;
    }

    // Remove teams from queues
    this.removeTeamFromAllQueues(team1Id);
    this.removeTeamFromAllQueues(team2Id);

    const updatedCourt: Court = {
      ...court,
      team1Id,
      team2Id,
      status: 'playing',
      score: '',
      team1ConsecutiveWins: 0,
      team2ConsecutiveWins: 0,
      updatedAt: new Date(),
    };

    this.courts.set(courtId, updatedCourt);
    return updatedCourt;
  }

  clearCourt(courtId: string): Court | null {
    const court = this.courts.get(courtId);
    if (!court) return null;

    const updatedCourt: Court = {
      ...court,
      team1Id: null,
      team2Id: null,
      status: 'empty',
      score: '',
      team1ConsecutiveWins: 0,
      team2ConsecutiveWins: 0,
      updatedAt: new Date(),
    };

    this.courts.set(courtId, updatedCourt);
    return updatedCourt;
  }

  // Queue operations
  addToQueue(teamId: string, queueType: 'general' | 'kings_court'): QueueEntry | null {
    if (!this.teams.has(teamId)) return null;

    // Check if team is already in any queue
    if (this.isTeamInAnyQueue(teamId)) return null;

    const queue = queueType === 'general' ? this.generalQueue : this.kingsCourtQueue;
    const position = queue.size + 1;

    const queueEntry: QueueEntry = {
      id: uuidv4(),
      teamId,
      queueType,
      position,
      createdAt: new Date(),
    };

    queue.set(queueEntry.id, queueEntry);
    return queueEntry;
  }

  removeFromQueue(queueEntryId: string): boolean {
    if (this.generalQueue.has(queueEntryId)) {
      return this.generalQueue.delete(queueEntryId);
    }
    if (this.kingsCourtQueue.has(queueEntryId)) {
      return this.kingsCourtQueue.delete(queueEntryId);
    }
    return false;
  }

  getQueue(queueType: 'general' | 'kings_court'): QueueEntryWithTeam[] {
    const queue = queueType === 'general' ? this.generalQueue : this.kingsCourtQueue;
    return Array.from(queue.values())
      .map(entry => ({
        ...entry,
        team: this.teams.get(entry.teamId)!,
      }))
      .sort((a, b) => a.position - b.position);
  }

  getAllQueues(): { general: QueueEntryWithTeam[]; kingsCourt: QueueEntryWithTeam[] } {
    return {
      general: this.getQueue('general'),
      kingsCourt: this.getQueue('kings_court'),
    };
  }

  private isTeamInAnyQueue(teamId: string): boolean {
    return Array.from(this.generalQueue.values()).some(entry => entry.teamId === teamId) ||
           Array.from(this.kingsCourtQueue.values()).some(entry => entry.teamId === teamId);
  }

  private removeTeamFromAllQueues(teamId: string): void {
    // Remove from general queue
    for (const [id, entry] of this.generalQueue.entries()) {
      if (entry.teamId === teamId) {
        this.generalQueue.delete(id);
      }
    }

    // Remove from kings court queue
    for (const [id, entry] of this.kingsCourtQueue.entries()) {
      if (entry.teamId === teamId) {
        this.kingsCourtQueue.delete(id);
      }
    }

    // Reorder positions
    this.reorderQueue('general');
    this.reorderQueue('kings_court');
  }

  private reorderQueue(queueType: 'general' | 'kings_court'): void {
    const queue = queueType === 'general' ? this.generalQueue : this.kingsCourtQueue;
    const entries = Array.from(queue.values()).sort((a, b) => a.position - b.position);
    
    entries.forEach((entry, index) => {
      const updatedEntry = { ...entry, position: index + 1 };
      queue.set(entry.id, updatedEntry);
    });
  }

  // Game event operations
  addGameEvent(event: Omit<GameEvent, 'id' | 'timestamp'>): GameEvent {
    const gameEvent: GameEvent = {
      ...event,
      id: uuidv4(),
      timestamp: new Date(),
    };

    this.gameEvents.unshift(gameEvent); // Add to beginning for newest first

    // Keep only last 1000 events to prevent memory issues
    if (this.gameEvents.length > 1000) {
      this.gameEvents = this.gameEvents.slice(0, 1000);
    }

    return gameEvent;
  }

  getGameEvents(limit: number = 50): GameEvent[] {
    return this.gameEvents.slice(0, limit);
  }

  // State snapshot for real-time sync
  getStateSnapshot() {
    return {
      courts: this.getAllCourtsWithTeams(),
      teams: this.getAllTeams(),
      generalQueue: this.getQueue('general'),
      kingsCourtQueue: this.getQueue('kings_court'),
      gameEvents: this.getGameEvents(100),
    };
  }

  // Utility methods
  getTeamByName(name: string): Team | null {
    return Array.from(this.teams.values()).find(team => team.name === name) || null;
  }

  isTeamOnCourt(teamId: string): boolean {
    return Array.from(this.courts.values()).some(
      court => court.team1Id === teamId || court.team2Id === teamId
    );
  }

  getAvailableTeams(): Team[] {
    return Array.from(this.teams.values()).filter(team => {
      const onCourt = this.isTeamOnCourt(team.id);
      const inQueue = this.isTeamInAnyQueue(team.id);
      return !onCourt && !inQueue;
    });
  }
}

// Export singleton instance
export const dataStore = new DataStore(); 