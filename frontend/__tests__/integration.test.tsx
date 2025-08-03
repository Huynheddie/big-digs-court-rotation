import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock the Toast components to avoid context issues in tests
vi.mock('../components/Toast', () => ({
  Toast: ({ title }: { title: string }) => <div data-testid="toast">{title}</div>,
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useToast: () => ({
    showToast: vi.fn()
  })
}))

vi.mock('../components/useToastHook', () => ({
  useToast: () => ({
    showToast: vi.fn()
  })
}))

vi.mock('../components/ToastContextProvider', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
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