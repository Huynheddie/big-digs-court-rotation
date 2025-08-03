import { io, Socket } from 'socket.io-client';
import type { 
  ClientToServerEvents, 
  ServerToClientEvents,
  CourtWithTeams,
  GameEvent,
  Team,
  QueueEntryWithTeam,
  CreateTeamData,
  UpdateTeamData,
  ReportGameData
} from '../types';
import { wsUrl } from '../config/environment';

class WebSocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor() {
    this.connect();
  }

  private connect() {
    const socketUrl = wsUrl;

    try {
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnection();
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to WebSocket server after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed after', this.maxReconnectAttempts, 'attempts');
    });
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Exponential backoff, max 30s
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect();
      }, this.reconnectDelay);
    }
  }

  // Public methods for emitting events
  public emitCourtUpdate(courtData: Partial<CourtWithTeams>) {
    if (this.socket?.connected) {
      this.socket.emit('court-updated', courtData);
    }
  }

  public emitGameReported(gameData: ReportGameData) {
    if (this.socket?.connected) {
      this.socket.emit('game-reported', gameData);
    }
  }

  public emitTeamAdded(teamData: CreateTeamData) {
    if (this.socket?.connected) {
      this.socket.emit('team-added', teamData);
    }
  }

  public emitTeamUpdated(id: string, updates: UpdateTeamData) {
    if (this.socket?.connected) {
      this.socket.emit('team-updated', { id, updates });
    }
  }

  public emitTeamDeleted(id: string) {
    if (this.socket?.connected) {
      this.socket.emit('team-deleted', { id });
    }
  }

  public emitQueueUpdated(queueType: 'general' | 'kings_court', teamId: string, action: 'add' | 'remove') {
    if (this.socket?.connected) {
      this.socket.emit('queue-updated', { queueType, teamId, action });
    }
  }

  // Public methods for listening to events
  public onCourtUpdated(callback: (data: CourtWithTeams) => void) {
    this.socket?.on('court-updated', callback);
  }

  public onGameReported(callback: (data: GameEvent) => void) {
    this.socket?.on('game-reported', callback);
  }

  public onTeamAdded(callback: (data: Team) => void) {
    this.socket?.on('team-added', callback);
  }

  public onTeamUpdated(callback: (data: Team) => void) {
    this.socket?.on('team-updated', callback);
  }

  public onTeamDeleted(callback: (data: { id: string }) => void) {
    this.socket?.on('team-deleted', callback);
  }

  public onQueueUpdated(callback: (data: { queueType: 'general' | 'kings_court'; queue: QueueEntryWithTeam[] }) => void) {
    this.socket?.on('queue-updated', callback);
  }

  public onStateSync(callback: (data: {
    courts: CourtWithTeams[];
    teams: Team[];
    generalQueue: QueueEntryWithTeam[];
    kingsCourtQueue: QueueEntryWithTeam[];
    gameEvents: GameEvent[];
  }) => void) {
    this.socket?.on('state-sync', callback);
  }

  // Utility methods
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public reconnect() {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;
    this.connect();
  }
}

// Create and export a singleton instance
export const websocketService = new WebSocketService();
export default websocketService; 