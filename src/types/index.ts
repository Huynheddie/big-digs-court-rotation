// Type definitions for the volleyball court system
export interface Player {
  name: string;
}

export interface Team {
  name: string;
  players: string[];
}

export interface Court {
  court: string;
  team1: Team;
  team2: Team;
  status: string;
  score: string;
  netColor: string;
}

export interface FormData {
  teamName: string;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
}

export interface GameScoreData {
  team1Score: string;
  team2Score: string;
}

export type NetColor = 'red' | 'blue' | 'green' | 'yellow'; 