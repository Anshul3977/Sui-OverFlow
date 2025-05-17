import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Collection from './pages/Collection';
import TeamBuilder from './pages/TeamBuilder';
import Leagues from './pages/Leagues';
import Marketplace from './pages/Marketplace';
import Staking from './pages/Staking';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/team-builder" element={<TeamBuilder />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;