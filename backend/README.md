# Volleyball Court System Backend

A robust Node.js + Express backend API for managing volleyball court systems with real-time updates via WebSocket.

## Features

- **RESTful API** for teams, courts, and queues
- **Real-time updates** via Socket.IO
- **TypeScript** for type safety
- **Input validation** with Zod
- **Rate limiting** and security middleware
- **Comprehensive error handling**
- **In-memory data store** (easily replaceable with database)

## Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Socket.IO** for real-time communication
- **Zod** for validation
- **Helmet** for security
- **CORS** for cross-origin requests
- **Morgan** for logging
- **Rate limiting** for API protection

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/teams` | Create a new team |
| `GET` | `/api/teams` | Get all teams |
| `GET` | `/api/teams/search?query=name` | Search teams |
| `GET` | `/api/teams/available` | Get available teams |
| `GET` | `/api/teams/:id` | Get team by ID |
| `PUT` | `/api/teams/:id` | Update team |
| `DELETE` | `/api/teams/:id` | Delete team |
| `GET` | `/api/teams/:id/stats` | Get team statistics |

### Courts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/courts` | Get all courts |
| `GET` | `/api/courts/:id` | Get court by ID |
| `PUT` | `/api/courts/:id` | Update court |
| `PUT` | `/api/courts/:id/assign` | Assign teams to court |
| `PUT` | `/api/courts/:id/clear` | Clear court |
| `PUT` | `/api/courts/:id/fill` | Fill court from queue |
| `POST` | `/api/courts/report-game` | Report game result |

### Queues

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/queues` | Get all queues |
| `GET` | `/api/queues/stats` | Get queue statistics |
| `GET` | `/api/queues/available-teams` | Get teams available for queue |
| `GET` | `/api/queues/:type` | Get specific queue |
| `POST` | `/api/queues/add` | Add team to queue |
| `POST` | `/api/queues/bulk-add` | Bulk add teams to queue |
| `DELETE` | `/api/queues/remove` | Remove team from queue |
| `PUT` | `/api/queues/:id/move-to-front` | Move team to front of queue |
| `DELETE` | `/api/queues/:type/clear` | Clear queue |

## WebSocket Events

### Client to Server

- `court-updated` - Update court data
- `game-reported` - Report game result
- `team-added` - Add new team
- `team-updated` - Update team data
- `team-deleted` - Delete team
- `queue-updated` - Update queue

### Server to Client

- `court-updated` - Court data updated
- `game-reported` - Game result reported
- `team-added` - Team added
- `team-updated` - Team updated
- `team-deleted` - Team deleted
- `queue-updated` - Queue updated
- `state-sync` - Full state synchronization

## Usage Examples

### Create a Team

```bash
curl -X POST http://localhost:3001/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Alpha",
    "player1": "Alice Johnson",
    "player2": "Bob Smith",
    "player3": "Carol Davis",
    "player4": "David Wilson"
  }'
```

### Assign Teams to Court

```bash
curl -X PUT http://localhost:3001/api/courts/{courtId}/assign \
  -H "Content-Type: application/json" \
  -d '{
    "team1Id": "team-uuid-1",
    "team2Id": "team-uuid-2"
  }'
```

### Report Game Result

```bash
curl -X POST http://localhost:3001/api/courts/report-game \
  -H "Content-Type: application/json" \
  -d '{
    "courtId": "court-uuid",
    "team1Score": "21",
    "team2Score": "19"
  }'
```

### Add Team to Queue

```bash
curl -X POST http://localhost:3001/api/queues/add \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": "team-uuid",
    "queueType": "general"
  }'
```

## WebSocket Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Listen for updates
socket.on('court-updated', (data) => {
  console.log('Court updated:', data);
});

socket.on('game-reported', (data) => {
  console.log('Game reported:', data);
});

// Send updates
socket.emit('court-updated', courtData);
socket.emit('game-reported', gameData);
```

## Data Models

### Team
```typescript
interface Team {
  id: string;
  name: string;
  players: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Court
```typescript
interface Court {
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

### Queue Entry
```typescript
interface QueueEntry {
  id: string;
  teamId: string;
  queueType: 'general' | 'kings_court';
  position: number;
  createdAt: Date;
}
```

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
src/
├── controllers/     # Route handlers
├── services/        # Business logic
├── routes/          # API routes
├── types/           # TypeScript types
├── utils/           # Utility functions
├── websocket/       # Socket.IO handlers
├── app.ts           # Express app setup
└── index.ts         # Server entry point
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `CORS_ORIGIN` | `http://localhost:5173` | CORS origin |
| `JWT_SECRET` | - | JWT secret key |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Rate limit max requests |

## Security Features

- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting** to prevent abuse
- **Input validation** with Zod
- **Error handling** without exposing internals
- **Request size limits**

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure `CORS_ORIGIN` for your frontend domain
3. Set a strong `JWT_SECRET`
4. Configure rate limiting as needed

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

MIT License - see LICENSE file for details 