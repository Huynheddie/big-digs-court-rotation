// Type definitions for the volleyball court system
export interface Player {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  players: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Court {
  id: string;
  name: string;
  team1Id: string | null;
  team2Id: string | null;
  status: 'empty' | 'playing' | 'waiting';
  score: string;
  netColor: string;
  team1ConsecutiveWins: number;
  team2ConsecutiveWins: number;
  createdAt: Date;
  updatedAt: Date;
}

// Extended court with team objects
export interface CourtWithTeams extends Omit<Court, 'team1Id' | 'team2Id'> {
  team1: Team | null;
  team2: Team | null;
}

// Queue types
export interface QueueEntry {
  id: string;
  teamId: string;
  queueType: 'general' | 'kings_court';
  position: number;
  createdAt: Date;
}

export interface QueueEntryWithTeam extends QueueEntry {
  team: Team;
}

// Form data types
export interface FormData {
  teamName: string;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
}

export interface CreateTeamData {
  name: string;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
}

export interface UpdateTeamData {
  name?: string;
  player1?: string;
  player2?: string;
  player3?: string;
  player4?: string;
}

export interface GameScoreData {
  team1Score: string;
  team2Score: string;
}

export interface ReportGameData {
  courtId: string;
  team1Score: string;
  team2Score: string;
}

export interface GameEvent {
  id: string;
  timestamp: Date;
  type: 'court_cleared' | 'teams_added' | 'game_reported' | 'team_deleted' | 'team_added' | 'teams_queued' | 'team_edited';
  description: string;
  courtNumber?: string;
  teams?: Team[];
  score?: string;
  netColor?: string;
  winner?: Team;
  loser?: Team;
  stateSnapshot?: {
    teams: Court[];
    registeredTeams: Team[];
    teamQueue: Team[];
    kingsCourtQueue: Team[];
  };
}

// WebSocket event types
export interface ClientToServerEvents {
  'court-updated': (data: Partial<Court>) => void;
  'game-reported': (data: ReportGameData) => void;
  'team-added': (data: CreateTeamData) => void;
  'team-updated': (data: { id: string; updates: UpdateTeamData }) => void;
  'team-deleted': (data: { id: string }) => void;
  'queue-updated': (data: { queueType: 'general' | 'kings_court'; teamId: string; action: 'add' | 'remove' }) => void;
}

export interface ServerToClientEvents {
  'court-updated': (data: CourtWithTeams) => void;
  'game-reported': (data: GameEvent) => void;
  'team-added': (data: Team) => void;
  'team-updated': (data: Team) => void;
  'team-deleted': (data: { id: string }) => void;
  'queue-updated': (data: { queueType: 'general' | 'kings_court'; queue: QueueEntryWithTeam[] }) => void;
  'state-sync': (data: {
    courts: CourtWithTeams[];
    teams: Team[];
    generalQueue: QueueEntryWithTeam[];
    kingsCourtQueue: QueueEntryWithTeam[];
    gameEvents: GameEvent[];
  }) => void;
}

export type NetColor = 'red' | 'blue' | 'green' | 'yellow' | 'amber'; 