import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { LogOut, User, Settings, HelpCircle } from 'lucide-react';
import AnimatedNav from './AnimatedNav';
import Footer from './Footer';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import kloudracLogo from 'figma:asset/d1445a74392c9eb12dc32c8bcc15d13bbad6f2a3.png';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState('');

  // Sync activeTab with current route
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'home';
    // Don't set bookings as active if we're on a booking details page
    if (path === 'bookings' && location.pathname.includes('BKG-')) {
      setActiveTab('bookings');
    } else {
      setActiveTab(path || 'home');
    }
  }, [location]);

  // Get user info from state or session
  useEffect(() => {
    const storedUserName = sessionStorage.getItem('userName') || 'Guest';
    setUserName(storedUserName);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab === 'home' ? '' : tab}`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"></div>
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={kloudracLogo} alt="KLOUDRAC" className="h-10 cursor-pointer" onClick={() => handleTabChange('home')} />
              <div className="h-10 w-px bg-gray-700"></div>
              <div>
                <p className="text-white">Customer Portal</p>
                <p className="text-gray-400 text-xs">Real Estate Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-400 text-sm">Welcome back,</p>
                <p className="text-white">{userName || 'Guest'}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                    <span className="text-white">
                      {userName ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'G'}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-gray-800 text-white" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-800">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-800">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-800">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-gray-800 text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <AnimatedNav activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
