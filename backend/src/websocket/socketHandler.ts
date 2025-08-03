import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { 
  ClientToServerEvents, 
  ServerToClientEvents, 
  CourtWithTeams, 
  GameEvent, 
  Team, 
  QueueEntryWithTeam,
  ReportGameData,
  CreateTeamData,
  UpdateTeamData
} from '../types';

export class SocketHandler {
  private io: SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle client events
      socket.on('court-updated', (data) => {
        console.log('Court updated:', data);
        // Broadcast to all clients except sender
        socket.broadcast.emit('court-updated', data as CourtWithTeams);
      });

      socket.on('game-reported', (data: ReportGameData) => {
        console.log('Game reported:', data);
        // Broadcast to all clients except sender
        socket.broadcast.emit('game-reported', {
          id: Date.now().toString(),
          type: 'game_reported',
          description: `Game reported on court ${data.courtId}`,
          courtId: data.courtId,
          score: `${data.team1Score}-${data.team2Score}`,
          timestamp: new Date()
        } as GameEvent);
      });

      socket.on('team-added', (data: CreateTeamData) => {
        console.log('Team added:', data);
        // Broadcast to all clients except sender
        socket.broadcast.emit('team-added', {
          id: Date.now().toString(),
          name: data.name,
          players: [data.player1, data.player2, data.player3, data.player4],
          createdAt: new Date(),
          updatedAt: new Date()
        } as Team);
      });

      socket.on('team-updated', (data: { id: string; updates: UpdateTeamData }) => {
        console.log('Team updated:', data);
        // Broadcast to all clients except sender
        socket.broadcast.emit('team-updated', {
          id: data.id,
          name: data.updates.name || '',
          players: [data.updates.player1, data.updates.player2, data.updates.player3, data.updates.player4].filter(Boolean) as string[],
          createdAt: new Date(),
          updatedAt: new Date()
        } as Team);
      });

      socket.on('team-deleted', (data: { id: string }) => {
        console.log('Team deleted:', data);
        // Broadcast to all clients except sender
        socket.broadcast.emit('team-deleted', data);
      });

      socket.on('queue-updated', (data: { queueType: 'general' | 'kings_court'; teamId: string; action: 'add' | 'remove' }) => {
        console.log('Queue updated:', data);
        // Broadcast to all clients except sender
        socket.broadcast.emit('queue-updated', {
          queueType: data.queueType,
          queue: [] // This would be populated with actual queue data
        });
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });
  }

  // Public methods for broadcasting events from other parts of the application
  public broadcastCourtUpdate(court: CourtWithTeams): void {
    this.io.emit('court-updated', court);
  }

  public broadcastGameReported(event: GameEvent): void {
    this.io.emit('game-reported', event);
  }

  public broadcastTeamAdded(team: Team): void {
    this.io.emit('team-added', team);
  }

  public broadcastTeamUpdated(team: Team): void {
    this.io.emit('team-updated', team);
  }

  public broadcastTeamDeleted(teamId: string): void {
    this.io.emit('team-deleted', { id: teamId });
  }

  public broadcastQueueUpdate(queueType: 'general' | 'kings_court', queue: QueueEntryWithTeam[]): void {
    this.io.emit('queue-updated', { queueType, queue });
  }

  public broadcastStateSync(data: {
    courts: CourtWithTeams[];
    teams: Team[];
    generalQueue: QueueEntryWithTeam[];
    kingsCourtQueue: QueueEntryWithTeam[];
    gameEvents: GameEvent[];
  }): void {
    this.io.emit('state-sync', data);
  }

  public getConnectedClientsCount(): number {
    return this.io.engine.clientsCount;
  }
} 