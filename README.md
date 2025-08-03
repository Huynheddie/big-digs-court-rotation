# Volleyball Court System

A real-time volleyball court management system with a React frontend and Node.js backend.

## Project Structure

```
volleyball-court-system/
├── frontend/          # React + TypeScript frontend
├── backend/           # Node.js + Express + TypeScript backend
├── package.json       # Root package.json for managing both services
└── README.md          # This file
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   # Backend environment
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Start both frontend and backend in development mode:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

### Individual Services

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

## Available Scripts

### Root Level (Monorepo)
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend
- `npm run test` - Run tests for both frontend and backend
- `npm run lint` - Run linting for both frontend and backend
- `npm run deploy` - Deploy frontend to GitHub Pages

### Frontend
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run test:frontend` - Run frontend tests
- `npm run lint:frontend` - Run frontend linting

### Backend
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run test:backend` - Run backend tests
- `npm run lint:backend` - Run backend linting

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **Socket.IO Client** for real-time updates
- **Framer Motion** for animations
- **Zustand** for state management

### Backend
- **Node.js** with TypeScript
- **Express.js** for API server
- **Socket.IO** for real-time communication
- **Zod** for validation
- **In-memory data store** (easily replaceable with database)

## Features

- **Real-time court management** with live updates
- **Team registration and management**
- **Queue system** for both general and Kings Court
- **Game reporting** with automatic queue management
- **Responsive design** for mobile and desktop
- **Type-safe** throughout the stack

## API Documentation

The backend API is documented at `http://localhost:3001/api` when running.

### Key Endpoints

- **Teams**: `/api/teams` - CRUD operations for teams
- **Courts**: `/api/courts` - Court management and game reporting
- **Queues**: `/api/queues` - Queue management for both court types

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Testing
```bash
# Run all tests
npm run test

# Run specific service tests
npm run test:frontend
npm run test:backend
```

### Linting
```bash
# Run all linting
npm run lint

# Run specific service linting
npm run lint:frontend
npm run lint:backend
```

## Deployment

### Frontend (GitHub Pages)
```bash
npm run deploy
```

### Backend
```bash
cd backend
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details
