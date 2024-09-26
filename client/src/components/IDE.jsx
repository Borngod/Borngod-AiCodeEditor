import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MonacoEditor from './MonacoEditor';
import { analyzeCode } from '../services/geminiService';
import { PlayIcon, CommandLineIcon, CodeBracketIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useProjects } from './ProjectContext';
import { useTheme } from './ThemeContext';
import Navigation from './Navigation';

const IDE = () => {
  const { projectId } = useParams();
  const { projects, updateProject } = useProjects();
  const { darkMode } = useTheme();
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    // Wait until projects are loaded
    if (projects.length === 0) return;

    const project = projects.find(p => p.id === parseInt(projectId));
    if (project) {
      setCode(project.code || '');
      setLanguage(project.language || 'javascript');
      
      if (editorRef.current) {
        editorRef.current.setValue(project.code || '');
      }
    }
  }, [projectId, projects]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    updateProject({ id: parseInt(projectId), code: newCode });
  }, [projectId, updateProject]);


  useEffect(() => {
    const debounce = setTimeout(() => {
      if (code) {
        analyzeCode(code).then(setAnalysis);
        updateProject({ id: parseInt(projectId), code, language });
      }
    }, 1000);

    return () => clearTimeout(debounce);
  }, [code]);



  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    updateProject({ id: parseInt(projectId), language: newLanguage });
  }, [projectId, updateProject]);



  const askQuestion = async () => {
    if (userQuestion.trim() === '') return;
    
    setAiResponse('Thinking...');
    try {
      // You'll need to implement this function in your geminiService
      const response = await analyzeCode(code + '\n\nQuestion: ' + userQuestion);
      setAiResponse(response);
    } catch (error) {
      setAiResponse('Error: Unable to get a response. Please try again.');
    }
    setUserQuestion('');
  };

  const runCode = () => {
    if (language === 'javascript') {
      try {
        // Create a sandboxed environment for JavaScript execution
        const sandboxEnv = {
          console: {
            log: (...args) => setOutput(prev => prev + args.join(' ') + '\n'),
            error: (...args) => setOutput(prev => prev + 'Error: ' + args.join(' ') + '\n'),
            warn: (...args) => setOutput(prev => prev + 'Warning: ' + args.join(' ') + '\n')
          },
          setTimeout: setTimeout,
          setInterval: setInterval,
          clearTimeout: clearTimeout,
          clearInterval: clearInterval
        };

        // Clear previous output
        setOutput('');

        // Execute the code in the sandboxed environment
        const executeCode = new Function(...Object.keys(sandboxEnv), code);
        executeCode(...Object.values(sandboxEnv));

        // If no console.log was called, show the return value
        if (output === '') {
          const result = new Function(code)();
          if (result !== undefined) {
            setOutput(String(result));
          } else {
            setOutput('Code executed successfully, but did not produce any output.');
          }
        }
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
    } else {
      setOutput(`Code execution for ${language} is not supported in the browser. 
      \nTo run ${language} code, you would need a backend service or a local development environment.
      \nFor now, you can write and analyze ${language} code, but not execute it here.`);
    }
  };

  
  const MarkdownRenderer = ({ content }) => (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={darkMode ? vscDarkPlus : prism}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">AI-Enhanced IDE</h1>
          <div className="flex space-x-4 items-center">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={`px-3 py-2 rounded-md text-sm ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
              }`}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            <button
              onClick={runCode}
              className={`flex items-center px-4 py-2 rounded-md text-sm ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Run Code
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center`}>
                <CodeBracketIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Code Editor</span>
              </div>
              <MonacoEditor
                value={code || '// Start coding here'}
                onChange={handleCodeChange}
                language={language}
                theme={darkMode ? 'vs-dark' : 'vs-light'}
                editorDidMount={handleEditorDidMount}
              />
            </div>
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center`}>
                <CommandLineIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Output</span>
              </div>
              <div className="p-4">
                <pre className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{output}</pre>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <h2 className="text-lg font-medium">AI Analysis</h2>
              </div>
              <div className="p-4 prose prose-sm max-w-none">
                <MarkdownRenderer content={analysis} />
              </div>
            </div>
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center`}>
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">Ask AI</span>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Ask a question about your code..."
                    className={`flex-grow px-3 py-2 rounded-md text-sm ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                    onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                  />
                  <button
                    onClick={askQuestion}
                    className={`px-4 py-2 rounded-md text-sm ${
                      darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    Ask
                  </button>
                </div>
                <div className="prose prose-sm max-w-none">
                  <MarkdownRenderer content={aiResponse} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDE;