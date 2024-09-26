import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PlusCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

const Navigation = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className={`py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Link to="/" className={`flex items-center ${darkMode ? 'text-white' : 'text-gray-900'} hover:text-indigo-500`}>
              <Home className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link to="/new-project" className={`flex items-center ${darkMode ? 'text-white' : 'text-gray-900'} hover:text-indigo-500`}>
              <PlusCircle className="h-5 w-5 mr-1" />
              New Project
            </Link>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'}`}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;