
import React from 'react';
import useUserStore from './store/userStore';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';

const App: React.FC = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return (
    <main className="bg-slate-900 text-white min-h-screen font-sans antialiased">
      {isAuthenticated ? <DashboardScreen /> : <LoginScreen />}
    </main>
  );
};

export default App;
