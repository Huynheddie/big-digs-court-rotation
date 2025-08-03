import type { 
  Team, 
  Court, 
  CourtWithTeams, 
  CreateTeamData, 
  UpdateTeamData, 
  ReportGameData, 
  GameEvent, 
  QueueEntryWithTeam 
} from '../types';
import { apiBaseUrl } from '../config/environment';

// API service for communicating with the backend
const API_BASE_URL = apiBaseUrl;

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Team API functions
export const teamApi = {
  // Get all teams
  getAllTeams: () => apiRequest<Team[]>('/api/teams'),
  
  // Create a new team
  createTeam: (teamData: CreateTeamData) => 
    apiRequest<Team>('/api/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    }),
  
  // Get team by ID
  getTeam: (id: string) => apiRequest<Team>(`/api/teams/${id}`),
  
  // Update team
  updateTeam: (id: string, teamData: UpdateTeamData) => 
    apiRequest<Team>(`/api/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    }),
  
  // Delete team
  deleteTeam: (id: string) => 
    apiRequest(`/api/teams/${id}`, {
      method: 'DELETE',
    }),
  
  // Search teams
  searchTeams: (query: string) => 
    apiRequest<Team[]>(`/api/teams/search?query=${encodeURIComponent(query)}`),
  
  // Get available teams
  getAvailableTeams: () => apiRequest<Team[]>('/api/teams/available'),
  
  // Get team statistics
  getTeamStats: (id: string) => apiRequest(`/api/teams/${id}/stats`),
};

// Court API functions
export const courtApi = {
  // Get all courts
  getAllCourts: () => apiRequest<CourtWithTeams[]>('/api/courts'),
  
  // Get court by ID
  getCourt: (id: string) => apiRequest<CourtWithTeams>(`/api/courts/${id}`),
  
  // Update court
  updateCourt: (id: string, courtData: Partial<Court>) => 
    apiRequest<CourtWithTeams>(`/api/courts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courtData),
    }),
  
  // Assign teams to court
  assignTeams: (id: string, team1Id: string, team2Id: string) => 
    apiRequest<CourtWithTeams>(`/api/courts/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ team1Id, team2Id }),
    }),
  
  // Clear court
  clearCourt: (id: string) => 
    apiRequest<CourtWithTeams>(`/api/courts/${id}/clear`, {
      method: 'PUT',
    }),
  
  // Fill court from queue
  fillCourt: (id: string) => 
    apiRequest<CourtWithTeams>(`/api/courts/${id}/fill`, {
      method: 'PUT',
    }),
  
  // Report game result
  reportGame: (gameData: ReportGameData) => 
    apiRequest<GameEvent>('/api/courts/report-game', {
      method: 'POST',
      body: JSON.stringify(gameData),
    }),
};

// Queue API functions
export const queueApi = {
  // Get all queues
  getAllQueues: () => apiRequest('/api/queues'),
  
  // Get queue statistics
  getQueueStats: () => apiRequest('/api/queues/stats'),
  
  // Get available teams for queue
  getAvailableTeams: () => apiRequest<Team[]>('/api/queues/available-teams'),
  
  // Get specific queue
  getQueue: (type: 'general' | 'kings_court') => 
    apiRequest<QueueEntryWithTeam[]>(`/api/queues/${type}`),
  
  // Add team to queue
  addToQueue: (teamId: string, queueType: 'general' | 'kings_court') => 
    apiRequest('/api/queues/add', {
      method: 'POST',
      body: JSON.stringify({ teamId, queueType }),
    }),
  
  // Bulk add teams to queue
  bulkAddToQueue: (teamIds: string[], queueType: 'general' | 'kings_court') => 
    apiRequest('/api/queues/bulk-add', {
      method: 'POST',
      body: JSON.stringify({ teamIds, queueType }),
    }),
  
  // Remove team from queue
  removeFromQueue: (teamId: string, queueType: 'general' | 'kings_court') => 
    apiRequest('/api/queues/remove', {
      method: 'DELETE',
      body: JSON.stringify({ teamId, queueType }),
    }),
  
  // Move team to front of queue
  moveToFront: (id: string) => 
    apiRequest(`/api/queues/${id}/move-to-front`, {
      method: 'PUT',
    }),
  
  // Clear queue
  clearQueue: (type: 'general' | 'kings_court') => 
    apiRequest(`/api/queues/${type}/clear`, {
      method: 'DELETE',
    }),
};

// Health check
export const healthApi = {
  checkHealth: () => apiRequest('/health'),
  getApiDocs: () => apiRequest('/api'),
};

// Export types for use in other files
export type { ApiResponse }; 