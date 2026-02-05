import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import ProfileSetup from './components/ProfileSetup';
import Home from './components/Home';
import SuggestCrops from './components/SuggestCrops';
import MarketTrends from './components/MarketTrends';
import ClimateRisk from './components/ClimateRisk';
// import History from './components/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/suggest" element={<SuggestCrops />} />
        <Route path="/market" element={<MarketTrends />} />
        <Route path="/climate" element={<ClimateRisk />} />
        {/* <Route path="/history" element={<History />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
