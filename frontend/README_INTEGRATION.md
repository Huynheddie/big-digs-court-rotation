# Frontend-Backend Integration Guide

This document explains how the frontend and backend are integrated in the volleyball court system.

## Overview

The frontend and backend are now fully integrated with:
- **REST API** for CRUD operations
- **WebSocket** for real-time updates
- **Type-safe** communication using TypeScript
- **Environment-based** configuration

## Architecture

### Frontend Services

#### 1. API Service (`services/api.ts`)
Handles all HTTP requests to the backend API endpoints:

```typescript
import { teamApi, courtApi, queueApi } from '../services/api';

// Team operations
const teams = await teamApi.getAllTeams();
const newTeam = await teamApi.createTeam(teamData);
const updatedTeam = await teamApi.updateTeam(id, updates);
await teamApi.deleteTeam(id);

// Court operations
const courts = await courtApi.getAllCourts();
const updatedCourt = await courtApi.updateCourt(id, courtData);
await courtApi.clearCourt(id);
await courtApi.fillCourt(id);

// Queue operations
const queue = await queueApi.getQueue('general');
await queueApi.addToQueue(teamId, 'general');
await queueApi.removeFromQueue(teamId, 'general');
```

#### 2. WebSocket Service (`services/websocket.ts`)
Handles real-time communication with the backend:

```typescript
import websocketService from '../services/websocket';

// Emit events
websocketService.emitTeamAdded(teamData);
websocketService.emitCourtUpdate(courtData);
websocketService.emitGameReported(gameData);

// Listen for events
websocketService.onTeamAdded((team) => {
  // Handle new team
});

websocketService.onCourtUpdated((court) => {
  // Handle court update
});
```

#### 3. API Hook (`hooks/useVolleyballApi.ts`)
React hook that combines API and WebSocket functionality:

```typescript
import { useVolleyballApi } from '../hooks/useVolleyballApi';

function MyComponent() {
  const {
    teams,
    courts,
    isLoading,
    error,
    isConnected,
    createTeam,
    updateTeam,
    deleteTeam,
    // ... more operations
  } = useVolleyballApi();

  // Use the data and operations
}
```

### Backend API Endpoints

#### Teams API (`/api/teams`)
- `GET /` - Get all teams
- `POST /` - Create a new team
- `GET /:id` - Get team by ID
- `PUT /:id` - Update team
- `DELETE /:id` - Delete team
- `GET /search?query=name` - Search teams
- `GET /available` - Get available teams

#### Courts API (`/api/courts`)
- `GET /` - Get all courts
- `GET /:id` - Get court by ID
- `PUT /:id` - Update court
- `PUT /:id/assign` - Assign teams to court
- `PUT /:id/clear` - Clear court
- `PUT /:id/fill` - Fill court from queue
- `POST /report-game` - Report game result

#### Queues API (`/api/queues`)
- `GET /` - Get all queues
- `GET /:type` - Get specific queue (general/kings_court)
- `POST /add` - Add team to queue
- `POST /bulk-add` - Bulk add teams to queue
- `DELETE /remove` - Remove team from queue
- `DELETE /:type/clear` - Clear queue

## Configuration

### Environment Configuration (`config/environment.ts`)

The system automatically detects the environment and uses appropriate URLs:

```typescript
// Development
{
  apiBaseUrl: 'http://localhost:3001',
  wsUrl: 'http://localhost:3001',
  isDevelopment: true,
  isProduction: false,
}

// Production (update with your actual URLs)
{
  apiBaseUrl: 'https://your-backend-domain.com',
  wsUrl: 'https://your-backend-domain.com',
  isDevelopment: false,
  isProduction: true,
}
```

## Type Safety

All communication between frontend and backend is type-safe using shared TypeScript interfaces:

```typescript
// Shared types in frontend/types/index.ts
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
```

## Real-time Updates

The system uses WebSocket for real-time updates:

1. **Court Updates**: When a court is modified, all connected clients receive the update
2. **Team Changes**: Team additions, updates, and deletions are broadcast
3. **Queue Changes**: Queue modifications are synchronized across clients
4. **Game Events**: Game reports are shared in real-time
5. **State Sync**: Full state synchronization when clients connect

## Error Handling

The API service includes comprehensive error handling:

```typescript
const response = await teamApi.createTeam(teamData);
if (response.success && response.data) {
  // Success
  setTeams(prev => [...prev, response.data]);
} else {
  // Error
  setError(response.error || 'Failed to create team');
}
```

## Connection Status

The `ConnectionStatus` component shows:
- WebSocket connection status
- API loading state
- Error messages
- Manual health check button

## Usage Examples

### Creating a Team
```typescript
const { createTeam } = useVolleyballApi();

const handleCreateTeam = async (teamData: CreateTeamData) => {
  const newTeam = await createTeam(teamData);
  if (newTeam) {
    // Team created successfully
    showToast('Team created successfully!');
  }
};
```

### Real-time Court Updates
```typescript
const { courts, updateCourt } = useVolleyballApi();

const handleClearCourt = async (courtId: string) => {
  const updatedCourt = await clearCourt(courtId);
  if (updatedCourt) {
    // Court cleared and all clients updated via WebSocket
    showToast('Court cleared!');
  }
};
```

### Queue Management
```typescript
const { addToQueue, removeFromQueue } = useVolleyballApi();

const handleAddToQueue = async (teamId: string) => {
  const success = await addToQueue(teamId, 'general');
  if (success) {
    // Team added to queue and all clients updated
    showToast('Team added to queue!');
  }
};
```

## Development Setup

1. **Start the backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Check connection status**:
   - Look for the connection status widget in the top-left corner
   - Verify WebSocket connection is established
   - Test API endpoints using the health check button

## Production Deployment

1. **Update environment configuration** with your production URLs
2. **Deploy backend** to your hosting service
3. **Deploy frontend** using the existing deployment script:
   ```bash
   npm run deploy
   ```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if backend is running
   - Verify CORS configuration
   - Check firewall settings

2. **API Requests Failing**
   - Verify backend URL in environment config
   - Check network connectivity
   - Review browser console for errors

3. **Type Errors**
   - Ensure frontend and backend types are in sync
   - Run `npm run build` to check for type issues

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and check the browser console for detailed WebSocket and API logs. 