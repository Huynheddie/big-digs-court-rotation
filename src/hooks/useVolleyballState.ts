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
  const [teamDetailsModalOpen, setTeamDetailsModalOpen] = useState(false);
  const [selectedTeamForDetails, setSelectedTeamForDetails] = useState<number | null>(null);
  const [courtDetailsModalOpen, setCourtDetailsModalOpen] = useState(false);
  const [selectedCourtForDetails, setSelectedCourtForDetails] = useState<number | null>(null);

  // Helper function to add game events
  const addGameEvent = (event: Omit<GameEvent, 'id' | 'timestamp'>, newState?: {
    teams: Court[];
    registeredTeams: Team[];
    teamQueue: Team[];
  }) => {
    const newEvent: GameEvent = {
      ...event,
      id: generateRandomString('event'),
      timestamp: new Date(),
      stateSnapshot: newState || {
        teams: JSON.parse(JSON.stringify(teams)), // Deep copy
        registeredTeams: JSON.parse(JSON.stringify(registeredTeams)),
        teamQueue: JSON.parse(JSON.stringify(teamQueue))
      }
    };
    setGameEvents(prev => [newEvent, ...prev]); // Add to beginning for newest first
  };

  // Function to reset state to a specific event
  const resetToEvent = (eventId: string) => {
    const eventIndex = gameEvents.findIndex(event => event.id === eventId);
    if (eventIndex === -1) return;

    const targetEvent = gameEvents[eventIndex];
    if (!targetEvent.stateSnapshot) return;

    // Reset all state to the snapshot
    setTeams(targetEvent.stateSnapshot.teams);
    setRegisteredTeams(targetEvent.stateSnapshot.registeredTeams);
    setTeamQueue(targetEvent.stateSnapshot.teamQueue);

    // Remove all events after the target event
    setGameEvents(prev => prev.slice(eventIndex));

    // Reset all modal and form states
    setFormData({ teamName: '', player1: '', player2: '', player3: '', player4: '' });
    setGameScoreData({ team1Score: '', team2Score: '' });
    setSelectedTeams(new Set());
    setEditingTeamIndex(null);
    setReportingCourtIndex(null);
    setDeletingTeamIndex(null);
    setSelectedTeamForDetails(null);
    setNetColorDropdownOpen(null);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsReportGameModalOpen(false);
    setIsAddToQueueModalOpen(false);
    setTeamDetailsModalOpen(false);
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
    const newRegisteredTeams = [...registeredTeams, newTeam];
    setRegisteredTeams(newRegisteredTeams);
    
    // Add game event with the new state
    addGameEvent({
      type: 'team_added',
      description: `New team "${formData.teamName}" was registered with ${formData.player1}, ${formData.player2}, ${formData.player3}, ${formData.player4}`
    }, {
      teams,
      registeredTeams: newRegisteredTeams,
      teamQueue
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
    setSelectedTeamForDetails(null);
    setNetColorDropdownOpen(null);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsReportGameModalOpen(false);
    setIsAddToQueueModalOpen(false);
    setTeamDetailsModalOpen(false);
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
      
      // Determine winner and loser
      const team1Score = parseInt(gameScoreData.team1Score);
      const team2Score = parseInt(gameScoreData.team2Score);
      const winner = team1Score > team2Score ? court.team1 : court.team2;
      const loser = team1Score > team2Score ? court.team2 : court.team1;
      
      // For challenger courts (index 0 and 1), clear the teams after the game
      // For Kings Court (index 2), winner stays, loser leaves
      let newTeams = teams.map((court, index) => {
        if (index === reportingCourtIndex) {
          if (index < 2) {
            // Challenger courts - clear teams after game
            return {
              ...court,
              score: score,
              team1: { name: "No Team", players: ["", "", "", ""] },
              team2: { name: "No Team", players: ["", "", "", ""] }
            };
          } else {
            // Kings Court - winner stays, loser leaves (unless winner has 2 consecutive wins)
            const winningTeam = winner;
            const losingTeam = loser;
            
            // Determine which team position the winner was in
            const winnerWasTeam1 = court.team1.name === winningTeam.name;
            const currentConsecutiveWins = winnerWasTeam1 
              ? (court.team1ConsecutiveWins || 0) 
              : (court.team2ConsecutiveWins || 0);
            const newConsecutiveWins = currentConsecutiveWins + 1;
            
            // If winner has 2 consecutive wins, they must leave to make room for others
            if (newConsecutiveWins >= 2) {
              return {
                ...court,
                score: score,
                team1: { name: "No Team", players: ["", "", "", ""] },
                team2: { name: "No Team", players: ["", "", "", ""] },
                team1ConsecutiveWins: 0,
                team2ConsecutiveWins: 0
              };
            }
            
            // Winner stays, loser leaves, update consecutive wins
            return {
              ...court,
              score: score,
              team1: winnerWasTeam1 ? winningTeam : { name: "No Team", players: ["", "", "", ""] },
              team2: winnerWasTeam1 ? { name: "No Team", players: ["", "", "", ""] } : winningTeam,
              team1ConsecutiveWins: winnerWasTeam1 ? newConsecutiveWins : 0,
              team2ConsecutiveWins: winnerWasTeam1 ? 0 : newConsecutiveWins
            };
          }
        }
        return court;
      });
      
      setTeams(newTeams);
      
      // Add game event with the new state
      let eventDescription;
      if (reportingCourtIndex < 2) {
        eventDescription = `Game finished on ${court.court}: ${court.team1.name} vs ${court.team2.name} - Final Score: ${score}`;
      } else {
        // Kings Court logic
        const winnerWasTeam1 = court.team1.name === winner.name;
        const currentConsecutiveWins = winnerWasTeam1 
          ? (court.team1ConsecutiveWins || 0) 
          : (court.team2ConsecutiveWins || 0);
        const newConsecutiveWins = currentConsecutiveWins + 1;
        
        if (newConsecutiveWins >= 2) {
          eventDescription = `${winner.name} wins their second consecutive game and must leave the court to make room for others.`;
        } else {
          eventDescription = `${winner.name} stays on the court, ${loser.name} leaves.`;
        }
      }
      
      addGameEvent({
        type: 'game_reported',
        description: eventDescription,
        courtNumber: court.court,
        teams: [court.team1, court.team2],
        score: score,
        netColor: court.netColor,
        winner: winner,
        loser: loser
      }, {
        teams: newTeams,
        registeredTeams,
        teamQueue
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
    const teamsToAdd = Array.from(selectedTeams).map(index => registeredTeams[index]);
    const newTeamQueue = [...teamQueue, ...teamsToAdd];
    setTeamQueue(newTeamQueue);
    setSelectedTeams(new Set());
    setIsAddToQueueModalOpen(false);
    
    // Add game event with the new state
    if (teamsToAdd.length > 0) {
      addGameEvent({
        type: 'teams_queued',
        description: `Teams added to queue: ${teamsToAdd.map(team => team.name).join(', ')}`,
        teams: teamsToAdd
      }, {
        teams,
        registeredTeams,
        teamQueue: newTeamQueue
      });
    }
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

  const handleSelectAllTeams = () => {
    // Get available teams (not on courts and not in queue)
    const availableTeams = registeredTeams.filter(team => {
      const inQueue = teamQueue.some(queueTeam => queueTeam.name === team.name);
      const onCourt = teams.some(court => 
        court.team1.name === team.name || court.team2.name === team.name
      );
      return !inQueue && !onCourt;
    });
    
    // Create indices for the available teams (0, 1, 2, etc.)
    const availableTeamIndices = availableTeams.map((_, index) => index);
    
    setSelectedTeams(new Set(availableTeamIndices));
  };

  const handleRemoveFromQueue = (queueIndex: number) => {
    setTeamQueue(prev => prev.filter((_, index) => index !== queueIndex));
  };

  const handleClearTeams = (courtIndex: number) => {
    const court = teams[courtIndex];
    const newTeams = teams.map((court, index) => 
      index === courtIndex 
        ? { ...court, team1: { name: "No Team", players: ["", "", "", ""] }, team2: { name: "No Team", players: ["", "", "", ""] } }
        : court
    );
    
    setTeams(newTeams);
    
    // Add game event with the new state
    addGameEvent({
      type: 'court_cleared',
      description: `${court.court} was cleared. Previous teams: ${court.team1.name} vs ${court.team2.name}`,
      courtNumber: court.court,
      teams: [court.team1, court.team2],
      netColor: court.netColor
    }, {
      teams: newTeams,
      registeredTeams,
      teamQueue
    });
  };

  const handleFillFromQueue = (courtIndex: number) => {
    const court = teams[courtIndex];
    const isKingsCourt = court.court === "Kings Court";
    
    if (isKingsCourt) {
      // Kings Court logic: fill only empty spots
      const hasTeam1 = court.team1.name !== "No Team";
      const hasTeam2 = court.team2.name !== "No Team";
      
      if (hasTeam1 && hasTeam2) {
        // Both spots filled, can't fill from queue
        return;
      }
      
      if (!hasTeam1 && !hasTeam2) {
        // Both spots empty - fill both spots with different teams from queue
        if (teamQueue.length >= 2) {
          const firstTeam = teamQueue[0];
          const secondTeam = teamQueue[1];
          const newTeamQueue = teamQueue.slice(2);
          
          const newTeams = teams.map((court, index) => 
            index === courtIndex 
              ? { 
                  ...court, 
                  team1: firstTeam,
                  team2: secondTeam
                }
              : court
          );
          
          setTeams(newTeams);
          setTeamQueue(newTeamQueue);
          
          // Add game event with the new state
          addGameEvent({
            type: 'teams_added',
            description: `Teams added to ${court.court}: ${firstTeam.name} vs ${secondTeam.name}`,
            courtNumber: court.court,
            teams: [firstTeam, secondTeam],
            netColor: court.netColor
          }, {
            teams: newTeams,
            registeredTeams,
            teamQueue: newTeamQueue
          });
        }
        return;
      }
      
      if (teamQueue.length >= 1) {
        const teamToAdd = teamQueue[0];
        const newTeamQueue = teamQueue.slice(1);
        
        const newTeams = teams.map((court, index) => 
          index === courtIndex 
            ? { 
                ...court, 
                team1: hasTeam1 ? court.team1 : teamToAdd,
                team2: hasTeam2 ? court.team2 : teamToAdd
              }
            : court
        );
        
        setTeams(newTeams);
        setTeamQueue(newTeamQueue);
        
        // Add game event with the new state
        const existingTeam = hasTeam1 ? court.team1 : court.team2;
        addGameEvent({
          type: 'teams_added',
          description: `${teamToAdd.name} joins ${court.court} to play ${existingTeam.name}.`,
          courtNumber: court.court,
          teams: [teamToAdd],
          netColor: court.netColor
        }, {
          teams: newTeams,
          registeredTeams,
          teamQueue: newTeamQueue
        });
      }
    } else {
      // Challenger Court logic: fill both spots
      if (teamQueue.length >= 2) {
        const firstTeam = teamQueue[0];
        const secondTeam = teamQueue[1];
        
        const newTeams = teams.map((court, index) => 
          index === courtIndex 
            ? { ...court, team1: firstTeam, team2: secondTeam }
            : court
        );
        
        const newTeamQueue = teamQueue.slice(2);
        
        setTeams(newTeams);
        setTeamQueue(newTeamQueue);
        
        // Add game event with the new state
        addGameEvent({
          type: 'teams_added',
          description: `Teams added to ${court.court}: ${firstTeam.name} vs ${secondTeam.name}`,
          courtNumber: court.court,
          teams: [firstTeam, secondTeam],
          netColor: court.netColor
        }, {
          teams: newTeams,
          registeredTeams,
          teamQueue: newTeamQueue
        });
      }
    }
  };

  const handleDeleteTeam = (teamIndex: number) => {
    const teamToDelete = registeredTeams[teamIndex];
    
    const newRegisteredTeams = registeredTeams.filter((_, index) => index !== teamIndex);
    const newTeamQueue = teamQueue.filter(team => team.name !== teamToDelete.name);
    const newTeams = teams.map(court => ({
      ...court,
      team1: court.team1.name === teamToDelete.name 
        ? { name: "No Team", players: ["", "", "", ""] } 
        : court.team1,
      team2: court.team2.name === teamToDelete.name 
        ? { name: "No Team", players: ["", "", "", ""] } 
        : court.team2
    }));
    
    setRegisteredTeams(newRegisteredTeams);
    setTeamQueue(newTeamQueue);
    setTeams(newTeams);
    
    // Add game event with the new state
    addGameEvent({
      type: 'team_deleted',
      description: `Team "${teamToDelete.name}" was deleted from the system`
    }, {
      teams: newTeams,
      registeredTeams: newRegisteredTeams,
      teamQueue: newTeamQueue
    });
    
    setDeletingTeamIndex(null);
  };

  // Team details modal handlers
  const handleOpenTeamDetails = (teamIndex: number) => {
    setSelectedTeamForDetails(teamIndex);
    setTeamDetailsModalOpen(true);
  };

  const handleCloseTeamDetails = () => {
    setTeamDetailsModalOpen(false);
    setSelectedTeamForDetails(null);
  };

  const handleEditTeamFromDetails = (teamIndex: number) => {
    handleCloseTeamDetails();
    handleEditTeam(teamIndex);
  };

  const handleDeleteTeamFromDetails = (teamIndex: number) => {
    handleCloseTeamDetails();
    setDeletingTeamIndex(teamIndex);
  };

  // Court details modal handlers
  const handleOpenCourtDetails = (courtIndex: number) => {
    setSelectedCourtForDetails(courtIndex);
    setCourtDetailsModalOpen(true);
  };

  const handleCloseCourtDetails = () => {
    setCourtDetailsModalOpen(false);
    setSelectedCourtForDetails(null);
  };

  const handleTeamChange = (courtIndex: number, teamPosition: 'team1' | 'team2', team: Team | null) => {
    const court = teams[courtIndex];
    const newTeam = team || { name: "No Team", players: ["", "", "", ""] };
    
    const newTeams = teams.map((court, index) => 
      index === courtIndex 
        ? { 
            ...court, 
            [teamPosition]: newTeam
          }
        : court
    );
    
    setTeams(newTeams);
    
    // Add game event with the new state
    const action = team ? 'added' : 'removed';
    const teamName = team ? team.name : (teamPosition === 'team1' ? court.team1.name : court.team2.name);
    addGameEvent({
      type: 'teams_added',
      description: `Team "${teamName}" was ${action} from ${court.court} (${teamPosition})`,
      courtNumber: court.court,
      teams: team ? [team] : [],
      netColor: court.netColor
    }, {
      teams: newTeams,
      registeredTeams,
      teamQueue
    });
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
    teamDetailsModalOpen,
    formData,
    gameScoreData,
    selectedTeams,
    editingTeamIndex,
    reportingCourtIndex,
    deletingTeamIndex,
    selectedTeamForDetails,
    netColorDropdownOpen,
    courtDetailsModalOpen,
    selectedCourtForDetails,

    // Setters
    setTeams,
    setRegisteredTeams,
    setTeamQueue,
    setGameEvents,
    setIsModalOpen,
    setIsEditModalOpen,
    setIsReportGameModalOpen,
    setIsAddToQueueModalOpen,
    setTeamDetailsModalOpen,
    setFormData,
    setGameScoreData,
    setSelectedTeams,
    setEditingTeamIndex,
    setReportingCourtIndex,
    setDeletingTeamIndex,
    setSelectedTeamForDetails,
    setNetColorDropdownOpen,
    setCourtDetailsModalOpen,
    setSelectedCourtForDetails,

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
    handleSelectAllTeams,
    handleRemoveFromQueue,
    handleClearTeams,
    handleFillFromQueue,
    handleDeleteTeam,
    handleOpenTeamDetails,
    handleCloseTeamDetails,
    handleEditTeamFromDetails,
    handleDeleteTeamFromDetails,
    handleOpenCourtDetails,
    handleCloseCourtDetails,
    handleTeamChange,
    resetToEvent
  };
}; 