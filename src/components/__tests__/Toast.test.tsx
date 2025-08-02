import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toast } from '../Toast';

describe('Toast', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with correct content', () => {
    render(
      <Toast
        type="success"
        title="Test Title"
        message="Test Message"
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(
      <Toast
        type="success"
        title="Test Title"
        message="Test Message"
        onClick={mockOnClick}
      />
    );

    const toast = screen.getByRole('alert');
    fireEvent.click(toast);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when no onClick prop is provided', () => {
    render(
      <Toast
        type="success"
        title="Test Title"
        message="Test Message"
      />
    );

    const toast = screen.getByRole('alert');
    fireEvent.click(toast);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should have correct styling for success type', () => {
    render(
      <Toast
        type="success"
        title="Test Title"
        message="Test Message"
        onClick={mockOnClick}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-green-50', 'border-green-200', 'text-green-600');
  });

  it('should have correct styling for error type', () => {
    render(
      <Toast
        type="error"
        title="Test Title"
        message="Test Message"
        onClick={mockOnClick}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-red-50', 'border-red-200', 'text-red-600');
  });

  it('should have correct styling for info type', () => {
    render(
      <Toast
        type="info"
        title="Test Title"
        message="Test Message"
        onClick={mockOnClick}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-gray-50', 'border-gray-200', 'text-gray-600');
  });

  it('should have cursor pointer when onClick is provided', () => {
    render(
      <Toast
        type="success"
        title="Test Title"
        message="Test Message"
        onClick={mockOnClick}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('cursor-pointer');
  });

  it('should not have cursor pointer when onClick is not provided', () => {
    render(
      <Toast
        type="success"
        title="Test Title"
        message="Test Message"
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).not.toHaveClass('cursor-pointer');
  });

  it('should have correct accessibility attributes', () => {
    render(
      <Toast
        type="success"
        title="Test Title"
        message="Test Message"
        onClick={mockOnClick}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
    expect(toast).toHaveAttribute('aria-atomic', 'true');
  });
}); 