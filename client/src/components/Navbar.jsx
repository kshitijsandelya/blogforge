import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          BlogForge
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm font-medium transition-colors"
              >
                Write
              </Link>
              <Link to="/profile" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 text-sm font-medium transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setMenuOpen((p) => !p)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            {menuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-700 pt-3">
          {isAuthenticated ? (
            <>
              <Link to="/create" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-indigo-600">Write a Post</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile</Link>
              <button onClick={handleLogout} className="text-sm font-medium text-red-600 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 dark:text-gray-300">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-indigo-600">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
