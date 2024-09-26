import React from 'react';
import { Link } from 'react-router-dom';
import { FileCode2, Folder, Trash2 } from 'lucide-react';
import { useProjects } from './ProjectContext';
import { useTheme } from './ThemeContext';

const getFileIcon = (type, language) => {
  if (type === 'folder') return <Folder className="h-6 w-6 text-yellow-500" />;
  
  switch (language) {
    case 'python':
      return <FileCode2 className="h-6 w-6 text-blue-500" />;
    case 'javascript':
      return <FileCode2 className="h-6 w-6 text-yellow-400" />;
    case 'java':
      return <FileCode2 className="h-6 w-6 text-red-500" />;
    default:
      return <FileCode2 className="h-6 w-6 text-gray-500" />;
  }
};

const ProjectList = () => {
  const { projects, updateProject } = useProjects();
  const { darkMode } = useTheme();

  const handleDelete = (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      updateProject({ id: projectId, deleted: true });
    }
  };

  const activeProjects = projects.filter(project => !project.deleted);

  return (
    <ul className="space-y-2">
      {activeProjects.map((project) => (
        <li key={project.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-102 hover:shadow-md`}>
          <Link 
            to={`/ide/${project.id}`} 
            className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center space-x-4 flex-1">
              {getFileIcon(project.type, project.language)}
              <div className="flex-1 min-w-0">
                <p className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                  {project.name}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                  {project.type === 'file' ? `Language: ${project.language}` : 'Folder'}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => handleDelete(e, project.id)}
              className={`p-2 rounded-full hover:${darkMode ? 'bg-red-900' : 'bg-red-100'} transition duration-150 ease-in-out`}
              aria-label="Delete project"
            >
              <Trash2 className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            </button>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;