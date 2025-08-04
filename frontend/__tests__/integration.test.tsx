import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock the Toast components to avoid context issues in tests
vi.mock('../components/Toast', () => ({
  Toast: ({ title }: { title: string }) => <div data-testid="toast">{title}</div>,
}))

vi.mock('../components/useToastHook', () => ({
  useToast: () => ({
    showToast: vi.fn()
  })
}))

vi.mock('../components/ToastContextProvider', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock the API and WebSocket services
vi.mock('../services/api', () => ({
  teamApi: {
    getAllTeams: vi.fn().mockResolvedValue({ success: true, data: [] }),
    createTeam: vi.fn().mockResolvedValue({ success: true, data: { id: '1', name: 'Test Team' } }),
    updateTeam: vi.fn().mockResolvedValue({ success: true, data: { id: '1', name: 'Updated Team' } }),
    deleteTeam: vi.fn().mockResolvedValue({ success: true }),
  },
  courtApi: {
    getAllCourts: vi.fn().mockResolvedValue({ success: true, data: [] }),
    updateCourt: vi.fn().mockResolvedValue({ success: true, data: {} }),
    clearCourt: vi.fn().mockResolvedValue({ success: true, data: {} }),
    fillCourt: vi.fn().mockResolvedValue({ success: true, data: {} }),
    reportGame: vi.fn().mockResolvedValue({ success: true, data: { id: '1' } }),
  },
  queueApi: {
    getQueue: vi.fn().mockResolvedValue({ success: true, data: [] }),
    addToQueue: vi.fn().mockResolvedValue({ success: true }),
    removeFromQueue: vi.fn().mockResolvedValue({ success: true }),
  },
  healthApi: {
    checkHealth: vi.fn().mockResolvedValue({ success: true }),
  },
}))

vi.mock('../services/websocket', () => ({
  default: {
    isConnected: vi.fn().mockReturnValue(false),
    onCourtUpdated: vi.fn(),
    onGameReported: vi.fn(),
    onTeamAdded: vi.fn(),
    onTeamUpdated: vi.fn(),
    onTeamDeleted: vi.fn(),
    onQueueUpdated: vi.fn(),
    onStateSync: vi.fn(),
    emitCourtUpdate: vi.fn(),
    emitGameReported: vi.fn(),
    emitTeamAdded: vi.fn(),
    emitTeamUpdated: vi.fn(),
    emitTeamDeleted: vi.fn(),
    emitQueueUpdated: vi.fn(),
  },
}))

// Mock the hooks
vi.mock('../hooks/useVolleyballApi', () => ({
  useVolleyballApi: () => ({
    isLoading: false,
    error: null,
    isConnected: false,
    teams: [],
    courts: [],
    generalQueue: [],
    kingsCourtQueue: [],
    gameEvents: [],
    createTeam: vi.fn().mockResolvedValue({ id: '1', name: 'Test Team' }),
    updateTeam: vi.fn().mockResolvedValue({ id: '1', name: 'Updated Team' }),
    deleteTeam: vi.fn().mockResolvedValue(true),
    updateCourt: vi.fn().mockResolvedValue({}),
    clearCourt: vi.fn().mockResolvedValue({}),
    fillCourt: vi.fn().mockResolvedValue({}),
    reportGame: vi.fn().mockResolvedValue({ id: '1' }),
    addToQueue: vi.fn().mockResolvedValue(true),
    removeFromQueue: vi.fn().mockResolvedValue(true),
    clearQueue: vi.fn().mockResolvedValue(true),
    checkHealth: vi.fn().mockResolvedValue(true),
    clearError: vi.fn(),
  }),
}))

describe('App Integration', () => {
  it('should render the main app with navigation', () => {
    render(<App />)
    
    expect(screen.getByText('Courts')).toBeInTheDocument()
    expect(screen.getByText('Teams')).toBeInTheDocument()
  })

  it('should switch between Courts and Teams views', async () => {
    render(<App />)
    
    // Should start on Courts view - look for court names instead of "Queue"
    expect(screen.getByText('Challenger Court #1')).toBeInTheDocument()
    
    // Switch to Teams view - use more specific selector
    const teamsButton = screen.getByRole('button', { name: /view teams page/i })
    fireEvent.click(teamsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Teams (12)')).toBeInTheDocument() // Updated to match initial data
    })
    
    // Switch back to Courts view
    const courtsButton = screen.getByRole('button', { name: /view courts page/i })
    fireEvent.click(courtsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Challenger Court #1')).toBeInTheDocument()
    })
  })

  it('should open and close the Add Team modal', async () => {
    render(<App />)
    
    // Switch to Teams view
    const teamsButton = screen.getByRole('button', { name: /view teams page/i })
    fireEvent.click(teamsButton)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add new team/i })).toBeInTheDocument()
    })
    
    // Open modal
    const addButton = screen.getByRole('button', { name: /add new team/i })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/team name/i)).toBeInTheDocument()
    })
    
    // Close modal
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    
    await waitFor(() => {
      expect(screen.queryByLabelText(/team name/i)).not.toBeInTheDocument()
    })
  })

  it('should add a team and see it in the list', async () => {
    render(<App />)
    
    // Switch to Teams view
    const teamsButton = screen.getByRole('button', { name: /view teams page/i })
    fireEvent.click(teamsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Add New Team')).toBeInTheDocument()
    })
    
    // Open modal
    const addButton = screen.getByRole('button', { name: /add new team/i })
    fireEvent.click(addButton)
    
    // Fill out form
    const teamNameInput = screen.getByLabelText(/team name/i)
    const player1Input = screen.getByLabelText(/player 1/i)
    const player2Input = screen.getByLabelText(/player 2/i)
    const player3Input = screen.getByLabelText(/player 3/i)
    const player4Input = screen.getByLabelText(/player 4/i)
    
    fireEvent.change(teamNameInput, { target: { value: 'Test Team' } })
    fireEvent.change(player1Input, { target: { value: 'Alice' } })
    fireEvent.change(player2Input, { target: { value: 'Bob' } })
    fireEvent.change(player3Input, { target: { value: 'Charlie' } })
    fireEvent.change(player4Input, { target: { value: 'David' } })
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /add team/i })
    fireEvent.click(submitButton)
    
    // Check that team appears in list
    await waitFor(() => {
      expect(screen.getByText('Test Team')).toBeInTheDocument()
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })
}) 