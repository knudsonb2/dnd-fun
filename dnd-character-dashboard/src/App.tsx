import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Character from './components/character/Character';
import Campaign from './components/campaign/Campaign';
import EncounterBuilder from './components/tools/EncounterBuilder';
import CombatTracker from './components/tools/CombatTracker';
import DiceRoller from './components/tools/DiceRoller';
import Navigation from './components/Navigation';
import FantasyAtmosphere from './components/FantasyAtmosphere';
import { loadCharacters } from './utils/storage';
import './App.css';

const getRouterBasename = (): string => {
  const previewMatch = window.location.pathname.match(/^\/__preview\/\d+/);
  return previewMatch ? previewMatch[0] : '/';
};

function App() {
  const characters = loadCharacters();
  const basename = getRouterBasename();

  return (
    <Router basename={basename}>
      <div className="App">
        <FantasyAtmosphere />
        <Navigation />
        <main className="app-main">
          <div className="app-shell">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/character" element={<Character />} />
              <Route path="/campaign" element={<Campaign />} />
              <Route path="/encounters" element={<EncounterBuilder characters={characters} />} />
              <Route path="/combat" element={<CombatTracker characters={characters} />} />
              <Route path="/dice" element={<DiceRoller />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
