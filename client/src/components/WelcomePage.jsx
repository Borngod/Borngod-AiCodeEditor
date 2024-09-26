import React from 'react';
import { Link } from 'react-router-dom';
import ProjectList from './ProjectList';
import { PlusCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

const WelcomePage = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">
            AI-Enhanced IDE
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-800'}`}
          >
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
        <p className={`mt-5 max-w-xl text-xl ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Boost your coding productivity with AI-powered analysis and suggestions.
        </p>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className={`overflow-hidden shadow rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
                <ProjectList />
              </div>
            </div>
            <div className={`overflow-hidden shadow rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Start a new coding journey with AI assistance.</p>
                <Link
                  to="/new-project"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;