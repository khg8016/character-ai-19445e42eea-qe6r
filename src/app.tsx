import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { PrototypesSection } from './components/PrototypesSection';
import { ProfileSettings } from './pages/ProfileSettings';
import { LandingPage } from './pages/LandingPage';
import { Credits } from './pages/Credits';
import { CreditsSuccess } from './pages/CreditsSuccess';
import { ExpertDashboard } from './pages/ExpertDashboard';
import { PurchasedPrototypesPage } from './pages/PurchasedPrototypesPage';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './components/auth/AuthContext';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const { user } = useAuth();

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onAuthClick={() => setIsAuthModalOpen(true)} />
        <Routes>
          <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
          <Route path="/prototypes" element={<PrototypesSection />} />
          <Route path="/prototypes/:id" element={<PrototypesSection />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/credits/success" element={<CreditsSuccess />} />
          <Route path="/expert/dashboard" element={<ExpertDashboard />} />
          <Route 
            path="/profile/settings" 
            element={user ? <ProfileSettings /> : <LandingPage onGetStarted={handleGetStarted} />} 
          />
          <Route 
            path="/profile/prototypes" 
            element={user ? <PurchasedPrototypesPage /> : <LandingPage onGetStarted={handleGetStarted} />} 
          />
        </Routes>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;