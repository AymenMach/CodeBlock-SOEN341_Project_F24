import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ListOfStudentsPage from './ListOfStudentsPage';

// Mock `fetch`
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { _id: '1', studentId: '123', name: 'Alice' },
        { _id: '2', studentId: '456', name: 'Bob' },
      ]),
  })
);

describe('ListOfStudentsPage Component', () => {
  beforeEach(() => {
    fetch.mockClear(); // Clear fetch mock calls before each test
  });

  test('renders the component with a table of students', async () => {
    render(
      <Router>
        <ListOfStudentsPage />
      </Router>
    );

    // Verify the loading state
    expect(screen.getByText(/list of all students/i)).toBeInTheDocument();

    // Wait for data to load
    const studentName = await screen.findByText(/Alice/i);
    expect(studentName).toBeInTheDocument();

    // Check for the second student
    const secondStudentName = screen.getByText(/Bob/i);
    expect(secondStudentName).toBeInTheDocument();
  });

  test('displays "No students found" when no students are available', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // Mock an empty response
      })
    );

    render(
      <Router>
        <ListOfStudentsPage />
      </Router>
    );

    // Wait for the "No students found" message
    const noStudentsMessage = await screen.findByText(/no students found/i);
    expect(noStudentsMessage).toBeInTheDocument();
  });

  test('sorts students by name in ascending order', async () => {
    render(
      <Router>
        <ListOfStudentsPage />
      </Router>
    );

    // Wait for data to load
    await screen.findByText(/Alice/i);

    // Sort by name (Z-A)
    fireEvent.change(screen.getByDisplayValue(/sort by name \(a-z\)/i), {
      target: { value: 'desc' },
    });

    // Verify sorting order
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Bob');
    expect(rows[2]).toHaveTextContent('Alice');
  });

  test('sorts students by ID in descending order', async () => {
    render(
      <Router>
        <ListOfStudentsPage />
      </Router>
    );

    // Wait for data to load
    await screen.findByText(/Alice/i);

    // Sort by ID (Descending)
    fireEvent.change(screen.getByDisplayValue(/sort by id \(ascending\)/i), {
      target: { value: 'desc' },
    });

    // Verify sorting order
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('456');
    expect(rows[2]).toHaveTextContent('123');
  });

  test('refreshes the student list', async () => {
    render(
      <Router>
        <ListOfStudentsPage />
      </Router>
    );

    // Wait for data to load
    await screen.findByText(/Alice/i);

    // Simulate clicking the refresh button
    fireEvent.click(screen.getByText(/refresh/i));

    // Wait for fetch to be called again
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
