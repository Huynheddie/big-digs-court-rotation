# Testing Guide for Volleyball Court System

This guide covers how to write and run tests for the volleyball court system using Vitest, React Testing Library, and Jest DOM.

## 🚀 Quick Start

### Running Tests

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm run test:run

# Run tests with UI (interactive)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## 📁 Test Structure

```
src/
├── components/
│   ├── __tests__/
│   │   └── CourtCard.test.tsx          # Component tests
│   └── CourtCard.tsx
├── hooks/
│   ├── __tests__/
│   │   └── useVolleyballState.test.ts  # Hook tests
│   └── useVolleyballState.ts
├── utils/
│   ├── __tests__/
│   │   └── dataUtils.test.ts           # Utility function tests
│   └── dataUtils.ts
├── __tests__/
│   └── integration.test.tsx            # Integration tests
└── test/
    └── setup.ts                        # Test configuration
```

## 🧪 Types of Tests

### 1. Component Tests (`components/__tests__/`)

Test individual React components in isolation.

**Example:**
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CourtCard } from '../CourtCard'

describe('CourtCard', () => {
  it('renders court information correctly', () => {
    render(<CourtCard {...mockProps} />)
    expect(screen.getByText('Court 1')).toBeInTheDocument()
  })

  it('calls onReportGame when button is clicked', () => {
    const mockHandler = vi.fn()
    render(<CourtCard {...mockProps} onReportGame={mockHandler} />)
    
    fireEvent.click(screen.getByRole('button', { name: /report game/i }))
    expect(mockHandler).toHaveBeenCalledWith(0)
  })
})
```

### 2. Hook Tests (`hooks/__tests__/`)

Test custom React hooks using `renderHook`.

**Example:**
```tsx
import { renderHook, act } from '@testing-library/react'
import { useVolleyballState } from '../useVolleyballState'

describe('useVolleyballState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useVolleyballState())
    
    expect(result.current.teams).toHaveLength(3)
    expect(result.current.registeredTeams).toHaveLength(0)
  })

  it('should add a team correctly', () => {
    const { result } = renderHook(() => useVolleyballState())
    
    act(() => {
      result.current.setFormData({
        teamName: 'Test Team',
        players: ['P1', 'P2', 'P3', 'P4']
      })
      result.current.handleSubmit({ preventDefault: () => {} } as any)
    })
    
    expect(result.current.registeredTeams).toHaveLength(1)
  })
})
```

### 3. Utility Tests (`utils/__tests__/`)

Test pure functions and business logic.

**Example:**
```tsx
import { describe, it, expect } from 'vitest'
import { getAvailableTeams } from '../dataUtils'

describe('getAvailableTeams', () => {
  it('should return teams not on courts and not in queue', () => {
    const availableTeams = getAvailableTeams(mockTeams, mockQueue, mockCourts)
    expect(availableTeams).toHaveLength(1)
    expect(availableTeams[0].name).toBe('Team C')
  })
})
```

### 4. Integration Tests (`__tests__/`)

Test multiple components working together.

**Example:**
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

describe('App Integration', () => {
  it('should add a team and see it in the list', async () => {
    render(<App />)
    
    // Navigate to Teams view
    fireEvent.click(screen.getByRole('button', { name: /teams/i }))
    
    // Open modal and fill form
    fireEvent.click(screen.getByRole('button', { name: /add new team/i }))
    fireEvent.change(screen.getByLabelText(/team name/i), {
      target: { value: 'Test Team' }
    })
    
    // Submit and verify
    fireEvent.click(screen.getByRole('button', { name: /add team/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Test Team')).toBeInTheDocument()
    })
  })
})
```

## 🛠️ Testing Utilities

### Common Testing Patterns

#### 1. Mocking Functions
```tsx
const mockHandler = vi.fn()
render(<Component onAction={mockHandler} />)

fireEvent.click(screen.getByRole('button'))
expect(mockHandler).toHaveBeenCalledWith(expectedArgs)
```

