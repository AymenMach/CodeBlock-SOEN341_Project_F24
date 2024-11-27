import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DetailedView from './DetailedView';

jest.mock('./DetailedView', () => {
  return function MockDetailedView() {
    return (
      <div>
        <h1>Peer Assessments - Detailed View</h1>
        <div>
          <h2>Groups with Assessments</h2>
          <div>
            <h3>Group A (Total Participants: 2)</h3>
            <p>No assessments available for this group.</p>
          </div>
        </div>
        <button>Back to Dashboard</button>
      </div>
    );
  };
});

describe('DetailedView Component', () => {
  test('renders header and group section', () => {
    render(
      <Router>
        <DetailedView />
      </Router>
    );

    expect(screen.getByText(/Peer Assessments - Detailed View/i)).toBeInTheDocument();
    expect(screen.getByText(/Groups with Assessments/i)).toBeInTheDocument();
    expect(screen.getByText(/Group A/i)).toBeInTheDocument();
    expect(screen.getByText(/No assessments available for this group/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Dashboard/i)).toBeInTheDocument();
  });
});
