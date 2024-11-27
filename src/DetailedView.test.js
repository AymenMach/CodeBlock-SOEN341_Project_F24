import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DetailedView from './DetailedView';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), 
  })
);

// Mock alert to avoid crashes
global.alert = jest.fn();

describe('DetailedView Component', () => {
  test('renders loading state', () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    // Check for loading text
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders the header', async () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    // Check for header text
    expect(await screen.findByText(/Peer Assessments - Detailed View/i)).toBeInTheDocument();
  });
});

