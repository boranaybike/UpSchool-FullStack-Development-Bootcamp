import './App.css';
import LoginPage from './pages/LoginPage.tsx';
import OrderPage from './pages/OrderPage.tsx';
import OrdersPage from './pages/OrdersPage.tsx';
import { Route, Routes } from 'react-router-dom';
import LiveLogPage from './pages/LiveLogPage.tsx';
import SocialLogin from './pages/SocialLogin.tsx';
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Dashboard from './components/Dashboard';
import { AppUserContext, LogCountContext } from './context/StateContext.tsx';
import { LocalUser } from './types/AuthTypes.ts';
import { useState } from 'react';
import SettingsPage from './pages/SettingsPage.tsx';


function App() {
  const [appUser, setAppUser] = useState<LocalUser | undefined>(undefined);
  const [logCount, setLogCount] = useState<number | undefined>(undefined)

  return (
    <AppUserContext.Provider value={{appUser, setAppUser}}>
      <LogCountContext.Provider value={{logCount, setLogCount}}>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/social-login" element={ <SocialLogin />} />
            <Route path="/" element={<ProtectedRoute><Dashboard><OrderPage /></Dashboard></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Dashboard><OrdersPage /></Dashboard></ProtectedRoute>} />
            <Route path="/live-log" element={<ProtectedRoute><Dashboard><LiveLogPage /></Dashboard></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Dashboard><SettingsPage /></Dashboard></ProtectedRoute>} />

          </Routes>
        </div>
        </LogCountContext.Provider>
    </AppUserContext.Provider>

  );
}

export default App;
