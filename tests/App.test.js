// testing for private route

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider, useUser } from './UserContext'; 
import PrivateRoute from './App'; 

jest.mock('./UserContext'); // Mock the UserContext

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should render children when the user is logged in', () => {
    const MockChild = () => <div>Private Content</div>;

    useUser.mockReturnValue({ currentUser: { username: 'testuser' } });

    render(
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute><MockChild /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    );

    expect(screen.getByText('Private Content')).toBeInTheDocument();
  });

  it('should redirect to the login page when the user is not logged in', () => {
    const MockChild = () => <div>Private Content</div>;
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    useUser.mockReturnValue({ currentUser: null });

    render(
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute><MockChild /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

