import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { LogOut } from 'lucide-react'; // 👈 Import icon for animation
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateListingPage from './pages/CreateListingPage';
import ProtectedRoute from './components/ProtectedRoute';
import ListingDetailPage from './pages/ListingDetailPage';
import EditListingPage from './pages/EditListingPage';
import PropertiesPage from './pages/PropertiesPage';
import AdminPropertiesPage from './pages/AdminPropertiesPage';
import FloatingContact from './components/FloatingContact'; // Import the component

export default function App() {
  // 👈 Extract isLoggingOut
  const { checkAuth, isCheckingAuth, isLoggingOut } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-50">
        <span className="loading loading-spinner loading-lg text-[#BFA15F]"></span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-50 relative">

        {/* 👇 FULL-SCREEN LOGOUT ANIMATION OVERLAY */}
        {isLoggingOut && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 bg-[#BFA15F] rounded-full flex items-center justify-center mb-6 shadow-xl">
                <LogOut size={32} className="text-white ml-1" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-wider uppercase">Signing Out</h2>
              <p className="text-gray-500 mt-2 font-medium tracking-wide">Securing your session...</p>
            </div>
          </div>
        )}
        <FloatingContact />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute>
                <CreateListingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPropertiesPage /></ProtectedRoute>} />
          <Route path="/edit-listing/:id" element={<ProtectedRoute><EditListingPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}