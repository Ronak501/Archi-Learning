import React, { useState, useMemo } from 'react';
import { MOCK_COURSE } from './constants';
import { Lesson, Module } from './types';
import { 
  Play, BookOpen, Code, FolderTree, MessageSquare, 
  CheckCircle, Zap, ChevronRight, LogOut
} from './components/Icons';
import { AITutor } from './components/AITutor';
import { InteractiveDiagram } from './components/InteractiveDiagram';
import { FolderTreeViewer } from './components/FolderTree';
import { CodeViewer } from './components/CodeViewer';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string>(MOCK_COURSE.modules[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string>(MOCK_COURSE.modules[0].lessons[0].id);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const activeModule = useMemo(() => 
    MOCK_COURSE.modules.find(m => m.id === activeModuleId) || MOCK_COURSE.modules[0],
  [activeModuleId]);

  const activeLesson = useMemo(() => 
    activeModule.lessons.find(l => l.id === activeLessonId) || activeModule.lessons[0],
  [activeModule, activeLessonId]);

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
  };

  const toggleLessonCompletion = (lessonId: string) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={16} />;
      case 'architecture': return <Zap size={16} />;
      case 'code': return <Code size={16} />;
      case 'folder': return <FolderTree size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ui-bg flex items-center justify-center p-4 font-sans">
        <div className="bg-ui-surface p-8 rounded-2xl shadow-xl border border-ui-border w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Zap size={28} className="text-white" />
            </div>
            <h1 className="font-extrabold text-3xl tracking-tight text-gray-900">Nexus<span className="text-brand-500">Academy</span></h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Sign in to your account</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                required 
                defaultValue="student@nexus.edu"
                className="w-full px-4 py-2.5 rounded-lg border border-ui-border bg-ui-bg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-gray-900" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required 
                defaultValue="password123"
                className="w-full px-4 py-2.5 rounded-lg border border-ui-border bg-ui-bg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-gray-900" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-lg transition-colors shadow-md shadow-brand-500/20 mt-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderLessonContent = (lesson: Lesson) => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="space-y-6">
            <div className="aspect-video bg-black rounded-xl border border-ui-border flex items-center justify-center relative overflow-hidden group shadow-sm">
              <img src={MOCK_COURSE.thumbnail} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button className="relative z-10 w-20 h-20 bg-brand-600/90 rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-brand-500 transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <Play size={32} className="ml-2" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-sm font-medium text-white">
                <span>{lesson.title}</span>
                <span>{lesson.duration}</span>
              </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{lesson.content.text}</p>
          </div>
        );
      case 'architecture':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">{lesson.content.text}</p>
            {lesson.content.diagram && <InteractiveDiagram data={lesson.content.diagram} />}
          </div>
        );
      case 'folder':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">{lesson.content.text}</p>
            {lesson.content.folderTree && <FolderTreeViewer data={lesson.content.folderTree} />}
          </div>
        );
      case 'code':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">{lesson.content.text}</p>
            {lesson.content.codeSnippets?.map((snippet, idx) => (
              <CodeViewer key={idx} snippet={snippet} />
            ))}
          </div>
        );
      default:
        return <p className="text-gray-700">{lesson.content.text}</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ui-bg text-gray-900 font-sans selection:bg-brand-500/30">
      
      {/* Top Navigation */}
      <header className="h-16 border-b border-ui-border bg-ui-surface/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center shadow-md shadow-brand-500/20">
            <Zap size={20} className="text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-gray-900">Nexus<span className="text-brand-500">Academy</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 bg-ui-bg px-3 py-1.5 rounded-full border border-ui-border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Course Progress: {Math.round((completedLessons.size / MOCK_COURSE.modules.reduce((acc, m) => acc + m.lessons.length, 0)) * 100)}%
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-10 h-10 rounded-full bg-ui-bg border border-ui-border flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-80 border-r border-ui-border bg-ui-surface/50 overflow-y-auto hidden md:block">
          <div className="p-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Course Content</h2>
            <div className="space-y-6">
              {MOCK_COURSE.modules.map((module, mIdx) => (
                <div key={module.id}>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-brand-500 text-sm">{mIdx + 1}.</span> {module.title}
                  </h3>
                  <div className="space-y-1 pl-4 border-l border-ui-border ml-2">
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLessonId;
                      const isCompleted = completedLessons.has(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonSelect(module.id, lesson.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-all duration-200 group
                            ${isActive 
                              ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                            }
                          `}
                        >
                          <div className={`mt-0.5 ${isActive ? 'text-brand-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
                            {isCompleted ? <CheckCircle size={16} className="text-emerald-500" /> : getLessonIcon(lesson.type)}
                          </div>
                          <span className="text-sm font-medium leading-snug">{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth bg-ui-bg">
          <div className="max-w-5xl mx-auto p-8 pb-32">
            
            {/* Breadcrumb & Title */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-3">
                <span>{activeModule.title}</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-500">{activeLesson.title}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{activeLesson.title}</h1>
            </div>

            {/* Dynamic Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderLessonContent(activeLesson)}
            </div>

            {/* Bottom Actions */}
            <div className="mt-12 pt-8 border-t border-ui-border flex items-center justify-between">
              <button 
                onClick={() => toggleLessonCompletion(activeLesson.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-sm
                  ${completedLessons.has(activeLesson.id) 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-ui-surface text-gray-700 border border-ui-border hover:bg-gray-50'
                  }
                `}
              >
                <CheckCircle size={20} />
                {completedLessons.has(activeLesson.id) ? 'Completed' : 'Mark as Complete'}
              </button>

              {/* Simple Next Button Logic (for demo) */}
              <button className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-semibold transition-colors shadow-md shadow-brand-500/20">
                Next Lesson
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Floating AI Tutor Button */}
      <button
        onClick={() => setIsAITutorOpen(true)}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-110 hover:bg-brand-500 transition-all z-40 ${isAITutorOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* AI Tutor Sidebar */}
      <AITutor 
        isOpen={isAITutorOpen} 
        onClose={() => setIsAITutorOpen(false)} 
        context={`${MOCK_COURSE.title} - ${activeModule.title} - ${activeLesson.title}`}
      />

    </div>
  );
}
