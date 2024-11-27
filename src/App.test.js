import App from './App';

test('renders the Peer Assessment System header', () => {
  render(
    <UserProvider>
      <Router> {/* Only a single Router is used */}
        <App />
      </Router>
    </UserProvider>
  );
  const headerElement = screen.getByText(/PEER ASSESSMENT SYSTEM/i);
  expect(headerElement).toBeInTheDocument();
  render(<App />);
});
