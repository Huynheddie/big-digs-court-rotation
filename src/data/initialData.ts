import type { Court, Team } from '../types';

export const initialRegisteredTeams: Team[] = [
  { name: "Alex's Thunder Spikers", players: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez", "Emma Wilson"] },
  { name: "David's Lightning Strikes", players: ["David Kim", "Lisa Thompson", "Carlos Martinez", "Rachel Green"] },
  { name: "James's Volcano Vipers", players: ["James Brown", "Maria Garcia", "Tom Anderson", "Sophie Lee"] },
  { name: "Kevin's Storm Riders", players: ["Kevin Zhang", "Amanda Foster", "Robert Taylor", "Jessica Park"] },
  { name: "Daniel's Phoenix Fire", players: ["Daniel White", "Nicole Davis", "Chris Lopez", "Hannah Miller"] },
  { name: "Ryan's Dragon Warriors", players: ["Ryan Clark", "Michelle Hall", "Andrew Wright", "Stephanie King"] },
  { name: "Brandon's Ocean Waves", players: ["Brandon Lee", "Ashley Wong", "Marcus Johnson", "Isabella Silva"] },
  { name: "Tyler's Mountain Lions", players: ["Tyler Chen", "Victoria Rodriguez", "Jordan Smith", "Maya Patel"] },
  { name: "Nathan's Desert Eagles", players: ["Nathan Wilson", "Olivia Garcia", "Ethan Davis", "Sofia Kim"] },
  { name: "Logan's Forest Bears", players: ["Logan Taylor", "Ava Martinez", "Caleb Brown", "Zoe Anderson"] },
  { name: "Dylan's Sky Hawks", players: ["Dylan White", "Chloe Thompson", "Isaac Foster", "Luna Park"] },
  { name: "Connor's River Rapids", players: ["Connor Hall", "Grace Lee", "Mason Clark", "Nova Silva"] }
];

export const initialTeams: Court[] = [
  {
    court: "Challenger Court #1",
    team1: {
      name: "Alex's Thunder Spikers",
      players: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez", "Emma Wilson"]
    },
    team2: {
      name: "David's Lightning Strikes",
      players: ["David Kim", "Lisa Thompson", "Carlos Martinez", "Rachel Green"]
    },
    status: "In Progress",
    score: "21-18",
    netColor: "red"
  },
  {
    court: "Challenger Court #2",
    team1: {
      name: "James's Volcano Vipers",
      players: ["James Brown", "Maria Garcia", "Tom Anderson", "Sophie Lee"]
    },
    team2: {
      name: "Kevin's Storm Riders",
      players: ["Kevin Zhang", "Amanda Foster", "Robert Taylor", "Jessica Park"]
    },
    status: "Available",
    score: "0-0",
    netColor: "blue"
  },
  {
    court: "Kings Court",
    team1: {
      name: "Daniel's Phoenix Fire",
      players: ["Daniel White", "Nicole Davis", "Chris Lopez", "Hannah Miller"]
    },
    team2: {
      name: "Ryan's Dragon Warriors",
      players: ["Ryan Clark", "Michelle Hall", "Andrew Wright", "Stephanie King"]
    },
    status: "Available",
    score: "0-0",
    netColor: "green",
    team1ConsecutiveWins: 0,
    team2ConsecutiveWins: 0
  }
];

export const initialQueue: Team[] = [
  { name: "Brandon's Ocean Waves", players: ["Brandon Lee", "Ashley Wong", "Marcus Johnson", "Isabella Silva"] },
  { name: "Tyler's Mountain Lions", players: ["Tyler Chen", "Victoria Rodriguez", "Jordan Smith", "Maya Patel"] },
  { name: "Nathan's Desert Eagles", players: ["Nathan Wilson", "Olivia Garcia", "Ethan Davis", "Sofia Kim"] },
  { name: "Logan's Forest Bears", players: ["Logan Taylor", "Ava Martinez", "Caleb Brown", "Zoe Anderson"] }
]; 