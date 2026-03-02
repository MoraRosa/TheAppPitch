// ─── APP ROOT ─────────────────────────────────────────────────────────────────
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Nav from './components/nav/Nav.jsx';
import Footer from './components/footer/Footer.jsx';
import BottomNav, { BOTTOM_NAV_HEIGHT } from './components/bottomnav/BottomNav.jsx';
import { useIsMobile } from './hooks/useIsMobile.js';

import HomePage       from './pages/HomePage.jsx';
import AboutPage      from './pages/AboutPage.jsx';
import PitchPage      from './pages/PitchPage.jsx';
import PlanPage       from './pages/PlanPage.jsx';
import FinancialsPage from './pages/FinancialsPage.jsx';
import DownloadsPage  from './pages/DownloadsPage.jsx';

function AppShell() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  // No footer on pitch page (fullscreen presenter conflict)
  const showFooter = pathname !== '/pitch';

  return (
    <>
      <Nav />
      {/* Bottom nav padding wrapper — pushes page content above the tab bar */}
      <div style={{ paddingBottom: isMobile ? BOTTOM_NAV_HEIGHT : '0' }}>
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/about"      element={<AboutPage />} />
          <Route path="/pitch"      element={<PitchPage />} />
          <Route path="/plan"       element={<PlanPage />} />
          <Route path="/financials" element={<FinancialsPage />} />
          <Route path="/downloads"  element={<DownloadsPage />} />
        </Routes>
        {showFooter && <Footer />}
      </div>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </ThemeProvider>
  );
}
