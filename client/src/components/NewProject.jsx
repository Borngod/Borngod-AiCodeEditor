import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import { useProjects } from './ProjectContext';
import { useTheme } from './ThemeContext';

const NewProject = () => {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('file');
  const [language, setLanguage] = useState('javascript');
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const { darkMode } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: Date.now(),
      name: projectName,
      type: projectType,
      language: projectType === 'file' ? language : null,
      code: projectType === 'file' ? getInitialCode(language) : null
    };
    console.log('Creating new project:', newProject);
    addProject(newProject);
    console.log('Project added, navigating to IDE');
    navigate('/ide/' + newProject.id);
  };

  const getInitialCode = (lang) => {
    switch (lang) {
      case 'javascript':
        return '// Start coding here\nconsole.log("Hello, World!");';
      case 'python':
        return '# Start coding here\nprint("Hello, World!")';
      case 'java':
        return 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}';
      default:
        return '// Start coding here';
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`max-w-md mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden`}>
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-semibold mb-6">Create New Project</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium">
                Project Type
              </label>
              <select
                id="projectType"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="file">File</option>
                <option value="folder">Folder</option>
              </select>
            </div>
            {projectType === 'file' && (
              <div>
                <label htmlFor="language" className="block text-sm font-medium">
                  Programming Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>
            )}
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <FolderPlus className="mr-2 h-5 w-5" />
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProject;