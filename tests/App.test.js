// testing for private route
const React = require('react');
const { render } = require('@testing-library/react');
const { BrowserRouter, Route, Routes } = require('react-router-dom');
const { useUser } = require('./UserContext'); 
const PrivateRoute = require('./App').PrivateRoute; 

jest.mock('./UserContext'); // Mock the UserContext

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should render children when the user is logged in', () => {
    const MockChild = () => React.createElement('div', null, 'Private Content');

    useUser.mockReturnValue({ currentUser: { username: 'testuser' } });

    const { getByText } = render(
      React.createElement(
        BrowserRouter,
        null,
        React.createElement(
          Routes,
          null,
          React.createElement(
            Route,
            { path: '/', element: React.createElement(PrivateRoute, null, React.createElement(MockChild, null)) }
          )
        )
      )
    );

    expect(getByText('Private Content')).toBeInTheDocument();
  });

  it('should redirect to the login page when the user is not logged in', () => {
    const MockChild = () => React.createElement('div', null, 'Private Content');
    const mockNavigate = jest.fn();

    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    useUser.mockReturnValue({ currentUser: null });

    render(
      React.createElement(
        BrowserRouter,
        null,
        React.createElement(
          Routes,
          null,
          React.createElement(
            Route,
            { path: '/', element: React.createElement(PrivateRoute, null, React.createElement(MockChild, null)) }
          )
        )
      )
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

