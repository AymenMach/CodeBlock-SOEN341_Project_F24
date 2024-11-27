import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DetailedView from './DetailedView';

// Mocking the fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('/api/groups')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { _id: '1', name: 'Group A', participants: ['101'] },
          { _id: '2', name: 'Group B', participants: [] },
        ]),
    });
  }
  if (url.includes('/api/users')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([{ studentId: '101', name: 'Student A' }]),
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
                comment: 'Great work!',
              },
            ],
          },
        ]),
    });
  }
  return Promise.reject(new Error('Invalid URL'));
});

// Mocking alert to avoid test crashes
global.alert = jest.fn();

describe('DetailedView Component', () => {
  test('renders groups and assessments correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <DetailedView />
        </Router>
      );
    });

    // Check if "Loading..." is displayed initially
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Check if the main header is rendered
    expect(await screen.findByText(/Peer Assessments - Detailed View/i)).toBeInTheDocument();

    // Check for group with assessments
    expect(screen.getByText(/Group A/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Participants: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Great work!/i)).toBeInTheDocument();

    // Check for group without assessments
    expect(screen.getByText(/Group B/i)).toBeInTheDocument();
    expect(screen.getByText(/No assessments available for this group./i)).toBeInTheDocument();
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

    const backButton = await screen.findByText(/Back to Dashboard/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/instructor-dashboard');
  });
});
