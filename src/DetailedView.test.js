import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DetailedView from './DetailedView';

// Mocking fetch API globally
global.fetch = jest.fn((url) => {
  if (url.includes('/api/groups')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { _id: '1', name: 'Group A', participants: ['101', '102'] },
          { _id: '2', name: 'Group B', participants: [] },
        ]),
    });
  }
  if (url.includes('/api/users')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { studentId: '101', name: 'Student A' },
          { studentId: '102', name: 'Student B' },
        ]),
    });
  }
  if (url.includes('/api/assessments')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            groupName: 'Group A',
            assessorId: '201',
            createdAt: '2023-11-01T12:00:00Z',
            ratings: [
              {
                memberId: '101',
                cooperation: 5,
                conceptual: 4,
                practical: 3,
                workEthic: 4,
                comment: 'Great job!',
              },
            ],
          },
        ]),
    });
  }
  return Promise.reject(new Error('Invalid URL'));
});

// Mocking alert function
global.alert = jest.fn();

// Mocking useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn()),
}));

describe('DetailedView Component', () => {
  test('renders the loading state initially', async () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('renders groups and assessments correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <DetailedView />
        </Router>
      );
    });

    // Check for heading
    expect(screen.getByText(/Peer Assessments - Detailed View/i)).toBeInTheDocument();

    // Check for group with assessments
    expect(screen.getByText(/Group A/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Participants: 2/i)).toBeInTheDocument();

    // Check for group without assessments
    expect(screen.getByText(/Group B/i)).toBeInTheDocument();
    expect(screen.getByText(/No assessments available for this group./i)).toBeInTheDocument();

    // Check for assessment details
    expect(screen.getByText(/Student ID \(Being Assessed\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Assessor ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
    expect(screen.getByText(/Great job!/i)).toBeInTheDocument();
  });

  test('handles navigation back to the dashboard', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    await act(async () => {
      render(
        <Router>
          <DetailedView />
        </Router>
      );
    });

    const backButton = screen.getByText(/Back to Dashboard/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/instructor-dashboard');
  });

  test('shows an error message when fetch fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Fetch failed')));

    await act(async () => {
      render(
        <Router>
          <DetailedView />
        </Router>
      );
    });

    expect(global.alert).toHaveBeenCalledWith('An error occurred while fetching data.');
  });
});
