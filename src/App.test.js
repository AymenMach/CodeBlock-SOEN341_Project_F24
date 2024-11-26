import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './UserContext';
import App from './App';

test('renders the Peer Assessment System header', () => {
  render(
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );

  const headerElement = screen.getByText(/PEER ASSESSMENT SYSTEM/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders the Student and Instructor checkboxes', () => {
  render(
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );

  const studentCheckbox = screen.getByLabelText(/Student/i);
  const instructorCheckbox = screen.getByLabelText(/Instructor/i);
  expect(studentCheckbox).toBeInTheDocument();
  expect(instructorCheckbox).toBeInTheDocument();
});

test('shows login inputs when Student checkbox is selected', () => {
  render(
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );

  const studentCheckbox = screen.getByLabelText(/Student/i);
  fireEvent.click(studentCheckbox);

  const usernameInput = screen.getByPlaceholderText(/Username/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginButton = screen.getByText(/Enter/i);

  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});

test('shows login inputs when Instructor checkbox is selected', () => {
  render(
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );

  const instructorCheckbox = screen.getByLabelText(/Instructor/i);
  fireEvent.click(instructorCheckbox);

  const usernameInput = screen.getByPlaceholderText(/Username/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginButton = screen.getByText(/Enter/i);

  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});

test('navigates to the registration page when the register button is clicked', () => {
  render(
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );

  const studentCheckbox = screen.getByLabelText(/Student/i);
  fireEvent.click(studentCheckbox);

  const registerButton = screen.getByText(/Register/i);
  fireEvent.click(registerButton);

  expect(window.location.pathname).toBe('/register');
});

test('navigates to instructor dashboard when valid instructor credentials are submitted', async () => {
  const mockSetCurrentUser = jest.fn();

  render(
    <UserProvider value={{ setCurrentUser: mockSetCurrentUser }}>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );

  const instructorCheckbox = screen.getByLabelText(/Instructor/i);
  fireEvent.click(instructorCheckbox);

  const usernameInput = screen.getByPlaceholderText(/Username/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginButton = screen.getByText(/Enter/i);

  fireEvent.change(usernameInput, { target: { value: 'validInstructor' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(loginButton);

  // Simulate navigation and state updates
  expect(mockSetCurrentUser).toHaveBeenCalled();
});

test('navigates to student page when valid student credentials are submitted', async () => {
  const mockSetCurrentUser = jest.fn();

  render(
    <UserProvider value={{ setCurrentUser: mockSetCurrentUser }}>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );

  const studentCheckbox = screen.getByLabelText(/Student/i);
  fireEvent.click(studentCheckbox);

  const usernameInput = screen.getByPlaceholderText(/Username/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginButton = screen.getByText(/Enter/i);

  fireEvent.change(usernameInput, { target: { value: 'validStudent' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(loginButton);

  // Simulate navigation and state updates
  expect(mockSetCurrentUser).toHaveBeenCalled();
});
