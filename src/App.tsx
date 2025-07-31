import React, { useState } from 'react';
import { useVolleyballState } from './hooks/useVolleyballState';
import { CourtCard } from './components/CourtCard';
import { Accordion } from './components/Accordion';
import { Sidebar } from './components/Sidebar';
import { AddTeamModal } from './components/modals/AddTeamModal';
import { EditTeamModal } from './components/modals/EditTeamModal';
import { AddToQueueModal } from './components/modals/AddToQueueModal';
import { DeleteTeamModal } from './components/modals/DeleteTeamModal';
import { getAvailableTeams, isTeamOnCourt } from './utils/dataUtils';
import { getNetColorBorderClass, getNetColorFocusClass, getCourtTextClass } from './utils/colorUtils';

function App() {
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
  } = useVolleyballState();

  // Accordion state
  const [isQueueOpen, setIsQueueOpen] = useState(true);
  const [isTeamsOpen, setIsTeamsOpen] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const availableTeams = getAvailableTeams(registeredTeams, teamQueue, teams);
  const teamToDelete = deletingTeamIndex !== null ? registeredTeams[deletingTeamIndex] : null;
  const isTeamOnCourtForDelete = teamToDelete ? isTeamOnCourt(teamToDelete.name, teams) : false;

  const handleDeleteConfirm = () => {
    if (deletingTeamIndex !== null) {
      handleDeleteTeam(deletingTeamIndex);
    }
  };

  const handleSidebarToggle = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(0,0,0,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}></div>
      </div>

      {/* Sidebar */}
      <Sidebar gameEvents={gameEvents} onToggle={handleSidebarToggle} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 relative z-10 ${isSidebarExpanded ? 'ml-80' : 'ml-16'}`}>
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center drop-shadow-sm">
              🏐 Big Digs Court Rotation 🏐
            </h1>
            <div className="w-24 h-1 bg-gray-600 mx-auto rounded-full opacity-40"></div>
          </header>

          {/* Court Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {teams.map((court, courtIndex) => (
              <CourtCard
                key={court.court}
                court={court}
                courtIndex={courtIndex}
                netColorDropdownOpen={netColorDropdownOpen}
                onNetColorChange={handleNetColorChange}
                onNetColorDropdownToggle={(index) => 
                  handleNetColorChange(courtIndex, index === -1 ? 'red' : 'blue')
                }
                onReportGame={handleReportGame}
                onClearTeams={handleClearTeams}
                onFillFromQueue={handleFillFromQueue}
                teamQueueLength={teamQueue.length}
              />
            ))}
          </div>

          {/* Team Queue Accordion */}
          <Accordion
            title={`Queue (${teamQueue.length})`}
            isOpen={isQueueOpen}
            onToggle={setIsQueueOpen}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 mb-8 shadow-lg"
          >
            <div className="flex justify-end mb-6 pt-4">
              <button
                onClick={() => setIsAddToQueueModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center shadow-md"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Team
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamQueue.map((team, index) => (
                  <div key={`${team.name}-${index}`} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-300 shadow-md hover:shadow-lg transition-shadow duration-200 relative">
                    <button
                      onClick={() => handleRemoveFromQueue(index)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors text-2xl font-bold leading-none"
                      title="Remove from queue"
                    >
                      ×
                    </button>
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 text-center pr-8 break-words">
                      {team.name}
                    </h3>
                    <div className="space-y-2">
                      {team.players.map((player, playerIndex) => (
                        <div key={playerIndex} className="flex items-center justify-between p-2 bg-blue-50/60 rounded border border-blue-200">
                          <span className="text-blue-800 font-medium text-sm">{player}</span>
                          <span className="text-xs text-blue-700 bg-blue-200 px-2 py-1 rounded">
                            P{playerIndex + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>

          {/* Teams Accordion */}
          <Accordion
            title={`Teams (${registeredTeams.length})`}
            isOpen={isTeamsOpen}
            onToggle={setIsTeamsOpen}
            className="bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 mb-8 shadow-lg"
          >
            <div className="flex justify-end mb-6 pt-4">
              <button
                onClick={handleOpenModal}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center shadow-md"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Team
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registeredTeams.map((team, index) => (
                  <div key={team.name} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-emerald-300 shadow-md hover:shadow-lg transition-shadow duration-200 relative">
                    <div className="flex justify-between items-start mb-3">
                      <button
                        onClick={() => handleEditTeam(index)}
                        className="text-emerald-600 hover:text-emerald-800 transition-colors"
                        title="Edit team"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingTeamIndex(index)}
                        className="text-gray-500 hover:text-gray-700 transition-colors text-2xl font-bold leading-none"
                        title="Delete team"
                      >
                        ×
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-900 text-center mb-3 break-words">
                      {team.name}
                    </h3>
                    <div className="space-y-2">
                      {team.players.map((player, playerIndex) => (
                        <div key={playerIndex} className="flex items-center justify-between p-2 bg-emerald-50/60 rounded border border-emerald-200">
                          <span className="text-emerald-800 font-medium text-sm">{player}</span>
                          <span className="text-xs text-emerald-700 bg-emerald-200 px-2 py-1 rounded">
                            P{playerIndex + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>
        </div>
      </div>

      {/* Modals */}
      <AddTeamModal
        isOpen={isModalOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <EditTeamModal
        isOpen={isEditModalOpen}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleEditSubmit}
        onCancel={handleCancel}
      />

      <AddToQueueModal
        isOpen={isAddToQueueModalOpen}
        availableTeams={availableTeams}
        selectedTeams={selectedTeams}
        onToggleTeamSelection={handleToggleTeamSelection}
        onAddSelectedTeams={handleAddSelectedTeamsToQueue}
        onCancel={handleCancel}
      />

      <DeleteTeamModal
        isOpen={deletingTeamIndex !== null}
        teamToDelete={teamToDelete}
        isOnCourt={isTeamOnCourtForDelete}
        onDelete={handleDeleteConfirm}
        onCancel={() => setDeletingTeamIndex(null)}
      />
    </div>
  );
}

export default App;
