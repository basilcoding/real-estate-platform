import { useAuthStore } from '../store/authStore';
import { LogOut, Home } from 'lucide-react';
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
            className={`btn ${isHomePage ? 'bg-transparent' : ' bg-[#BFA15F]'} btn-sm border-white shadow-none`}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}