#### 2. Testing Async Operations
```tsx
it('should handle async operations', async () => {
  render(<AsyncComponent />)
  
  fireEvent.click(screen.getByRole('button'))
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

#### 3. Testing Form Interactions
```tsx
it('should handle form submission', () => {
  render(<FormComponent />)
  
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'Test Name' }
  })
  
  fireEvent.submit(screen.getByRole('form'))
  
  expect(mockSubmitHandler).toHaveBeenCalledWith({
    name: 'Test Name'
  })
})
```

#### 4. Testing Modal/Dialog Interactions
```tsx
it('should open and close modal', async () => {
  render(<ModalComponent />)
  
  // Open modal
  fireEvent.click(screen.getByRole('button', { name: /open/i }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  
  // Close modal
  fireEvent.click(screen.getByRole('button', { name: /close/i }))
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
```

## 📊 Coverage

Run coverage to see which parts of your code are tested:

```bash
npm run test:coverage
```

This will generate a coverage report showing:
- **Statements**: Percentage of code statements executed
- **Branches**: Percentage of conditional branches executed
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

## 🎯 Best Practices

### 1. Test Behavior, Not Implementation
```tsx
// ✅ Good - Test what the user sees
expect(screen.getByText('Team Added!')).toBeInTheDocument()

// ❌ Bad - Test implementation details
expect(mockState.setTeams).toHaveBeenCalled()
```

### 2. Use Semantic Queries
```tsx
// ✅ Good - Use semantic queries
screen.getByRole('button', { name: /add team/i })
screen.getByLabelText(/team name/i)

// ❌ Bad - Use implementation details
screen.getByTestId('add-button')
```

### 3. Test User Interactions
```tsx
// ✅ Good - Test user actions
fireEvent.click(screen.getByRole('button'))
fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test' } })

// ❌ Bad - Test internal state directly
expect(component.state.name).toBe('Test')
```

### 4. Keep Tests Focused
```tsx
// ✅ Good - One assertion per test
it('should display team name', () => {
  render(<TeamCard team={mockTeam} />)
  expect(screen.getByText('Team Alpha')).toBeInTheDocument()
})

it('should call onEdit when edit button is clicked', () => {
  const mockEdit = vi.fn()
  render(<TeamCard team={mockTeam} onEdit={mockEdit} />)
  
  fireEvent.click(screen.getByRole('button', { name: /edit/i }))
  expect(mockEdit).toHaveBeenCalledWith(mockTeam)
})
```

## 🔧 Configuration

### Test Setup (`src/test/setup.ts`)
- Imports `@testing-library/jest-dom` for custom matchers
- Mocks browser APIs (IntersectionObserver, ResizeObserver)
- Configures global test environment

### Vite Config (`vite.config.ts`)
- Configures Vitest with jsdom environment
- Sets up test globals and setup files

## 🚨 Common Issues

### 1. Context Providers
If your component uses context, wrap it in the provider:
```tsx
render(
  <ToastProvider>
    <MyComponent />
  </ToastProvider>
)
```

### 2. Async Operations
Use `waitFor` for async operations:
```tsx
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### 3. Mocking Modules
Mock external dependencies:
```tsx
vi.mock('../utils/api', () => ({
  fetchData: vi.fn().mockResolvedValue(mockData)
}))
```

## 📈 Continuous Integration

Add this to your CI pipeline:

```yaml
- name: Run tests
  run: npm run test:run

- name: Run coverage
  run: npm run test:coverage
```

## 🎉 Getting Started

1. **Write your first test**: Start with a simple component test
2. **Run tests**: Use `npm test` to run in watch mode
3. **Check coverage**: Use `npm run test:coverage` to see what's tested
4. **Add more tests**: Gradually increase test coverage

Remember: **Good tests make refactoring safe and catch bugs early!** 🏐✨ 