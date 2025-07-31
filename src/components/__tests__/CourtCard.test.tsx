import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CourtCard } from '../CourtCard'
import type { Court } from '../../types'

// Mock data
const mockCourt: Court = {
  court: "Court 1",
  team1: { name: "Team Alpha", players: ["Alice", "Bob", "Charlie", "David"] },
  team2: { name: "Team Beta", players: ["Eve", "Frank", "Grace", "Henry"] },
  status: "active",
  score: "0-0",
  netColor: "blue"
}

const mockProps = {
  court: mockCourt,
  courtIndex: 0,
  onReportGame: vi.fn(),
  onClearTeams: vi.fn(),
  onFillFromQueue: vi.fn(),
  onOpenCourtDetails: vi.fn(),
  teamQueueLength: 5
}

describe('CourtCard', () => {
  it('renders court information correctly', () => {
    render(<CourtCard {...mockProps} />)
    
    expect(screen.getByText('Court 1')).toBeInTheDocument()
    expect(screen.getByText('Team Alpha')).toBeInTheDocument()
    expect(screen.getByText('Team Beta')).toBeInTheDocument()
  })

  it('displays all players for both teams', () => {
    render(<CourtCard {...mockProps} />)
    
    // Check Team Alpha players
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
    expect(screen.getByText('David')).toBeInTheDocument()
    
    // Check Team Beta players
    expect(screen.getByText('Eve')).toBeInTheDocument()
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
    expect(screen.getByText('Henry')).toBeInTheDocument()
  })

  it('calls onReportGame when Finish Game button is clicked', () => {
    render(<CourtCard {...mockProps} />)
    
    const reportButton = screen.getByRole('button', { name: /finish game between team alpha and team beta/i })
    fireEvent.click(reportButton)
    
    expect(mockProps.onReportGame).toHaveBeenCalledWith(0)
  })

  it('calls onClearTeams when Clear Teams button is clicked', () => {
    render(<CourtCard {...mockProps} />)
    
    const clearButton = screen.getByRole('button', { name: /clear teams from court 1/i })
    fireEvent.click(clearButton)
    
    expect(mockProps.onClearTeams).toHaveBeenCalledWith(0)
  })

  it('shows Fill from Queue button when court is empty and queue has teams', () => {
    const emptyCourt: Court = {
      court: "Court 2",
      team1: { name: "No Team", players: ["", "", "", ""] },
      team2: { name: "No Team", players: ["", "", "", ""] },
      status: "inactive",
      score: "0-0",
      netColor: "red"
    }
    
    render(<CourtCard {...mockProps} court={emptyCourt} teamQueueLength={2} />)
    
    const fillButton = screen.getByRole('button', { name: /fill court 2 from queue/i })
    expect(fillButton).toBeInTheDocument()
    
    fireEvent.click(fillButton)
    expect(mockProps.onFillFromQueue).toHaveBeenCalledWith(0)
  })

  it('does not show Fill from Queue button when queue is empty', () => {
    const emptyCourt: Court = {
      court: "Court 2",
      team1: { name: "No Team", players: ["", "", "", ""] },
      team2: { name: "No Team", players: ["", "", "", ""] },
      status: "inactive",
      score: "0-0",
      netColor: "red"
    }
    
    render(<CourtCard {...mockProps} court={emptyCourt} teamQueueLength={0} />)
    
    expect(screen.queryByRole('button', { name: /fill from queue/i })).not.toBeInTheDocument()
  })

  it('handles empty teams correctly', () => {
    const emptyCourt: Court = {
      court: "Court 2",
      team1: { name: "No Team", players: ["", "", "", ""] },
      team2: { name: "No Team", players: ["", "", "", ""] },
      status: "inactive",
      score: "0-0",
      netColor: "red"
    }
    
    render(<CourtCard {...mockProps} court={emptyCourt} />)
    
    // Should find both "No Team" headings
    const noTeamHeadings = screen.getAllByText('No Team')
    expect(noTeamHeadings).toHaveLength(2)
  })

  it('shows Kings Court crown icon', () => {
    const kingsCourt: Court = {
      court: "Kings Court",
      team1: { name: "Team Alpha", players: ["Alice", "Bob", "Charlie", "David"] },
      team2: { name: "Team Beta", players: ["Eve", "Frank", "Grace", "Henry"] },
      status: "active",
      score: "1-0",
      netColor: "purple"
    }
    
    render(<CourtCard {...mockProps} court={kingsCourt} />)
    
    expect(screen.getByRole('img', { name: /crown for kings court/i })).toBeInTheDocument()
  })

  it('calls onOpenCourtDetails when card is clicked', () => {
    render(<CourtCard {...mockProps} />)
    
    const card = screen.getByRole('button', { name: /court 1 - click to edit court details/i })
    fireEvent.click(card)
    
    expect(mockProps.onOpenCourtDetails).toHaveBeenCalledWith(0)
  })

  it('calls onOpenCourtDetails when Enter key is pressed', () => {
    render(<CourtCard {...mockProps} />)
    
    const card = screen.getByRole('button', { name: /court 1 - click to edit court details/i })
    fireEvent.keyDown(card, { key: 'Enter' })
    
    expect(mockProps.onOpenCourtDetails).toHaveBeenCalledWith(0)
  })
}) 