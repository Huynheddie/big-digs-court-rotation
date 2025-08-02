import { useState } from 'react';
import type { Court, Team, FormData, GameScoreData, GameEvent } from '../types';
import { initialTeams, initialRegisteredTeams, initialQueue } from '../data/initialData';
import { generateRandomString, isTeamOnCourt } from '../utils/dataUtils';

export const useVolleyballState = () => {
  // Core state
  const [teams, setTeams] = useState<Court[]>(initialTeams);
  const [registeredTeams, setRegisteredTeams] = useState<Team[]>(initialRegisteredTeams);
  const [teamQueue, setTeamQueue] = useState<Team[]>(initialQueue);
  const [kingsCourtQueue, setKingsCourtQueue] = useState<Team[]>([]);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const [lastCreatedEventId, setLastCreatedEventId] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportGameModalOpen, setIsReportGameModalOpen] = useState(false);
  const [isAddToQueueModalOpen, setIsAddToQueueModalOpen] = useState(false);
  const [isAddToKingsCourtQueueModalOpen, setIsAddToKingsCourtQueueModalOpen] = useState(false);

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
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [selectedTeamsForKingsCourt, setSelectedTeamsForKingsCourt] = useState<number[]>([]);
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
    kingsCourtQueue: Team[];
  }) => {
    const newEvent: GameEvent = {
      ...event,
      id: generateRandomString('event'),
      timestamp: new Date(),
      stateSnapshot: newState || {
        teams: JSON.parse(JSON.stringify(teams)), // Deep copy
        registeredTeams: JSON.parse(JSON.stringify(registeredTeams)),
        teamQueue: JSON.parse(JSON.stringify(teamQueue)),
        kingsCourtQueue: JSON.parse(JSON.stringify(kingsCourtQueue))
      }
    };
    
    setGameEvents(prev => {
      const newEvents = [newEvent, ...prev];
      return newEvents;
    });
    
    // Return the event ID for immediate use
    return newEvent.id;
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
    setSelectedTeams([]);
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
  const handleSubmit = (e: React.FormEvent): string | null => {
    e.preventDefault();
    
    // Validate that team name is not empty
    if (!formData.teamName.trim()) {
      return null; // Don't proceed if team name is empty
    }
    
    const newTeam: Team = {
      name: formData.teamName,
      players: [formData.player1, formData.player2, formData.player3, formData.player4]
    };
    const newRegisteredTeams = [...registeredTeams, newTeam];
    setRegisteredTeams(newRegisteredTeams);
    
    // Add game event with the new state
    const eventId = addGameEvent({
      type: 'team_added',
      description: `New team "${formData.teamName}" was registered with players: ${formData.player1}, ${formData.player2}, ${formData.player3}, ${formData.player4}`
    }, {
      teams,
      registeredTeams: newRegisteredTeams,
      teamQueue,
      kingsCourtQueue
    });
    
    setFormData({ teamName: '', player1: '', player2: '', player3: '', player4: '' });
    setIsModalOpen(false);
    
    return eventId;
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
    setSelectedTeams([]);
    setSelectedTeamsForKingsCourt([]);
    setEditingTeamIndex(null);
    setReportingCourtIndex(null);
    setDeletingTeamIndex(null);
    setSelectedTeamForDetails(null);
    setNetColorDropdownOpen(null);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsReportGameModalOpen(false);
    setIsAddToQueueModalOpen(false);
    setIsAddToKingsCourtQueueModalOpen(false);
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

  const handleReportGameSubmit = (e: React.FormEvent): string | null => {
    
    e.preventDefault();
    if (reportingCourtIndex !== null) {
      const court = teams[reportingCourtIndex];
      const score = `${gameScoreData.team1Score}-${gameScoreData.team2Score}`;
      
      // Determine winner and loser
      const team1Score = parseInt(gameScoreData.team1Score);
      const team2Score = parseInt(gameScoreData.team2Score);
      const winner = team1Score > team2Score ? court.team1 : court.team2;
      const loser = team1Score > team2Score ? court.team2 : court.team1;
      
      // For challenger courts (index 0 and 1), winner goes to Kings Court queue, loser leaves
      // For Kings Court (index 2), winner stays, loser leaves
      let newKingsCourtQueue = [...kingsCourtQueue];
      
      let newTeams = teams.map((court, index) => {
        if (index === reportingCourtIndex) {
          if (index < 2) {
            // Challenger courts - winner goes to Kings Court queue, clear teams after game
            if (winner.name !== "No Team") {
              newKingsCourtQueue = [...newKingsCourtQueue, winner];
            }
            return {
              ...court,
              score: score,
              team1: { name: "No Team", players: ["", "", "", ""] },
              team2: { name: "No Team", players: ["", "", "", ""] }
            };
          } else {
            // Kings Court - winner stays, loser leaves (unless winner has 2 consecutive wins)
            const winningTeam = winner;
            
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
      setKingsCourtQueue(newKingsCourtQueue);
      
      // Add game event with the new state
      let eventDescription;
      if (reportingCourtIndex < 2) {
        eventDescription = `Game finished on ${court.court}: ${court.team1.name} vs ${court.team2.name} - Final Score: ${score}. WINNER: ${winner.name} advances to Kings Court queue to play. LOSER: ${loser.name} removed from court and must re-queue manually.`;
      } else {
        // Kings Court logic
        const winnerWasTeam1 = court.team1.name === winner.name;
        const currentConsecutiveWins = winnerWasTeam1 
          ? (court.team1ConsecutiveWins || 0) 
          : (court.team2ConsecutiveWins || 0);
        const newConsecutiveWins = currentConsecutiveWins + 1;
        
        if (newConsecutiveWins >= 2) {
          eventDescription = `Game finished on ${court.court}: ${court.team1.name} vs ${court.team2.name} - Final Score: ${score}. WINNER: ${winner.name} wins their second consecutive game and must leave the court to make room for others. LOSER: ${loser.name} removed from court and must re-queue manually.`;
        } else {
          eventDescription = `Game finished on ${court.court}: ${court.team1.name} vs ${court.team2.name} - Final Score: ${score}. WINNER: ${winner.name} stays on the court for another game. LOSER: ${loser.name} removed from court and must re-queue manually.`;
        }
      }
      
      console.log('About to add game event with description:', eventDescription);
      
      const newEventId = addGameEvent({
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
        teamQueue,
        kingsCourtQueue: newKingsCourtQueue
      });
      
      // Store the event ID for the toast to use
      setLastCreatedEventId(newEventId);
      
      setGameScoreData({ team1Score: '', team2Score: '' });
      setReportingCourtIndex(null);
      setIsReportGameModalOpen(false);
      
      return newEventId;
    } else {
      return null;
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

  const handleAddSelectedTeamsToQueue = (): string | null => {
    // Get available teams (not on courts and not in queue)
    const availableTeams = registeredTeams.filter(team => {
      const inQueue = teamQueue.some(queueTeam => queueTeam.name === team.name);
      const onCourt = teams.some(court => 
        court.team1.name === team.name || court.team2.name === team.name
      );
      return !inQueue && !onCourt;
    });
    
    const teamsToAdd = selectedTeams.map(index => availableTeams[index]);
    const newTeamQueue = [...teamQueue, ...teamsToAdd];
    setTeamQueue(newTeamQueue);
    setSelectedTeams([]);
    setIsAddToQueueModalOpen(false);
    
    // Add game event with the new state
    if (teamsToAdd.length > 0) {
      return addGameEvent({
        type: 'teams_queued',
        description: `Teams added to general queue: ${teamsToAdd.map(team => team.name).join(', ')}`,
        teams: teamsToAdd
      }, {
        teams,
        registeredTeams,
        teamQueue: newTeamQueue,
        kingsCourtQueue
      });
    }
    
    return null;
  };

  const handleToggleTeamSelection = (teamIndex: number) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamIndex)) {
        return prev.filter(index => index !== teamIndex);
      } else {
        return [...prev, teamIndex];
      }
    });
  };

  const handleSelectAllTeams = () => {
    // Get available teams using the same logic as getAvailableTeams
    const availableTeams = registeredTeams.filter(team => {
      const inQueue = teamQueue.some(queueTeam => queueTeam.name === team.name);
      const onCourt = teams.some(court => 
        court.team1.name === team.name || court.team2.name === team.name
      );
      return !inQueue && !onCourt;
    });
    
    // Select all available teams by creating an array with all indices from 0 to availableTeams.length - 1
    const allIndices = Array.from({ length: availableTeams.length }, (_, i) => i);
    setSelectedTeams(allIndices);
  };

  const handleRemoveFromQueue = (queueIndex: number) => {
    setTeamQueue(prev => prev.filter((_, index) => index !== queueIndex));
  };

  // Kings Court Queue handlers
  const handleAddToKingsCourtQueue = (teamIndex: number): string | null => {
    const team = registeredTeams[teamIndex];
    setKingsCourtQueue(prev => [...prev, team]);
    
    // Add game event
    return addGameEvent({
      type: 'teams_added',
      description: `Team "${team.name}" added to Kings Court queue`,
      courtNumber: 'Kings Court',
      teams: [team],
      netColor: 'amber'
    }, {
      teams,
      registeredTeams,
      teamQueue,
      kingsCourtQueue: [...kingsCourtQueue, team]
    });
  };

  const handleAddSelectedTeamsToKingsCourtQueue = (): string | null => {
    const selectedTeamsList = selectedTeamsForKingsCourt.map(index => registeredTeams[index]);
    setKingsCourtQueue(prev => [...prev, ...selectedTeamsList]);
    setSelectedTeamsForKingsCourt([]);
    setIsAddToKingsCourtQueueModalOpen(false);
    
    // Add game event
    return addGameEvent({
      type: 'teams_added',
      description: `${selectedTeamsList.length} team(s) added to Kings Court queue: ${selectedTeamsList.map(team => team.name).join(', ')}`,
      courtNumber: 'Kings Court',
      teams: selectedTeamsList,
      netColor: 'amber'
    }, {
      teams,
      registeredTeams,
      teamQueue,
      kingsCourtQueue: [...kingsCourtQueue, ...selectedTeamsList]
    });
  };

  const handleToggleTeamSelectionForKingsCourt = (teamIndex: number) => {
    setSelectedTeamsForKingsCourt(prev => 
      prev.includes(teamIndex) 
        ? prev.filter(index => index !== teamIndex)
        : [...prev, teamIndex]
    );
  };

  const handleSelectAllTeamsForKingsCourt = () => {
    const availableTeamIndices = registeredTeams
      .map((team, index) => ({ team, index }))
      .filter(({ team }) => !isTeamOnCourt(team.name, teams) && !teamQueue.some(qTeam => qTeam.name === team.name) && !kingsCourtQueue.some(kTeam => kTeam.name === team.name))
      .map(({ index }) => index);
    
    setSelectedTeamsForKingsCourt(availableTeamIndices);
  };

  const handleRemoveFromKingsCourtQueue = (queueIndex: number) => {
    const newKingsCourtQueue = kingsCourtQueue.filter((_, index) => index !== queueIndex);
    setKingsCourtQueue(newKingsCourtQueue);
  };

  const handleClearTeams = (courtIndex: number): string | null => {
    const court = teams[courtIndex];
    const newTeams = teams.map((court, index) => 
      index === courtIndex 
        ? { ...court, team1: { name: "No Team", players: ["", "", "", ""] }, team2: { name: "No Team", players: ["", "", "", ""] } }
        : court
    );
    
    setTeams(newTeams);
    
    // Add game event with the new state
    return addGameEvent({
      type: 'court_cleared',
      description: `${court.court} was manually cleared. Previous teams: ${court.team1.name} vs ${court.team2.name}`,
      courtNumber: court.court,
      teams: [court.team1, court.team2],
      netColor: court.netColor
    }, {
      teams: newTeams,
      registeredTeams,
      teamQueue,
      kingsCourtQueue
    });
  };

  const handleFillFromQueue = (courtIndex: number): string | null => {
    const court = teams[courtIndex];
    const isKingsCourt = court.court === "Kings Court";
    
    if (isKingsCourt) {
      // Kings Court logic: fill from Kings Court queue first, then general queue
      const hasTeam1 = court.team1.name !== "No Team";
      const hasTeam2 = court.team2.name !== "No Team";
      
      if (hasTeam1 && hasTeam2) {
        // Both spots filled, can't fill from queue
        return null;
      }
      
      if (!hasTeam1 && !hasTeam2) {
        // Both spots empty - try Kings Court queue first, then general queue
        let firstTeam, secondTeam, newKingsCourtQueue, newTeamQueue;
        
        if (kingsCourtQueue.length >= 2) {
          // Use Kings Court queue
          firstTeam = kingsCourtQueue[0];
          secondTeam = kingsCourtQueue[1];
          newKingsCourtQueue = kingsCourtQueue.slice(2);
          newTeamQueue = teamQueue;
        } else if (kingsCourtQueue.length === 1 && teamQueue.length >= 1) {
          // Use 1 from Kings Court queue + 1 from general queue
          firstTeam = kingsCourtQueue[0];
          secondTeam = teamQueue[0];
          newKingsCourtQueue = kingsCourtQueue.slice(1);
          newTeamQueue = teamQueue.slice(1);
        } else if (teamQueue.length >= 2) {
          // Use general queue only
          firstTeam = teamQueue[0];
          secondTeam = teamQueue[1];
          newKingsCourtQueue = kingsCourtQueue;
          newTeamQueue = teamQueue.slice(2);
        } else {
          // Not enough teams
          return null;
        }
        
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
        setKingsCourtQueue(newKingsCourtQueue);
        setTeamQueue(newTeamQueue);
        
        // Add game event with the new state
        let queueSource = '';
        if (kingsCourtQueue.length >= 2) {
          queueSource = 'Kings Court queue';
        } else if (kingsCourtQueue.length === 1 && teamQueue.length >= 1) {
          queueSource = 'Kings Court queue and general queue';
        } else if (teamQueue.length >= 2) {
          queueSource = 'general queue';
        }
        
        return addGameEvent({
          type: 'teams_added',
          description: `Teams added to ${court.court} from ${queueSource}: ${firstTeam.name} vs ${secondTeam.name}`,
          courtNumber: court.court,
          teams: [firstTeam, secondTeam],
          netColor: court.netColor
        }, {
          teams: newTeams,
          registeredTeams,
          teamQueue: newTeamQueue,
          kingsCourtQueue: newKingsCourtQueue
        });
      } else {
        // One spot empty - try Kings Court queue first, then general queue
        let teamToAdd, newKingsCourtQueue, newTeamQueue;
        
        if (kingsCourtQueue.length >= 1) {
          // Use Kings Court queue
          teamToAdd = kingsCourtQueue[0];
          newKingsCourtQueue = kingsCourtQueue.slice(1);
          newTeamQueue = teamQueue;
        } else if (teamQueue.length >= 1) {
          // Use general queue
          teamToAdd = teamQueue[0];
          newKingsCourtQueue = kingsCourtQueue;
          newTeamQueue = teamQueue.slice(1);
        } else {
          // No teams available
          return null;
        }
        
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
        setKingsCourtQueue(newKingsCourtQueue);
        setTeamQueue(newTeamQueue);
        
        // Add game event with the new state
        const existingTeam = hasTeam1 ? court.team1 : court.team2;
        let queueSource = '';
        if (kingsCourtQueue.length >= 1) {
          queueSource = 'Kings Court queue';
        } else if (teamQueue.length >= 1) {
          queueSource = 'general queue';
        }
        
        return addGameEvent({
          type: 'teams_added',
          description: `${teamToAdd.name} joins ${court.court} from ${queueSource} to play ${existingTeam.name}.`,
          courtNumber: court.court,
          teams: [teamToAdd],
          netColor: court.netColor
        }, {
          teams: newTeams,
          registeredTeams,
          teamQueue: newTeamQueue,
          kingsCourtQueue: newKingsCourtQueue
        });
      }
    } else {
      // Challenger Court logic: fill both spots from main queue only
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
        return addGameEvent({
          type: 'teams_added',
          description: `Teams added to ${court.court} from general queue: ${firstTeam.name} vs ${secondTeam.name}`,
          courtNumber: court.court,
          teams: [firstTeam, secondTeam],
          netColor: court.netColor
        }, {
          teams: newTeams,
          registeredTeams,
          teamQueue: newTeamQueue,
          kingsCourtQueue
        });
      }
    }
    
    return null;
  };

  const handleDeleteTeam = (teamIndex: number): string | null => {
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
    const eventId = addGameEvent({
      type: 'team_deleted',
      description: `Team "${teamToDelete.name}" was deleted from the system`
    }, {
      teams: newTeams,
      registeredTeams: newRegisteredTeams,
      teamQueue: newTeamQueue,
      kingsCourtQueue
    });
    
    setDeletingTeamIndex(null);
    return eventId;
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

  const handleTeamChange = (courtIndex: number, teamPosition: 'team1' | 'team2', team: Team | null): string | null => {
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
    return addGameEvent({
      type: 'teams_added',
      description: `Team "${teamName}" was ${action} from ${court.court} (${teamPosition}) via court details modal`,
      courtNumber: court.court,
      teams: team ? [team] : [],
      netColor: court.netColor
    }, {
      teams: newTeams,
      registeredTeams,
      teamQueue,
      kingsCourtQueue
    });
  };

  return {
    // State
    teams,
    registeredTeams,
    teamQueue,
    kingsCourtQueue,
    gameEvents,
    lastCreatedEventId,
    isModalOpen,
    isEditModalOpen,
    isReportGameModalOpen,
    isAddToQueueModalOpen,
    isAddToKingsCourtQueueModalOpen,
    teamDetailsModalOpen,
    formData,
    gameScoreData,
    selectedTeams,
    selectedTeamsForKingsCourt,
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
    setKingsCourtQueue,
    setGameEvents,
    setLastCreatedEventId,
    setIsModalOpen,
    setIsEditModalOpen,
    setIsReportGameModalOpen,
    setIsAddToQueueModalOpen,
    setIsAddToKingsCourtQueueModalOpen,
    setTeamDetailsModalOpen,
    setFormData,
    setGameScoreData,
    setSelectedTeams,
    setSelectedTeamsForKingsCourt,
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
    handleAddToKingsCourtQueue,
    handleAddSelectedTeamsToKingsCourtQueue,
    handleToggleTeamSelectionForKingsCourt,
    handleSelectAllTeamsForKingsCourt,
    handleRemoveFromKingsCourtQueue,
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