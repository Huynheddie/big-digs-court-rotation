// Core entity types
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

// Game event types
export type GameEventType = 
  | 'court_cleared' 
  | 'teams_added' 
  | 'game_reported' 
  | 'team_deleted' 
  | 'team_added' 
  | 'teams_queued';

export interface GameEvent {
  id: string;
  type: GameEventType;
  description: string;
  courtId?: string;
  courtNumber?: string;
  teamIds?: string[];
  score?: string;
  netColor?: string;
  winnerId?: string;
  loserId?: string;
  timestamp: Date;
  stateSnapshot?: {
    courts: Court[];
    teams: Team[];
    generalQueue: Team[];
    kingsCourtQueue: Team[];
  };
}

// Form data types
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

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Socket.io event types - separate interfaces for client and server
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

// Utility types
export type NetColor = 'red' | 'blue' | 'green' | 'yellow' | 'amber';

// Database types (for future use)
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
} 