import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import teamRoutes from './routes/teamRoutes';
import courtRoutes from './routes/courtRoutes';
import queueRoutes from './routes/queueRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Volleyball Court System API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/teams', teamRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/queues', queueRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Volleyball Court System API',
    version: '1.0.0',
    endpoints: {
      teams: {
        base: '/api/teams',
        operations: [
          'POST / - Create a new team',
          'GET / - Get all teams',
          'GET /search?query=name - Search teams',
          'GET /available - Get available teams',
          'GET /:id - Get team by ID',
          'PUT /:id - Update team',
          'DELETE /:id - Delete team',
          'GET /:id/stats - Get team statistics'
        ]
      },
      courts: {
        base: '/api/courts',
        operations: [
          'GET / - Get all courts',
          'GET /:id - Get court by ID',
          'PUT /:id - Update court',
          'PUT /:id/assign - Assign teams to court',
          'PUT /:id/clear - Clear court',
          'PUT /:id/fill - Fill court from queue',
          'POST /report-game - Report game result'
        ]
      },
      queues: {
        base: '/api/queues',
        operations: [
          'GET / - Get all queues',
          'GET /stats - Get queue statistics',
          'GET /available-teams - Get teams available for queue',
          'GET /:type - Get specific queue (general/kings_court)',
          'POST /add - Add team to queue',
          'POST /bulk-add - Bulk add teams to queue',
          'DELETE /remove - Remove team from queue',
          'PUT /:id/move-to-front - Move team to front of queue',
          'DELETE /:type/clear - Clear queue'
        ]
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.message
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  // Handle other known errors
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
  }

  // Default error response
  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

export default app; 