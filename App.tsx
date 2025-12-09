import React, { useState, useEffect } from 'react';
import { User, VisitLog } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Account } from './pages/Account';
import { VisitForm } from './pages/VisitForm';
import { sheetService } from './services/sheetService';

const USER_KEY = 'ATTRON_USER_SESSION';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'history' | 'account'>('home');
  const [selectedVisit, setSelectedVisit] = useState<VisitLog | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Load session
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Poll pending count when user is logged in
  useEffect(() => {
      if (!user) return;
      
      const checkPending = async () => {
          try {
              const pending = await sheetService.getPendingVisits(user.email);
              setPendingCount(pending.length);
          } catch(e) { console.error(e); }
      };
      
      checkPending();
      // Also grab active visit state here if we wanted to sync better, 
      // but for now pending count is sufficient.
      const interval = setInterval(checkPending, 5000);
      return () => clearInterval(interval);
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    setCurrentTab('home');
    setSelectedVisit(null);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const handleOpenVisit = (visit: VisitLog) => {
    setSelectedVisit(visit);
    window.scrollTo(0, 0);
  };

  const handleBackFromForm = () => {
    setSelectedVisit(null);
  };

  const handleOpenPendingList = () => {
      setCurrentTab('history');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // If a form is open, it overlays everything (full screen modal style)
  if (selectedVisit) {
      return (
          <div className="min-h-screen bg-black">
            <Header user={user} onLogout={handleLogout} />
            <main className="container mx-auto px-4 py-6">
                <VisitForm 
                    visit={selectedVisit} 
                    onBack={handleBackFromForm}
                    onSave={handleBackFromForm}
                />
            </main>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4">
        {currentTab === 'home' && (
          <Home user={user} onOpenPendingList={handleOpenPendingList} />
        )}
        
        {currentTab === 'history' && (
          <History user={user} onOpenVisit={handleOpenVisit} />
        )}

        {currentTab === 'account' && (
          <Account user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
        )}
      </main>

      <BottomNav 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
        pendingCount={pendingCount}
      />
    </div>
  );
}

export default App;