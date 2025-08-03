import { createServer } from 'http';
import app from './app';
import { SocketHandler } from './websocket/socketHandler';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO handler
const socketHandler = new SocketHandler(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Volleyball Court System Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`⚡ WebSocket: ws://localhost:${PORT}`);
  console.log('---');
  console.log('Available endpoints:');
  console.log('  Teams:     /api/teams');
  console.log('  Courts:    /api/courts');
  console.log('  Queues:    /api/queues');
  console.log('---');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export { socketHandler }; 