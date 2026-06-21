import { useAuthStore } from '../store/authStore';
import { LogOut, Home, Plus, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    // Blurs the screen, runs the animation for 1.2s, and logs them out
    await logout();
    // Redirects safely after the animation finishes
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav
      className={`navbar transition-colors duration-300 ${isHomePage
          ? 'bg-black/20 absolute top-0 z-50 w-full'
          : 'bg-[#BFA15F] shadow-lg'
        }`}
    >
      <div className="flex-1">
        <button
          onClick={() => navigate('/')}
          className={`flex text-xl gap-2 p-1.5 rounded-md transition-colors duration-300 hover:cursor-pointer hover:bg-black/20 ${isHomePage ? 'text-white' : ''}`}
        >
          <Home size={24} />
          <b>Easy Homes</b>
        </button>
      </div>
      <div className="flex-none gap-2">
        {isAuthenticated ? (
          <>
            {/* Admin Dashboard Link */}
            <button
              onClick={() => navigate('/admin')}
              className={`btn btn-sm btn-ghost gap-2 ${isHomePage ? 'text-white hover:bg-white/20' : 'hover:bg-black/10'}`}
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline font-semibold">Dashboard</span>
            </button>

            {/* Add Property Button */}
            <button
              onClick={() => navigate('/create-listing')}
              className={`btn btn-sm btn-ghost gap-2 ${isHomePage ? 'text-white hover:bg-white/20' : 'hover:bg-black/10'}`}
            >
              <Plus size={18} />
              <span className="hidden sm:inline font-semibold">Add Property</span>
            </button>

            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#BFA15F] text-sm font-bold">
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
            className={`btn ${isHomePage ? 'bg-transparent text-white hover:bg-white/20' : 'bg-[#BFA15F] text-white hover:bg-[#a88b4e]'} btn-sm border-white shadow-none`}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}