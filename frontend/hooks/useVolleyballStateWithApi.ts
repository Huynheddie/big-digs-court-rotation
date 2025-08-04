import { useVolleyballState } from './useVolleyballState';
import { useVolleyballApi } from './useVolleyballApi';
import { useToast } from '../components/useToastHook';
import { useCallback, useEffect } from 'react';
import type { CreateTeamData, UpdateTeamData, ReportGameData, Court } from '../types';

export const useVolleyballStateWithApi = () => {
  const existingState = useVolleyballState();
  const apiState = useVolleyballApi();
  const { showToast } = useToast();

  // Sync API state with existing state when API data changes
  useEffect(() => {
    if (apiState.isConnected && apiState.courts.length > 0) {
      // Convert CourtWithTeams to Court format for existing state
      const courtsData: Court[] = apiState.courts.map(courtWithTeams => ({
        id: courtWithTeams.id,
        court: courtWithTeams.name,
        team1: courtWithTeams.team1,
        team2: courtWithTeams.team2,
        status: courtWithTeams.status,
        score: courtWithTeams.score,
        netColor: courtWithTeams.netColor,
        team1ConsecutiveWins: courtWithTeams.team1ConsecutiveWins,
        team2ConsecutiveWins: courtWithTeams.team2ConsecutiveWins,
        createdAt: courtWithTeams.createdAt,
        updatedAt: courtWithTeams.updatedAt,
      }));
      
      // Update existing state with API data
      existingState.setTeams(courtsData);
    }
  }, [apiState.courts, apiState.isConnected, existingState.setTeams, existingState]);

  useEffect(() => {
    if (apiState.isConnected && apiState.teams.length > 0) {
      existingState.setRegisteredTeams(apiState.teams);
    }
  }, [apiState.teams, apiState.isConnected, existingState.setRegisteredTeams, existingState]);

  useEffect(() => {
    if (apiState.isConnected) {
      // Convert QueueEntryWithTeam to Team format for existing state
      const generalQueueData = apiState.generalQueue.map(entry => entry.team);
      const kingsCourtQueueData = apiState.kingsCourtQueue.map(entry => entry.team);
      
      existingState.setTeamQueue(generalQueueData);
      existingState.setKingsCourtQueue(kingsCourtQueueData);
    }
  }, [apiState.generalQueue, apiState.kingsCourtQueue, apiState.isConnected, existingState.setTeamQueue, existingState.setKingsCourtQueue, existingState]);

  useEffect(() => {
    if (apiState.isConnected && apiState.gameEvents.length > 0) {
      existingState.setGameEvents(apiState.gameEvents);
    }
  }, [apiState.gameEvents, apiState.isConnected, existingState.setGameEvents, existingState]);

  // Enhanced handlers that use the API when available, fallback to existing state
  const handleSubmitWithApi = useCallback(async (e: React.FormEvent): Promise<string | null> => {
    e.preventDefault();
    
    // Try API first
    if (apiState.isConnected) {
      try {
        const teamData: CreateTeamData = {
          name: existingState.formData.teamName,
          player1: existingState.formData.player1,
          player2: existingState.formData.player2,
          player3: existingState.formData.player3,
          player4: existingState.formData.player4,
        };
        
        const newTeam = await apiState.createTeam(teamData);
        if (newTeam) {
          showToast({
            type: 'success',
            title: 'Team Created',
            message: `${newTeam.name} has been successfully created!`
          });
          existingState.handleCancel();
          return newTeam.id;
        }
      } catch (error) {
        console.warn('API create team failed, falling back to local state:', error);
      }
    }
    
    // Fallback to existing state management
    return existingState.handleSubmit(e);
  }, [apiState, existingState, showToast]);

  const handleEditSubmitWithApi = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (apiState.isConnected && existingState.editingTeamIndex !== null) {
      try {
        const team = existingState.registeredTeams[existingState.editingTeamIndex];
        const teamData: UpdateTeamData = {
          name: existingState.formData.teamName,
          player1: existingState.formData.player1,
          player2: existingState.formData.player2,
          player3: existingState.formData.player3,
          player4: existingState.formData.player4,
        };
        
        const updatedTeam = await apiState.updateTeam(team.id, teamData);
        if (updatedTeam) {
          showToast({
            type: 'success',
            title: 'Team Updated',
            message: `${updatedTeam.name} has been successfully updated!`
          });
          existingState.handleCancel();
          return;
        }
      } catch (error) {
        console.warn('API update team failed, falling back to local state:', error);
      }
    }
    
    // Fallback to existing state management
    existingState.handleEditSubmit(e);
  }, [apiState, existingState, showToast]);

  const handleDeleteTeamWithApi = useCallback(async (teamIndex: number): Promise<string | null> => {
    if (apiState.isConnected) {
      try {
        const team = existingState.registeredTeams[teamIndex];
        const success = await apiState.deleteTeam(team.id);
        if (success) {
          showToast({
            type: 'success',
            title: 'Team Deleted',
            message: `${team.name} has been successfully deleted!`
          });
          return team.id;
        }
      } catch (error) {
        console.warn('API delete team failed, falling back to local state:', error);
      }
    }
    
    // Fallback to existing state management
    return existingState.handleDeleteTeam(teamIndex);
  }, [apiState, existingState, showToast]);

  const handleReportGameSubmitWithApi = useCallback(async (e: React.FormEvent): Promise<string | null> => {
    e.preventDefault();
    
    if (apiState.isConnected && existingState.reportingCourtIndex !== null) {
      try {
        const court = existingState.teams[existingState.reportingCourtIndex];
        const gameData: ReportGameData = {
          courtId: court.court,
          team1Score: existingState.gameScoreData.team1Score,
          team2Score: existingState.gameScoreData.team2Score,
        };
        
        const gameEvent = await apiState.reportGame(gameData);
        if (gameEvent) {
          showToast({
            type: 'success',
            title: 'Game Reported',
            message: `Game result has been recorded!`
          });
          existingState.handleCancel();
          return gameEvent.id;
        }
      } catch (error) {
        console.warn('API report game failed, falling back to local state:', error);
      }
    }
    
    // Fallback to existing state management
    return existingState.handleReportGameSubmit(e);
  }, [apiState, existingState, showToast]);

  const handleAddToQueueWithApi = useCallback(async (teamIndex: number) => {
    if (apiState.isConnected) {
      try {
        const team = existingState.registeredTeams[teamIndex];
        const success = await apiState.addToQueue(team.id, 'general');
        if (success) {
          showToast({
            type: 'success',
            title: 'Added to Queue',
            message: `${team.name} has been added to the queue!`
          });
          return;
        }
      } catch (error) {
        console.warn('API add to queue failed, falling back to local state:', error);
      }
    }
    
    // Fallback to existing state management
    existingState.handleAddToQueue(teamIndex);
  }, [apiState, existingState, showToast]);

  const handleRemoveFromQueueWithApi = useCallback(async (queueIndex: number) => {
    if (apiState.isConnected && apiState.generalQueue[queueIndex]) {
      try {
        const queueEntry = apiState.generalQueue[queueIndex];
        const success = await apiState.removeFromQueue(queueEntry.teamId, 'general');
        if (success) {
          showToast({
            type: 'success',
            title: 'Removed from Queue',
            message: `${queueEntry.team.name} has been removed from the queue!`
          });
          return;
        }
      } catch (error) {
        console.warn('API remove from queue failed, falling back to local state:', error);
      }
    }
    
    // Fallback to existing state management
    existingState.handleRemoveFromQueue(queueIndex);
  }, [apiState, existingState, showToast]);

  const handleClearCourtWithApi = useCallback(async (courtIndex: number): Promise<string | null> => {
    if (apiState.isConnected && apiState.courts[courtIndex]) {
      try {
        const court = apiState.courts[courtIndex];
        const updatedCourt = await apiState.clearCourt(court.id);
        if (updatedCourt) {
          showToast({
            type: 'success',
            title: 'Court Cleared',
            message: `Court ${court.name} has been cleared!`
          });
          return court.id;
        }
      } catch (error) {
        console.warn('API clear court failed, falling back to local state:', error);
      }
    }
    
    // Fallback to existing state management
    return existingState.handleClearTeams(courtIndex);
  }, [apiState, existingState, showToast]);

  const handleFillCourtWithApi = useCallback(async (courtIndex: number): Promise<string | null> => {
    if (apiState.isConnected && apiState.courts[courtIndex]) {
      try {
        const court = apiState.courts[courtIndex];
        const updatedCourt = await apiState.fillCourt(court.id);
        if (updatedCourt) {
          showToast({
            type: 'success',
            title: 'Court Filled',
            message: `Court ${court.name} has been filled from the queue!`
          });
          return court.id;
        }
      } catch (error) {
        console.warn('API fill court failed, falling back to local state:', error);
      }
    }
    
    // Fallback to existing state management
    return existingState.handleFillFromQueue(courtIndex);
  }, [apiState, existingState, showToast]);

  return {
    // Existing state
    ...existingState,
    
    // API state
    apiState,
    
    // Enhanced handlers with API integration
    handleSubmitWithApi,
    handleEditSubmitWithApi,
    handleDeleteTeamWithApi,
    handleReportGameSubmitWithApi,
    handleAddToQueueWithApi,
    handleRemoveFromQueueWithApi,
    handleClearCourtWithApi,
    handleFillCourtWithApi,
    
    // Connection status
    isConnected: apiState.isConnected,
    isLoading: apiState.isLoading,
    error: apiState.error,
  };
}; 