import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DetailedView from './DetailedView';
import { act } from 'react';

global.fetch = jest.fn((url) => {
  if (url.includes('/api/groups')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ _id: '1', name: 'Group A', participants: ['101', '102'] }]),
    });
  }
  if (url.includes('/api/users')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { studentId: '101', name: 'Student A' },
        { studentId: '102', name: 'Student B' },
      ]),
    });
  }
  if (url.includes('/api/assessments')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          groupName: 'Group A',
          assessorId: '201',
          ratings: [{ memberId: '101', cooperation: 4, conceptual: 3, practical: 5, workEthic: 4 }],
        },
      ]),
    });
  }
  return Promise.reject(new Error('Invalid URL'));
});

// Mock `alert`
global.alert = jest.fn();

// Mock `useNavigate`
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn()),
}));

describe('DetailedView Component', () => {
  test('renders DetailedView component with group and assessment data', async () => {
    await act(async () => {
      render(
        <Router>
          <DetailedView />
        </Router>
      );
    });

    expect(await screen.findByText(/Peer Assessments - Detailed View/i)).toBeInTheDocument();
    expect(await screen.findByText(/Group A/i)).toBeInTheDocument();
    expect(await screen.findByText(/Total Participants:/i)).toBeInTheDocument();
  });

  test('renders a message when no assessments are available', async () => {
    global.fetch.mockImplementationOnce((url) =>
      url.includes('/api/assessments')
        ? Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
        : Promise.reject(new Error('Invalid URL'))
    );

    await act(async () => {
      render(
        <Router>
          <DetailedView />
        </Router>
      );
    });

    const noAssessmentsMessage = await screen.findByText(/No assessments available for this group./i);
    expect(noAssessmentsMessage).toBeInTheDocument();
  });

  test('navigates back to the instructor dashboard on back button click', async () => {
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
