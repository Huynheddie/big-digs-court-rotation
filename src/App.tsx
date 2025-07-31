import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVolleyballState } from './hooks/useVolleyballState';
import { CourtCard } from './components/CourtCard';
import { Accordion } from './components/Accordion';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { TeamsCard } from './components/TeamsCard';
import { RotationSystemDropdown } from './components/RotationSystemDropdown';
import { ToastProvider, useToast } from './components/Toast';
import { AddTeamModal } from './components/modals/AddTeamModal';
import { EditTeamModal } from './components/modals/EditTeamModal';
import { AddToQueueModal } from './components/modals/AddToQueueModal';
import { DeleteTeamModal } from './components/modals/DeleteTeamModal';
import { ReportGameModal } from './components/modals/ReportGameModal';
import { TeamDetailsModal } from './components/modals/TeamDetailsModal';
import { CourtDetailsModal } from './components/modals/CourtDetailsModal';
import { getAvailableTeams, isTeamOnCourt } from './utils/dataUtils';

function AppContent() {
  const { showToast } = useToast();
  const {
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
    reportingCourtIndex,
    deletingTeamIndex,
    selectedTeamForDetails,
    courtDetailsModalOpen,
    selectedCourtForDetails,

    // Setters
    setIsAddToQueueModalOpen,
    setSelectedTeams,
    setDeletingTeamIndex,

    // Handlers
    handleInputChange,
    handleScoreInputChange,
    handleSubmit,
    handleEditSubmit,
    handleCancel,
    handleReportGame,
    handleReportGameSubmit,
    handleNetColorChange,
    handleOpenModal,
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
  } = useVolleyballState();

  // Page state
  const [currentPage, setCurrentPage] = useState<'courts' | 'teams'>('courts');
  const [currentRotationSystem, setCurrentRotationSystem] = useState('3-court-4v4');

  const availableTeams = getAvailableTeams(registeredTeams, teamQueue, teams);
  const teamToDelete = deletingTeamIndex !== null ? registeredTeams[deletingTeamIndex] : null;
  const isTeamOnCourtForDelete = teamToDelete ? isTeamOnCourt(teamToDelete.name, teams) : false;

  // Enhanced handlers with toast notifications
  const handleSubmitWithToast = (e: React.FormEvent) => {
    handleSubmit(e);
    showToast({
      type: 'success',
      title: 'Team Added!',
      message: `Successfully added "${formData.teamName}" to the system.`
    });
  };

  const handleEditSubmitWithToast = (e: React.FormEvent) => {
    handleEditSubmit(e);
    showToast({
      type: 'success',
      title: 'Team Updated!',
      message: `Successfully updated "${formData.teamName}".`
    });
  };

  const handleReportGameSubmitWithToast = (e: React.FormEvent) => {
    const court = reportingCourtIndex !== null ? teams[reportingCourtIndex] : null;
    handleReportGameSubmit(e);
    if (court) {
      showToast({
        type: 'success',
        title: 'Game Reported!',
        message: `Game between ${court.team1.name} and ${court.team2.name} has been recorded.`
      });
    }
  };

  const handleAddSelectedTeamsToQueueWithToast = () => {
    const selectedCount = selectedTeams.length;
    handleAddSelectedTeamsToQueue();
    if (selectedCount > 0) {
      showToast({
        type: 'info',
        title: 'Teams Added to Queue!',
        message: `${selectedCount} team${selectedCount > 1 ? 's' : ''} added to the queue.`
      });
    }
  };

  const handleRemoveFromQueueWithToast = (index: number) => {
    const teamName = teamQueue[index]?.name || 'Team';
    handleRemoveFromQueue(index);
    showToast({
      type: 'info',
      title: 'Team Removed',
      message: `"${teamName}" has been removed from the queue.`
    });
  };

  const handleClearTeamsWithToast = (courtIndex: number) => {
    const court = teams[courtIndex];
    const teamNames = [court.team1.name, court.team2.name].filter(name => name !== 'No Team');
    handleClearTeams(courtIndex);
    if (teamNames.length > 0) {
      showToast({
        type: 'warning',
        title: 'Teams Cleared',
        message: `Cleared teams from ${court.court}.`
      });
    }
  };

  const handleFillFromQueueWithToast = (courtIndex: number) => {
    const court = teams[courtIndex];
    const teamsAdded = teamQueue.length >= 2 ? 2 : teamQueue.length;
    handleFillFromQueue(courtIndex);
    showToast({
      type: 'info',
      title: 'Court Filled!',
      message: `Added ${teamsAdded} team${teamsAdded > 1 ? 's' : ''} to ${court.court}.`
    });
  };

  const handleDeleteConfirmWithToast = () => {
    if (deletingTeamIndex !== null) {
      const teamName = registeredTeams[deletingTeamIndex]?.name || 'Team';
      handleDeleteTeam(deletingTeamIndex);
      setDeletingTeamIndex(null);
      showToast({
        type: 'error',
        title: 'Team Deleted',
        message: `"${teamName}" has been permanently deleted.`
      });
    }
  };

  const handleDeleteTeamFromDetailsWithToast = (teamIndex: number) => {
    const teamName = registeredTeams[teamIndex]?.name || 'Team';
    handleDeleteTeamFromDetails(teamIndex);
    showToast({
      type: 'error',
      title: 'Team Deleted',
      message: `"${teamName}" has been permanently deleted.`
    });
  };

  const handleResetToEventWithToast = (eventId: string) => {
    resetToEvent(eventId);
    showToast({
      type: 'info',
      title: 'State Restored',
      message: 'Game state has been restored to the selected point in time.'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">


      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(234, 88, 12, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }}></div>
      </div>

      {/* Navbar */}
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Date Display - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-soft rounded-xl px-4 py-2">
          <div className="text-caption text-gray-600 font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Rotation System Dropdown - Top Right Below Date */}
      <div className="absolute top-20 right-4 z-50">
        <RotationSystemDropdown
          currentSystem={currentRotationSystem}
          onSystemChange={setCurrentRotationSystem}
        />
      </div>

      {/* Sidebar */}
      <Sidebar 
        gameEvents={gameEvents}
        onResetToEvent={handleResetToEventWithToast}
        currentState={{ teams, registeredTeams, teamQueue }}
      />
      
      {/* Main Content */}
      <main 
        id="main-content"
        className={`transition-all duration-300 relative z-10 ml-16 pt-24`}
        role="main"
      >
        <div className="container-responsive py-8">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {currentPage === 'courts' ? (
            <>
              {/* Court Cards - Enhanced Layout */}
              <div className="mb-8">
                {/* Top Row - Challenger Courts */}
                <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 mb-8">
                  {teams.slice(0, 2).map((court, courtIndex) => (
                    <div key={court.court} className="flex-1 max-w-md mx-auto lg:max-w-none">
                      <CourtCard
                        court={court}
                        courtIndex={courtIndex}
                        onReportGame={handleReportGame}
                        onClearTeams={handleClearTeamsWithToast}
                        onFillFromQueue={handleFillFromQueueWithToast}
                        onOpenCourtDetails={handleOpenCourtDetails}
                        teamQueueLength={teamQueue.length}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Bottom Row - Kings Court */}
                <div className="flex justify-center">
                  <div className="w-full max-w-2xl mx-auto lg:max-w-2xl">
                    {teams.slice(2, 3).map((court, courtIndex) => (
                      <CourtCard
                        key={court.court}
                        court={court}
                        courtIndex={courtIndex + 2} // Adjust index for Kings Court
                        onReportGame={handleReportGame}
                        onClearTeams={handleClearTeamsWithToast}
                        onFillFromQueue={handleFillFromQueueWithToast}
                        onOpenCourtDetails={handleOpenCourtDetails}
                        teamQueueLength={teamQueue.length}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Queue Card - Full Layout */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl shadow-soft mb-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                  <h2 className="text-heading-2 text-primary-900">
                    Queue ({teamQueue.length})
                  </h2>
                  <button
                    onClick={() => setIsAddToQueueModalOpen(true)}
                    className="btn-primary text-sm flex items-center shadow-md"
                    aria-label="Add team to queue"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Team to Queue
                  </button>
                </div>
                
                {/* Divider */}
                <div className="border-t border-primary-200 mx-6"></div>
                
                {/* Content */}
                <div className="px-6 pb-6">
                  <div className="max-h-[600px] overflow-y-auto">
                    {teamQueue.length === 0 ? (
                      <div className="text-center py-16 text-gray-500">
                        <div className="text-5xl mb-6">🏐</div>
                        <h3 className="text-heading-4 text-gray-700 mb-2">No teams in queue</h3>
                        <p className="text-body-small mb-6">Add teams to get started!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 px-2">
                        {teamQueue.map((team, index) => (
                          <div key={`${team.name}-${index}`} className="bg-white rounded-2xl shadow-medium border-2 border-primary-300 relative group p-6">
                            <button
                              onClick={() => handleRemoveFromQueueWithToast(index)}
                              className="absolute top-3 right-3 text-gray-500 hover:text-error-600 text-xl font-bold leading-none"
                              title="Remove from queue"
                              aria-label={`Remove ${team.name} from queue`}
                            >
                              ×
                            </button>
                            <h3 className="text-heading-4 text-primary-900 mb-4 text-center pr-8 break-words pt-4">
                              {team.name}
                            </h3>
                            <div className="space-y-3">
                              {team.players.map((player, playerIndex) => (
                                <div key={playerIndex} className="flex items-center justify-between p-4 bg-primary-100/80 rounded-xl border border-primary-300">
                                  <span className="text-primary-900 font-medium text-sm truncate mr-4">{player}</span>
                                  <span className="text-xs text-primary-800 bg-primary-300 px-4 py-2 rounded-lg font-medium flex-shrink-0">
                                    P{playerIndex + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
                      ) : (
              /* Teams Page */
              <TeamsCard
                teams={registeredTeams}
                onOpenModal={handleOpenModal}
                onOpenTeamDetails={handleOpenTeamDetails}
              />
            )}
          </motion.div>
        </div>
      </main>

      {/* Modals */}
      <AddTeamModal
        isOpen={isModalOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmitWithToast}
        onCancel={handleCancel}
      />

      <EditTeamModal
        isOpen={isEditModalOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleEditSubmitWithToast}
        onCancel={handleCancel}
      />

      <AddToQueueModal
        isOpen={isAddToQueueModalOpen}
        availableTeams={availableTeams}
        selectedTeams={selectedTeams}
        onToggleTeamSelection={handleToggleTeamSelection}
        onSelectAllTeams={handleSelectAllTeams}
        onAddSelectedTeams={handleAddSelectedTeamsToQueueWithToast}
        onCancel={handleCancel}
        setSelectedTeams={setSelectedTeams}
      />

      <DeleteTeamModal
        isOpen={deletingTeamIndex !== null}
        teamToDelete={teamToDelete}
        isOnCourt={isTeamOnCourtForDelete}
        onDelete={handleDeleteConfirmWithToast}
        onCancel={() => setDeletingTeamIndex(null)}
      />

      <ReportGameModal
        isOpen={isReportGameModalOpen}
        gameScoreData={gameScoreData}
        onScoreInputChange={handleScoreInputChange}
        onSubmit={handleReportGameSubmitWithToast}
        onCancel={handleCancel}
        team1Name={reportingCourtIndex !== null ? teams[reportingCourtIndex].team1.name : ''}
        team2Name={reportingCourtIndex !== null ? teams[reportingCourtIndex].team2.name : ''}
      />

      <TeamDetailsModal
        isOpen={teamDetailsModalOpen}
        team={selectedTeamForDetails !== null ? registeredTeams[selectedTeamForDetails] : null}
        gameEvents={gameEvents}
        onClose={handleCloseTeamDetails}
        onEdit={handleEditTeamFromDetails}
        onDelete={handleDeleteTeamFromDetailsWithToast}
        teamIndex={selectedTeamForDetails}
      />

      <CourtDetailsModal
        isOpen={courtDetailsModalOpen}
        court={selectedCourtForDetails !== null ? teams[selectedCourtForDetails] : null}
        courtIndex={selectedCourtForDetails}
        teamQueue={teamQueue}
        teams={teams}
        onClose={handleCloseCourtDetails}
        onNetColorChange={handleNetColorChange}
        onTeamChange={handleTeamChange}
      />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
