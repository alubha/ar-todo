import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Moon, 
  Sun, 
  Calendar, 
  FolderPlus, 
  CheckCircle2
} from 'lucide-react';
import AuthModal from './components/AuthModal';
import WeeklyPlanner from './components/WeeklyPlanner';
import CategoryColumn from './components/CategoryColumn';
import CompletedModal from './components/CompletedModal';

// Default Initial Categories per Tab
const INITIAL_CATEGORIES = {
  personal: [
    { id: 'tech', name: 'Tech', color: '#06b6d4' },
    { id: 'clean', name: 'Clean', color: '#10b981' },
    { id: 'errands', name: 'Errands', color: '#f59e0b' },
    { id: 'health', name: 'Health', color: '#ec4899' }
  ],
  work: [
    { id: 'networking', name: 'Networking', color: '#8b5cf6' },
    { id: 'scheduling', name: 'Scheduling', color: '#6366f1' },
    { id: 'projects', name: 'Projects', color: '#3b82f6' },
    { id: 'followups', name: 'Follow-ups', color: '#14b8a6' }
  ],
  ap: [
    { id: 'finance', name: 'Finance & Bills', color: '#10b981' },
    { id: 'home', name: 'Home Maintenance', color: '#f97316' },
    { id: 'planning', name: 'Planning', color: '#a855f7' }
  ]
};

