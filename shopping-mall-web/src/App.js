// src/Routes.js or src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Other routes */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
