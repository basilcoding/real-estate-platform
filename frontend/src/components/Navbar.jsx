import { useAuthStore } from '../store/authStore';
import { LogOut, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // 1. Hook to get the current path

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // 2. Check if the current route is the homepage
  const isHomePage = location.pathname === '/';

  return (
    // 3. Conditionally apply Tailwind classes based on the route
    <nav 
      className={`navbar transition-colors duration-300 ${
        isHomePage 
          ? 'bg-transparent absolute top-0 z-50 w-full' 
          : 'bg-[#BFA15F] shadow-lg'
      }`}
      
    >
      <div className="flex-1">
        <button
          onClick={() => navigate('/')}
          // Optional: You might want to change text color on the homepage if the background is dark
          className={`btn btn-ghost text-xl gap-2 ${isHomePage ? 'text-white' : ''}`}
        >
          <Home size={24} />
          Real Estate
        </button>
      </div>
      <div className="flex-none gap-2">
        {isAuthenticated ? (
          <>
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </button>
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><span className="text-xs text-gray-500">{user?.email}</span></li>
                <li><span className="text-xs text-gray-600">Company Admin</span></li>
                <li>
                  <button onMouseDown={handleLogout} className="gap-2 w-full text-left text-base-content">
                    <LogOut size={18} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary btn-sm"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}