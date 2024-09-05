import React from 'react';
import Dashboard from './pages/Dashboard';
import { AppProvider } from './context/AppContext';

const App = () => {
  return (
    <AppProvider>
      <div className="App">
        <Dashboard />
      </div>
    </AppProvider>
  );
};

export default App;