// Initial Sample Tasks
const INITIAL_TASKS = [
  {
    id: 't-1',
    title: 'Update laptop OS & backup critical files',
    tabId: 'personal',
    categoryId: 'tech',
    isHighPriority: true,
    scheduledDay: 'mon',
    isCompleted: false,
    completedAt: null
  },
  {
    id: 't-2',
    title: 'Deep clean kitchen counters & pantry',
    tabId: 'personal',
    categoryId: 'clean',
    isHighPriority: false,
    scheduledDay: 'sat',
    isCompleted: false,
    completedAt: null
  },
  {
    id: 't-3',
    title: 'Schedule Q3 strategy call with team',
    tabId: 'work',
    categoryId: 'scheduling',
    isHighPriority: true,
    scheduledDay: 'tue',
    isCompleted: false,
    completedAt: null
  },
  {
    id: 't-4',
    title: 'Reach out to 3 industry partners on LinkedIn',
    tabId: 'work',
    categoryId: 'networking',
    isHighPriority: false,
    scheduledDay: 'wed',
    isCompleted: false,
    completedAt: null
  },
  {
    id: 't-5',
    title: 'Review quarterly tax payment invoice',
    tabId: 'ap',
    categoryId: 'finance',
    isHighPriority: true,
    scheduledDay: 'thu',
    isCompleted: false,
    completedAt: null
  }
];

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('artodo_authenticated') === 'true';
  });

  // Active Tab State: 'personal' | 'work' | 'ap'
  const [activeTab, setActiveTab] = useState('personal');

  // Theme State: 'light' (default) | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('artodo_theme') || 'light';
  });

  // Collapsible Weekly Planner View State
  const [isPlannerExpanded, setIsPlannerExpanded] = useState(true);

  // Completed Archive Modal State
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('artodo_categories_v1');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Tasks State
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('artodo_tasks_v1');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // New Category Input State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);

  // Sync Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('artodo_theme', theme);
  }, [theme]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('artodo_categories_v1', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('artodo_tasks_v1', JSON.stringify(tasks));
  }, [tasks]);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('artodo_authenticated', 'true');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Task Handlers
  const handleAddTask = (categoryId, title) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      tabId: activeTab,
      categoryId,
      isHighPriority: false,
      scheduledDay: null,
      isCompleted: false,
      completedAt: null
    };
    setTasks(prev => [...prev, newTask]);
  };

  // Complete Task (disappears from both list & calendar view, archived with timestamp)
  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          isCompleted: true,
          completedAt: Date.now()
        };
      }
      return t;
    }));
  };

  // Restore Completed Task back to active lists
  const handleRestoreTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          isCompleted: false,
          completedAt: null
        };
      }
      return t;
    }));
  };

  // Clear Completed History
  const handleClearCompletedHistory = () => {
    setTasks(prev => prev.filter(t => !t.isCompleted));
  };

  // Priority toggle moves high priority tasks automatically to top of list
  const handleTogglePriority = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, isHighPriority: !t.isHighPriority };
      }
      return t;
    }));
  };

  // Inline Title Update (Reflects in both list and calendar view)
  const handleUpdateTaskTitle = (taskId, newTitle) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, title: newTitle };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Drag & Drop Handlers
  const handleDropTaskToCategory = (taskId, targetCategoryId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          categoryId: targetCategoryId,
          tabId: activeTab
        };
      }
      return t;
    }));
  };

  // Drag to Calendar View (Task remains in category list while also appearing in calendar day!)
  const handleDropTaskToDay = (taskId, targetDayKey) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          scheduledDay: targetDayKey
        };
      }
      return t;
    }));
  };

  // Category Handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      color: randomColor
    };

    setCategories(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newCat]
    }));

    setNewCategoryName('');
    setShowNewCatInput(false);
  };

  const handleDeleteCategory = (catId) => {
    setCategories(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter(c => c.id !== catId)
    }));
    setTasks(prev => prev.filter(t => t.categoryId !== catId));
  };

  const handleUpdateCategoryName = (catId, newName) => {
    setCategories(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(c => {
        if (c.id === catId) {
          return { ...c, name: newName };
        }
        return c;
      })
    }));
  };

  // Duplicate Week Feature
  const handleDuplicateWeek = () => {
    const scheduledTasks = tasks.filter(t => t.scheduledDay && !t.isCompleted);
    if (scheduledTasks.length === 0) return;

    const duplicatedTasks = scheduledTasks.map(t => ({
      ...t,
      id: `task-dup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${t.title} (Copy)`,
      isCompleted: false,
      completedAt: null
    }));

    setTasks(prev => [...prev, ...duplicatedTasks]);
  };

  // Completed Tasks Sorted by Most Recently Completed (Newest First)
  const completedTasksSorted = useMemo(() => {
    return tasks
      .filter(t => t.isCompleted)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  }, [tasks]);

  // Current Tab Categories & Tasks
  const currentCategories = useMemo(() => {
    return categories[activeTab] || [];
  }, [categories, activeTab]);

  const activeTabTasks = useMemo(() => {
    return tasks.filter(t => t.tabId === activeTab && !t.isCompleted);
  }, [tasks, activeTab]);

  // If not authenticated, render password lock screen
  if (!isAuthenticated) {
    return <AuthModal onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-brand">
          <img src="/ar_logo.png" alt="AR Logo" className="header-logo-img" />
          <h1 className="header-title">AR To Do</h1>
        </div>

        {/* 3 Main Tabs: Personal, Work, AP */}
        <nav className="header-tabs">
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <span>Personal</span>
            <span className="tab-count-badge">
              {tasks.filter(t => t.tabId === 'personal' && !t.isCompleted).length}
            </span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'work' ? 'active' : ''}`}
            onClick={() => setActiveTab('work')}
          >
            <span>Work</span>
            <span className="tab-count-badge">
              {tasks.filter(t => t.tabId === 'work' && !t.isCompleted).length}
            </span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'ap' ? 'active' : ''}`}
            onClick={() => setActiveTab('ap')}
          >
            <span>AP</span>
            <span className="tab-count-badge">
              {tasks.filter(t => t.tabId === 'ap' && !t.isCompleted).length}
            </span>
          </button>
        </nav>

        {/* Header Actions */}
        <div className="header-controls">
          {/* Completed Archive Button */}
          <button 
            className="action-btn-sm"
            onClick={() => setIsCompletedModalOpen(true)}
            title="View Completed Tasks Archive"
          >
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Completed ({completedTasksSorted.length})</span>
          </button>

          <button 
            className={`icon-btn ${isPlannerExpanded ? 'active-planner' : ''}`}
            onClick={() => setIsPlannerExpanded(prev => !prev)}
            title="Toggle Weekly Planning View"
          >
            <Calendar size={15} />
          </button>

          <button 
            className="icon-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>
      </header>

      {/* Main Body Area */}
      <main className="main-content">
        {/* ========================================================================= */}
        {/* WEEKLY PLANNING VIEW (7-DAY MONDAY THROUGH SUNDAY GRID)                  */}
        {/* ========================================================================= */}
        <WeeklyPlanner
          isExpanded={isPlannerExpanded}
          onToggleExpand={() => setIsPlannerExpanded(prev => !prev)}
          tasks={tasks.filter(t => !t.isCompleted)}
          onToggleComplete={handleToggleComplete}
          onTogglePriority={handleTogglePriority}
          onUpdateTaskTitle={handleUpdateTaskTitle}
          onDeleteTask={handleDeleteTask}
          onDropTaskToDay={handleDropTaskToDay}
          onDuplicateWeek={handleDuplicateWeek}
        />

        {/* ========================================================================= */}
        {/* CATEGORY COLUMNS GRID (HIGH PRIORITY TASKS SORTED AUTOMATICALLY TO TOP)    */}
        {/* ========================================================================= */}
        <section>
          <div className="categories-grid-header">
            <h2 className="section-title">
              {activeTab === 'personal' && 'Personal Categories'}
              {activeTab === 'work' && 'Work Categories'}
              {activeTab === 'ap' && 'AP Categories'}
            </h2>

            <button 
              className="action-btn-sm"
              onClick={() => setShowNewCatInput(prev => !prev)}
            >
              <FolderPlus size={13} />
              <span>Add Category</span>
            </button>
          </div>

          {/* New Category Inline Form */}
          {showNewCatInput && (
            <form onSubmit={handleAddCategory} className="add-task-form" style={{ marginTop: '0.65rem', maxWidth: '320px' }}>
              <input
                type="text"
                className="add-task-input"
                placeholder="Category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
              />
              <button type="submit" className="add-task-btn">
                <Plus size={14} />
              </button>
            </form>
          )}

          <div className="categories-container" style={{ marginTop: '0.85rem' }}>
            {currentCategories.map(cat => {
              // High Priority Tasks float automatically to the top of the column!
              const catTasks = activeTabTasks
                .filter(t => t.categoryId === cat.id)
                .sort((a, b) => (b.isHighPriority ? 1 : 0) - (a.isHighPriority ? 1 : 0));
              
              return (
                <CategoryColumn
                  key={cat.id}
                  category={cat}
                  tasks={catTasks}
                  onAddTask={handleAddTask}
                  onToggleComplete={handleToggleComplete}
                  onTogglePriority={handleTogglePriority}
                  onUpdateTaskTitle={handleUpdateTaskTitle}
                  onUpdateCategoryName={handleUpdateCategoryName}
                  onDeleteTask={handleDeleteTask}
                  onDropTaskToCategory={handleDropTaskToCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              );
            })}
          </div>
        </section>
      </main>

      {/* Completed Archive Modal */}
      <CompletedModal
        isOpen={isCompletedModalOpen}
        onClose={() => setIsCompletedModalOpen(false)}
        completedTasks={completedTasksSorted}
        categories={categories}
        onRestoreTask={handleRestoreTask}
        onClearCompletedHistory={handleClearCompletedHistory}
      />
    </div>
  );
}
