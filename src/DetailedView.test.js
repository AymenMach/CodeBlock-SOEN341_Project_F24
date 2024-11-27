import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DetailedView from './DetailedView';

// Mock fetch globally
beforeAll(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/groups')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: '1', name: 'Group A', participants: ['123'] }]),
      });
    } else if (url.includes('/api/users')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ studentId: '123', name: 'John Doe' }]),
      });
    } else if (url.includes('/api/assessments')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // No assessments for simplicity
      });
    }
    return Promise.reject(new Error('Unknown endpoint'));
  });

  global.alert = jest.fn(); // Mock alert to avoid errors
});

afterAll(() => {
  jest.clearAllMocks(); // Cleanup mocks
});

describe('DetailedView Component', () => {
  test('renders loading state initially', () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders header after loading data', async () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    const header = await screen.findByText(/Peer Assessments - Detailed View/i);
    expect(header).toBeInTheDocument();
  });

  test('renders group information after loading', async () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    // Wait for the group name to appear
    const groupName = await screen.findByText(/Group A/i);
    expect(groupName).toBeInTheDocument();
  });
});
