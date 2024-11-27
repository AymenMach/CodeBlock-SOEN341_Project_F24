import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DetailedView from './DetailedView';

// Mock global fetch and alert
beforeAll(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/groups')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: '1', name: 'Group A', participants: ['123'] }]),
      });
    }
    if (url.includes('/api/users')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ studentId: '123', name: 'John Doe' }]),
      });
    }
    if (url.includes('/api/assessments')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }
    return Promise.reject(new Error('Unknown endpoint'));
  });

  global.alert = jest.fn(); // Mock alert to avoid breaking tests
});

afterAll(() => {
  jest.clearAllMocks();
});

describe('DetailedView Component', () => {
  test('renders the loading state initially', () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders header and group data after loading', async () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    // Wait for the header to appear
    await waitFor(() => {
      expect(screen.getByText(/Peer Assessments - Detailed View/i)).toBeInTheDocument();
    });

    // Wait for group data to appear
    await waitFor(() => {
      expect(screen.getByText(/Group A/i)).toBeInTheDocument();
    });
  });
});
