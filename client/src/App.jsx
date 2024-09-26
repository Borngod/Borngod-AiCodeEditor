import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './components/ProjectContext';
import WelcomePage from './components/WelcomePage';
import NewProject from './components/NewProject';
import IDE from './components/IDE';
import { ThemeProvider } from './components/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/ide/:projectId" element={<IDE />} />
          </Routes>
        </Router>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;