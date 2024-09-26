import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  // Debounced save function
  const saveProjectsToLocalStorage = useCallback(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    const timeoutId = setTimeout(saveProjectsToLocalStorage, 300);
    return () => clearTimeout(timeoutId);
  }, [projects, saveProjectsToLocalStorage]);

  const addProject = useCallback((project) => {
    const fullProject = {
      id: project.id || Date.now(),
      name: project.name || 'Untitled',
      type: project.type || 'file',
      language: project.language || 'javascript',
      code: project.code || '// Start coding here\nconsole.log("Hello, World!");',
    };
    
    setProjects((prevProjects) => [...prevProjects, fullProject]);
  }, []);

  const updateProject = useCallback((updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? { ...project, ...updatedProject } : project
      )
    );
  }, []);

  const contextValue = useMemo(() => ({
    projects,
    addProject,
    updateProject,
  }), [projects, addProject, updateProject]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);