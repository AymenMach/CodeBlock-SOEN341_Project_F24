import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DetailedView from './DetailedView';

// Mock fetch to prevent actual API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), // Mock empty data
  })
);

// Mock alert to avoid crashes
global.alert = jest.fn();

describe('DetailedView Component', () => {
  test('renders loading state initially', () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    // Expect the loading message to be displayed
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders the header after loading', async () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    // Simulate fetch delay
    await screen.findByText(/Peer Assessments - Detailed View/i);

    // Expect the header to be present
    expect(screen.getByText(/Peer Assessments - Detailed View/i)).toBeInTheDocument();
  });
});
