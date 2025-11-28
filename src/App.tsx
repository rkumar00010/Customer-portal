import { useState } from 'react';
import { RouterProvider } from 'react-router';
import LoginPage from './components/LoginPage';
import { router } from './utils/routes';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Extract name from email for demo purposes
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    sessionStorage.setItem('userName', name);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <RouterProvider router={router} />;
}