import { useState } from 'react';
import type { Court, Team, FormData, GameScoreData, GameEvent } from '../types';
import { initialTeams, initialRegisteredTeams, initialQueue } from '../data/initialData';
import { generateRandomString } from '../utils/dataUtils';

export const useVolleyballState = () => {
  // Core state
  const [teams, setTeams] = useState<Court[]>(initialTeams);
  const [registeredTeams, setRegisteredTeams] = useState<Team[]>(initialRegisteredTeams);
  const [teamQueue, setTeamQueue] = useState<Team[]>(initialQueue);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportGameModalOpen, setIsReportGameModalOpen] = useState(false);
  const [isAddToQueueModalOpen, setIsAddToQueueModalOpen] = useState(false);

  // Form data
  const [formData, setFormData] = useState<FormData>({ 
    teamName: '', 
    player1: '', 
    player2: '', 
    player3: '', 
    player4: '' 
  });
  const [gameScoreData, setGameScoreData] = useState<GameScoreData>({ 
    team1Score: '', 
    team2Score: '' 
  });

  // Selection states
  const [selectedTeams, setSelectedTeams] = useState<Set<number>>(new Set());
  const [editingTeamIndex, setEditingTeamIndex] = useState<number | null>(null);
  const [reportingCourtIndex, setReportingCourtIndex] = useState<number | null>(null);
  const [deletingTeamIndex, setDeletingTeamIndex] = useState<number | null>(null);
  const [netColorDropdownOpen, setNetColorDropdownOpen] = useState<number | null>(null);

  // Helper function to add game events
  const addGameEvent = (event: Omit<GameEvent, 'id' | 'timestamp'>) => {
    const newEvent: GameEvent = {
      ...event,
      id: generateRandomString('event'),
      timestamp: new Date()
    };
    setGameEvents(prev => [newEvent, ...prev]); // Add to beginning for newest first
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScoreInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameScoreData(prev => ({ ...prev, [name]: value }));
  };

  // Team management handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeam: Team = {
      name: formData.teamName,
      players: [formData.player1, formData.player2, formData.player3, formData.player4]
    };
    setRegisteredTeams(prev => [...prev, newTeam]);
    
    // Add game event
    addGameEvent({
      type: 'team_added',
      description: `New team "${formData.teamName}" was registered with ${formData.player1}, ${formData.player2}, ${formData.player3}, ${formData.player4}`
    });
    
    setFormData({ teamName: '', player1: '', player2: '', player3: '', player4: '' });
    setIsModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeamIndex !== null) {
      const updatedTeam: Team = {
        name: formData.teamName,
        players: [formData.player1, formData.player2, formData.player3, formData.player4]
      };
      setRegisteredTeams(prev => prev.map((team, index) => 
        index === editingTeamIndex ? updatedTeam : team
      ));
      setFormData({ teamName: '', player1: '', player2: '', player3: '', player4: '' });
      setEditingTeamIndex(null);
      setIsEditModalOpen(false);
    }
  };

  const handleCancel = () => {
    setFormData({ teamName: '', player1: '', player2: '', player3: '', player4: '' });
    setGameScoreData({ team1Score: '', team2Score: '' });
    setSelectedTeams(new Set());
    setEditingTeamIndex(null);
    setReportingCourtIndex(null);
    setDeletingTeamIndex(null);
    setNetColorDropdownOpen(null);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsReportGameModalOpen(false);
    setIsAddToQueueModalOpen(false);
  };

  const handleEditTeam = (teamIndex: number) => {
    const team = registeredTeams[teamIndex];
    setFormData({
      teamName: team.name,
      player1: team.players[0] || '',
      player2: team.players[1] || '',
      player3: team.players[2] || '',
      player4: team.players[3] || ''
    });
    setEditingTeamIndex(teamIndex);
    setIsEditModalOpen(true);
  };

  const handleReportGame = (courtIndex: number) => {
    setReportingCourtIndex(courtIndex);
    setIsReportGameModalOpen(true);
  };

  const handleReportGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportingCourtIndex !== null) {
      const court = teams[reportingCourtIndex];
      const score = `${gameScoreData.team1Score}-${gameScoreData.team2Score}`;
      
      setTeams(prev => prev.map((court, index) => 
        index === reportingCourtIndex 
          ? { ...court, score: score }
          : court
      ));
      
      // Add game event
      addGameEvent({
        type: 'game_reported',
        description: `Game finished on ${court.court}: ${court.team1.name} vs ${court.team2.name} - Final Score: ${score}`,
        courtNumber: court.court,
        teams: [court.team1, court.team2],
        score: score,
        netColor: court.netColor
      });
      
      setGameScoreData({ team1Score: '', team2Score: '' });
      setReportingCourtIndex(null);
      setIsReportGameModalOpen(false);
    }
  };

  const handleNetColorChange = (courtIndex: number, newColor: string) => {
    setTeams(prev => prev.map((court, index) => 
      index === courtIndex ? { ...court, netColor: newColor } : court
    ));
    setNetColorDropdownOpen(null);
  };

  const handleOpenModal = () => {
    setFormData({
      teamName: generateRandomString('Team'),
      player1: generateRandomString('Player1'),
      player2: generateRandomString('Player2'),
      player3: generateRandomString('Player3'),
      player4: generateRandomString('Player4')
    });
    setIsModalOpen(true);
  };

  const handleAddToQueue = (teamIndex: number) => {
    const team = registeredTeams[teamIndex];
    setTeamQueue(prev => [...prev, team]);
  };

  const handleAddSelectedTeamsToQueue = () => {
    const selectedTeamsArray = Array.from(selectedTeams);
    const teamsToAdd = selectedTeamsArray.map(index => registeredTeams[index]);
    setTeamQueue(prev => [...prev, ...teamsToAdd]);
    
    // Add game event for teams being queued
    if (teamsToAdd.length > 0) {
      addGameEvent({
        type: 'teams_queued',
        description: `Teams added to queue: ${teamsToAdd.map(team => team.name).join(', ')}`,
        teams: teamsToAdd
      });
    }
    
    setSelectedTeams(new Set());
    setIsAddToQueueModalOpen(false);
  };

  const handleToggleTeamSelection = (teamIndex: number) => {
    setSelectedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamIndex)) {
        newSet.delete(teamIndex);
      } else {
        newSet.add(teamIndex);
      }
      return newSet;
    });
  };

  const handleRemoveFromQueue = (queueIndex: number) => {
    setTeamQueue(prev => prev.filter((_, index) => index !== queueIndex));
  };

  const handleClearTeams = (courtIndex: number) => {
    const court = teams[courtIndex];
    setTeams(prev => prev.map((court, index) => 
      index === courtIndex 
        ? { ...court, team1: { name: "No Team", players: ["", "", "", ""] }, team2: { name: "No Team", players: ["", "", "", ""] } }
        : court
    ));
    
    // Add game event
    addGameEvent({
      type: 'court_cleared',
      description: `${court.court} was cleared. Previous teams: ${court.team1.name} vs ${court.team2.name}`,
      courtNumber: court.court,
      teams: [court.team1, court.team2],
      netColor: court.netColor
    });
  };

  const handleFillFromQueue = (courtIndex: number) => {
    if (teamQueue.length >= 2) {
      const firstTeam = teamQueue[0];
      const secondTeam = teamQueue[1];
      const court = teams[courtIndex];
      
      setTeams(prev => prev.map((court, index) => 
        index === courtIndex 
          ? { ...court, team1: firstTeam, team2: secondTeam }
          : court
      ));
      
      setTeamQueue(prev => prev.slice(2));
      
      // Add game event
      addGameEvent({
        type: 'teams_added',
        description: `Teams added to ${court.court}: ${firstTeam.name} vs ${secondTeam.name}`,
        courtNumber: court.court,
        teams: [firstTeam, secondTeam],
        netColor: court.netColor
      });
    }
  };

  const handleDeleteTeam = (teamIndex: number) => {
    const teamToDelete = registeredTeams[teamIndex];
    
    setRegisteredTeams(prev => prev.filter((_, index) => index !== teamIndex));
    setTeamQueue(prev => prev.filter(team => team.name !== teamToDelete.name));
    setTeams(prev => prev.map(court => ({
      ...court,
      team1: court.team1.name === teamToDelete.name 
        ? { name: "No Team", players: ["", "", "", ""] } 
        : court.team1,
      team2: court.team2.name === teamToDelete.name 
        ? { name: "No Team", players: ["", "", "", ""] } 
        : court.team2
    })));
    
    // Add game event
    addGameEvent({
      type: 'team_deleted',
      description: `Team "${teamToDelete.name}" was deleted from the system`
    });
    
    setDeletingTeamIndex(null);
  };

  return {
    // State
    teams,
    registeredTeams,
    teamQueue,
    gameEvents,
    isModalOpen,
    isEditModalOpen,
    isReportGameModalOpen,
    isAddToQueueModalOpen,
    formData,
    gameScoreData,
    selectedTeams,
    editingTeamIndex,
    reportingCourtIndex,
    deletingTeamIndex,
    netColorDropdownOpen,

    // Setters
    setTeams,
    setRegisteredTeams,
    setTeamQueue,
    setGameEvents,
    setIsModalOpen,
    setIsEditModalOpen,
    setIsReportGameModalOpen,
    setIsAddToQueueModalOpen,
    setFormData,
    setGameScoreData,
    setSelectedTeams,
    setEditingTeamIndex,
    setReportingCourtIndex,
    setDeletingTeamIndex,
    setNetColorDropdownOpen,

    // Handlers
    handleInputChange,
    handleScoreInputChange,
    handleSubmit,
    handleEditSubmit,
    handleCancel,
    handleEditTeam,
    handleReportGame,
    handleReportGameSubmit,
    handleNetColorChange,
    handleOpenModal,
    handleAddToQueue,
    handleAddSelectedTeamsToQueue,
    handleToggleTeamSelection,
    handleRemoveFromQueue,
    handleClearTeams,
    handleFillFromQueue,
    handleDeleteTeam
  };
}; 