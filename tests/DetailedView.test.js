import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DetailedView from './DetailedView'; 
import { BrowserRouter } from 'react-router-dom';


global.fetch = jest.fn();

describe('DetailedView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should fetch and display data successfully', async () => {
    const mockGroups = [{ id: '1', name: 'Group 1' }];
    const mockUsers = [{ id: '1', name: 'User 1' }];
    const mockAssessments = [{ id: '1', name: 'Assessment 1' }];

    // Mock successful fetch responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockGroups),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUsers),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockAssessments),
      });

    render(
      <BrowserRouter>
        <DetailedView />
      </BrowserRouter>
    );

    // Ensure loading state is displayed initially
    expect(screen.queryByText(/loading/i)).toBeInTheDocument();

    // Wait for data to be fetched and displayed
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/groups');
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/users');
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/assessments');
    });
  });

  it('should handle fetch errors gracefully', async () => {
    // Mock a failed fetch response
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    // Mock alert
    window.alert = jest.fn();

    render(
      <BrowserRouter>
        <DetailedView />
      </BrowserRouter>
    );

    // Wait for error handling
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/groups');
      expect(window.alert).toHaveBeenCalledWith('An error occurred while fetching data.');
    });
  });
});

