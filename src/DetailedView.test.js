// test file for CI pipeline
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DetailedView from './DetailedView';
import { act } from 'react'; 

// Mock fetch response data
const mockGroups = [
  { _id: '1', name: 'Group A', participants: ['101', '102'] },
  { _id: '2', name: 'Group B', participants: ['103', '104'] },
];

const mockUsers = [
  { studentId: '101', name: 'Alice' },
  { studentId: '102', name: 'Bob' },
  { studentId: '103', name: 'Charlie' },
  { studentId: '104', name: 'David' },
];

const mockAssessments = [
  {
    groupName: 'Group A',
    assessorId: '201',
    ratings: [
      { memberId: '101', cooperation: 4, conceptual: 5, practical: 3, workEthic: 4, feedback: { cooperation: 'Good', conceptual: 'Excellent' } },
      { memberId: '102', cooperation: 3, conceptual: 4, practical: 4, workEthic: 3, feedback: {} },
    ],
    createdAt: '2024-11-20T10:00:00Z',
  },
];

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/groups')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGroups),
      });
    }
    if (url.includes('/api/users')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      });
    }
    if (url.includes('/api/assessments')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAssessments),
      });
    }
    return Promise.reject(new Error('Invalid API call'));
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders DetailedView component with group and assessment data', async () => {
  render(
    <Router>
      <DetailedView />
    </Router>
  );

  // Check if loading text appears initially
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

  // Wait for groups to load
  const groupHeader = await screen.findByText(/Groups with Assessments/i);
  expect(groupHeader).toBeInTheDocument();

  // Verify groups are displayed
  expect(screen.getByText(/Group A/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Participants: 2/i)).toBeInTheDocument();

  // Verify assessment data for Group A
  expect(screen.getByText(/Assessments for this Group:/i)).toBeInTheDocument();
  expect(screen.getByText(/Alice/i)).toBeInTheDocument();
  expect(screen.getByText(/Bob/i)).toBeInTheDocument();
  expect(screen.getByText(/Good/i)).toBeInTheDocument();
  expect(screen.getByText(/Excellent/i)).toBeInTheDocument();
});

test('renders a message when no assessments are available', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // No groups
      })
    );

  render(
    <Router>
      <DetailedView />
    </Router>
  );

  const noAssessmentsMessage = await screen.findByText(/No assessments available for this group./i);
  expect(noAssessmentsMessage).toBeInTheDocument();
});

test('navigates back to the instructor dashboard on back button click', async () => {
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  render(
    <Router>
      <DetailedView />
    </Router>
  );

  // Wait for the back button to load
  const backButton = await screen.findByText(/Back to Dashboard/i);
  fireEvent.click(backButton);

  // Verify navigation to instructor dashboard
  expect(mockNavigate).toHaveBeenCalledWith('/instructor-dashboard');
});
