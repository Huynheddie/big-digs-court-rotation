import { useState, useEffect, useCallback } from 'react';
import { teamApi, courtApi, queueApi, healthApi } from '../services/api';
import websocketService from '../services/websocket';
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

export const useVolleyballApi = () => {
  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Data state
  const [teams, setTeams] = useState<Team[]>([]);
  const [courts, setCourts] = useState<CourtWithTeams[]>([]);
  const [generalQueue, setGeneralQueue] = useState<QueueEntryWithTeam[]>([]);
  const [kingsCourtQueue, setKingsCourtQueue] = useState<QueueEntryWithTeam[]>([]);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);

  // Initialize WebSocket listeners
  useEffect(() => {
    // Set up WebSocket event listeners
    websocketService.onCourtUpdated((data) => {
      setCourts(prev => prev.map(court => 
        court.id === data.id ? data : court
      ));
    });

    websocketService.onGameReported((data) => {
      setGameEvents(prev => [data, ...prev]);
    });

    websocketService.onTeamAdded((data) => {
      setTeams(prev => [...prev, data]);
    });

    websocketService.onTeamUpdated((data) => {
      setTeams(prev => prev.map(team => 
        team.id === data.id ? data : team
      ));
    });

    websocketService.onTeamDeleted((data) => {
      setTeams(prev => prev.filter(team => team.id !== data.id));
    });

    websocketService.onQueueUpdated((data) => {
      if (data.queueType === 'general') {
        setGeneralQueue(data.queue);
      } else {
        setKingsCourtQueue(data.queue);
      }
    });

    websocketService.onStateSync((data) => {
      setCourts(data.courts);
      setTeams(data.teams);
      setGeneralQueue(data.generalQueue);
      setKingsCourtQueue(data.kingsCourtQueue);
      setGameEvents(data.gameEvents);
    });

    // Check connection status
    const checkConnection = () => {
      setIsConnected(websocketService.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [teamsResponse, courtsResponse, generalQueueResponse, kingsCourtQueueResponse] = await Promise.all([
          teamApi.getAllTeams(),
          courtApi.getAllCourts(),
          queueApi.getQueue('general'),
          queueApi.getQueue('kings_court'),
        ]);

        if (teamsResponse.success && teamsResponse.data) {
          setTeams(teamsResponse.data);
        }

        if (courtsResponse.success && courtsResponse.data) {
          setCourts(courtsResponse.data);
        }

        if (generalQueueResponse.success && generalQueueResponse.data) {
          setGeneralQueue(generalQueueResponse.data);
        }

        if (kingsCourtQueueResponse.success && kingsCourtQueueResponse.data) {
          setKingsCourtQueue(kingsCourtQueueResponse.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load initial data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Team operations
  const createTeam = useCallback(async (teamData: CreateTeamData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await teamApi.createTeam(teamData);
      if (response.success && response.data) {
        setTeams(prev => [...prev, response.data]);
        websocketService.emitTeamAdded(teamData);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create team');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTeam = useCallback(async (id: string, teamData: UpdateTeamData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await teamApi.updateTeam(id, teamData);
      if (response.success && response.data) {
        setTeams(prev => prev.map(team => 
          team.id === id ? response.data : team
        ));
        websocketService.emitTeamUpdated(id, teamData);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update team');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTeam = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await teamApi.deleteTeam(id);
      if (response.success) {
        setTeams(prev => prev.filter(team => team.id !== id));
        websocketService.emitTeamDeleted(id);
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete team');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Court operations
  const updateCourt = useCallback(async (id: string, courtData: Partial<Court>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await courtApi.updateCourt(id, courtData);
      if (response.success && response.data) {
        setCourts(prev => prev.map(court => 
          court.id === id ? response.data : court
        ));
        websocketService.emitCourtUpdate(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update court');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update court');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCourt = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await courtApi.clearCourt(id);
      if (response.success && response.data) {
        setCourts(prev => prev.map(court => 
          court.id === id ? response.data : court
        ));
        websocketService.emitCourtUpdate(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to clear court');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear court');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fillCourt = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await courtApi.fillCourt(id);
      if (response.success && response.data) {
        setCourts(prev => prev.map(court => 
          court.id === id ? response.data : court
        ));
        websocketService.emitCourtUpdate(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fill court');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fill court');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reportGame = useCallback(async (gameData: ReportGameData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await courtApi.reportGame(gameData);
      if (response.success && response.data) {
        setGameEvents(prev => [response.data, ...prev]);
        websocketService.emitGameReported(gameData);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to report game');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to report game');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Queue operations
  const addToQueue = useCallback(async (teamId: string, queueType: 'general' | 'kings_court') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await queueApi.addToQueue(teamId, queueType);
      if (response.success) {
        websocketService.emitQueueUpdated(queueType, teamId, 'add');
        return true;
      } else {
        throw new Error(response.error || 'Failed to add to queue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to queue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromQueue = useCallback(async (teamId: string, queueType: 'general' | 'kings_court') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await queueApi.removeFromQueue(teamId, queueType);
      if (response.success) {
        websocketService.emitQueueUpdated(queueType, teamId, 'remove');
        return true;
      } else {
        throw new Error(response.error || 'Failed to remove from queue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from queue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearQueue = useCallback(async (queueType: 'general' | 'kings_court') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await queueApi.clearQueue(queueType);
      if (response.success) {
        if (queueType === 'general') {
          setGeneralQueue([]);
        } else {
          setKingsCourtQueue([]);
        }
        return true;
      } else {
        throw new Error(response.error || 'Failed to clear queue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear queue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Health check
  const checkHealth = useCallback(async () => {
    try {
      const response = await healthApi.checkHealth();
      return response.success;
    } catch (err) {
      return false;
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    isConnected,
    teams,
    courts,
    generalQueue,
    kingsCourtQueue,
    gameEvents,

    // Team operations
    createTeam,
    updateTeam,
    deleteTeam,

    // Court operations
    updateCourt,
    clearCourt,
    fillCourt,
    reportGame,

    // Queue operations
    addToQueue,
    removeFromQueue,
    clearQueue,

    // Utility
    checkHealth,
    clearError: () => setError(null),
  };
}; 