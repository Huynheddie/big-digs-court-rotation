import type { Team, Court } from '../types';

export const generateRandomString = (prefix: string): string => {
  return `${prefix}_${Math.random().toString(36).substring(2, 8)}`;
};

export const getAllTeams = (teams: Court[]): Team[] => {
  const allTeams: Team[] = [];
  teams.forEach(court => {
    if (court.team1.name !== "No Team") {
      allTeams.push(court.team1);
    }
    if (court.team2.name !== "No Team") {
      allTeams.push(court.team2);
    }
  });
  return allTeams;
};

export const getTeamData = (teams: Court[]): { [key: string]: Team } => {
  const teamData: { [key: string]: Team } = {};
  teams.forEach(court => {
    if (court.team1.name !== "No Team") {
      teamData[court.team1.name] = court.team1;
    }
    if (court.team2.name !== "No Team") {
      teamData[court.team2.name] = court.team2;
    }
  });
  return teamData;
};

export const isTeamOnCourt = (teamName: string, courts: Court[]): boolean => {
  return courts.some(court => 
    court.team1.name === teamName || court.team2.name === teamName
  );
};

export const isTeamInQueue = (teamName: string, queue: Team[]): boolean => {
  return queue.some(team => team.name === teamName);
};

export const getAvailableTeams = (registeredTeams: Team[], queue: Team[], courts: Court[], kingsCourtQueue?: Team[]): Team[] => {
  return registeredTeams.filter(team => {
    const inQueue = isTeamInQueue(team.name, queue);
    const inKingsCourtQueue = kingsCourtQueue ? isTeamInQueue(team.name, kingsCourtQueue) : false;
    const onCourt = isTeamOnCourt(team.name, courts);
    return !inQueue && !inKingsCourtQueue && !onCourt;
  });
}; 