// ─── APP ROOT ─────────────────────────────────────────────────────────────────
// Route config lives here. Add/remove pages by editing this file only.

import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Nav from './components/nav/Nav.jsx';

// Pages — add/remove freely
import HomePage       from './pages/HomePage.jsx';
import AboutPage      from './pages/AboutPage.jsx';
import PitchPage      from './pages/PitchPage.jsx';
import PlanPage       from './pages/PlanPage.jsx';
import FinancialsPage from './pages/FinancialsPage.jsx';
import DownloadsPage  from './pages/DownloadsPage.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Nav />
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/about"      element={<AboutPage />} />
          <Route path="/pitch"      element={<PitchPage />} />
          <Route path="/plan"       element={<PlanPage />} />
          <Route path="/financials" element={<FinancialsPage />} />
          <Route path="/downloads"  element={<DownloadsPage />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
