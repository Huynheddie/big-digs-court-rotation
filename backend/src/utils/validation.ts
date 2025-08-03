import { z } from 'zod';
import type { ValidationResult, ValidationError } from '@/types';

// Team validation schemas
export const createTeamSchema = z.object({
  name: z.string()
    .min(1, 'Team name is required')
    .max(50, 'Team name must be 50 characters or less')
    .trim(),
  player1: z.string().max(50, 'Player name must be 50 characters or less').optional(),
  player2: z.string().max(50, 'Player name must be 50 characters or less').optional(),
  player3: z.string().max(50, 'Player name must be 50 characters or less').optional(),
  player4: z.string().max(50, 'Player name must be 50 characters or less').optional(),
});

export const updateTeamSchema = z.object({
  name: z.string()
    .min(1, 'Team name is required')
    .max(50, 'Team name must be 50 characters or less')
    .trim()
    .optional(),
  player1: z.string().max(50, 'Player name must be 50 characters or less').optional(),
  player2: z.string().max(50, 'Player name must be 50 characters or less').optional(),
  player3: z.string().max(50, 'Player name must be 50 characters or less').optional(),
  player4: z.string().max(50, 'Player name must be 50 characters or less').optional(),
});

// Court validation schemas
export const updateCourtSchema = z.object({
  team1Id: z.string().uuid().nullable().optional(),
  team2Id: z.string().uuid().nullable().optional(),
  status: z.enum(['empty', 'playing', 'waiting']).optional(),
  score: z.string().max(20, 'Score must be 20 characters or less').optional(),
  netColor: z.enum(['red', 'blue', 'green', 'yellow', 'amber']).optional(),
  team1ConsecutiveWins: z.number().min(0).max(10).optional(),
  team2ConsecutiveWins: z.number().min(0).max(10).optional(),
});

export const assignTeamsToCourtSchema = z.object({
  team1Id: z.string().uuid('Invalid team 1 ID'),
  team2Id: z.string().uuid('Invalid team 2 ID'),
});

// Game validation schemas
export const reportGameSchema = z.object({
  courtId: z.string().uuid('Invalid court ID'),
  team1Score: z.string()
    .regex(/^\d+$/, 'Team 1 score must be a number')
    .refine(val => parseInt(val) >= 0 && parseInt(val) <= 50, 'Score must be between 0 and 50'),
  team2Score: z.string()
    .regex(/^\d+$/, 'Team 2 score must be a number')
    .refine(val => parseInt(val) >= 0 && parseInt(val) <= 50, 'Score must be between 0 and 50'),
}).refine(data => {
  const score1 = parseInt(data.team1Score);
  const score2 = parseInt(data.team2Score);
  return score1 !== score2;
}, {
  message: 'Game cannot end in a tie',
  path: ['team1Score'],
});

// Queue validation schemas
export const addToQueueSchema = z.object({
  teamId: z.string().uuid('Invalid team ID'),
  queueType: z.enum(['general', 'kings_court'], {
    errorMap: () => ({ message: 'Queue type must be either "general" or "kings_court"' })
  }),
});

export const removeFromQueueSchema = z.object({
  queueEntryId: z.string().uuid('Invalid queue entry ID'),
});

// Pagination validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(20),
});

// UUID validation schema
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Search validation schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  type: z.enum(['teams', 'courts', 'events']).optional(),
});

// Validation helper functions
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult {
  try {
    schema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { isValid: false, errors };
    }
    return { 
      isValid: false, 
      errors: [{ field: 'unknown', message: 'Validation failed' }] 
    };
  }
}

export function validatePartialData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult {
  try {
    // For partial validation, we'll just try to parse the data as-is
    // This will work for optional fields
    schema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { isValid: false, errors };
    }
    return { 
      isValid: false, 
      errors: [{ field: 'unknown', message: 'Validation failed' }] 
    };
  }
}

// Type exports for use in controllers
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type UpdateCourtInput = z.infer<typeof updateCourtSchema>;
export type AssignTeamsInput = z.infer<typeof assignTeamsToCourtSchema>;
export type ReportGameInput = z.infer<typeof reportGameSchema>;
export type AddToQueueInput = z.infer<typeof addToQueueSchema>;
export type RemoveFromQueueInput = z.infer<typeof removeFromQueueSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>; 