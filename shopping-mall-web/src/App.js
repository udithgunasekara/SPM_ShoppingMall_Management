import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Dashboard from './pages/Dashboard';
import Promotions from './pages/Promotions';
import Events from './pages/Events';
import { AppProvider } from './context/AppContext';
import useWindowSize from './hooks/useWindowSize';
import Giftcard from './pages/Giftcard';

const App = () => {
  const { isMobile } = useWindowSize();

  return (
    <AppProvider>
      <Router>
        <div className="App">
          <NavBar isMobile={isMobile} />
          <div className="container mx-auto pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/events" element={<Events />} />
              <Route path="/giftcard" element={<Giftcard/>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
