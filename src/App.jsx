import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Moon, 
  Sun, 
  Calendar, 
  FolderPlus, 
  CheckCircle2,
  Settings
} from 'lucide-react';
import AuthModal from './components/AuthModal';
import WeeklyPlanner from './components/WeeklyPlanner';
import CategoryColumn from './components/CategoryColumn';
import CompletedModal from './components/CompletedModal';
import TabSettingsModal from './components/TabSettingsModal';
import NewTabModal from './components/NewTabModal';

// Default Initial Tabs
const DEFAULT_TABS = [
  { id: 'personal', name: 'Personal' },
  { id: 'work', name: 'Work' },
  { id: 'ap', name: 'AP' }
];

// Default Initial Categories per Tab with Relevant Icons
const INITIAL_CATEGORIES = {
  personal: [
    { id: 'tech', name: 'Tech', icon: 'laptop', color: '#06b6d4' },
    { id: 'clean', name: 'Clean', icon: 'sparkles', color: '#10b981' },
    { id: 'errands', name: 'Errands', icon: 'shopping-bag', color: '#f59e0b' },
    { id: 'health', name: 'Health', icon: 'heart-pulse', color: '#ec4899' }
  ],
  work: [
    { id: 'networking', name: 'Networking', icon: 'users', color: '#8b5cf6' },
    { id: 'scheduling', name: 'Scheduling', icon: 'calendar', color: '#6366f1' },
    { id: 'projects', name: 'Projects', icon: 'folder-kanban', color: '#3b82f6' },
    { id: 'followups', name: 'Follow-ups', icon: 'check-square', color: '#14b8a6' }
  ],
  ap: [
    { id: 'finance', name: 'Finance & Bills', icon: 'dollar-sign', color: '#10b981' },
    { id: 'home', name: 'Home Maintenance', icon: 'home', color: '#f97316' },
    { id: 'planning', name: 'Planning', icon: 'compass', color: '#a855f7' }
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

  // Top-Level Tabs State
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem('artodo_tabs_v2');
    return saved ? JSON.parse(saved) : DEFAULT_TABS;
  });

  // Active Tab State
  const [activeTab, setActiveTab] = useState(() => tabs[0]?.id || 'personal');

  // Theme State: 'light' (default) | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('artodo_theme') || 'light';
  });

  // Collapsible Weekly Planner View State
  const [isPlannerExpanded, setIsPlannerExpanded] = useState(true);

  // Completed Archive Modal State
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Modals State
  const [isNewTabModalOpen, setIsNewTabModalOpen] = useState(false);
  const [isTabSettingsOpen, setIsTabSettingsOpen] = useState(false);

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

  // Archived Deleted Categories State
  const [archivedCategories, setArchivedCategories] = useState(() => {
    const saved = localStorage.getItem('artodo_archived_categories_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Archived Deleted Tabs State
  const [archivedTabs, setArchivedTabs] = useState(() => {
    const saved = localStorage.getItem('artodo_archived_tabs_v1');
    return saved ? JSON.parse(saved) : [];
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
    localStorage.setItem('artodo_tabs_v2', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('artodo_categories_v1', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('artodo_tasks_v1', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('artodo_archived_categories_v1', JSON.stringify(archivedCategories));
  }, [archivedCategories]);

  useEffect(() => {
    localStorage.setItem('artodo_archived_tabs_v1', JSON.stringify(archivedTabs));
  }, [archivedTabs]);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('artodo_authenticated', 'true');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Top Level Tab Handlers
  const handleCreateTab = (tabName) => {
    if (!tabName.trim()) return;

    const tabId = `tab-${Date.now()}`;
    const newTab = { id: tabId, name: tabName.trim() };

    setTabs(prev => [...prev, newTab]);
    setCategories(prev => ({ ...prev, [tabId]: [] }));
    setActiveTab(tabId);
  };

  const handleRenameTab = (tabId, newName) => {
    setTabs(prev => prev.map(t => {
      if (t.id === tabId) {
        return { ...t, name: newName };
      }
      return t;
    }));
  };

  const handleDeleteTab = (tabId) => {
    if (tabs.length <= 1) return; // Must keep at least 1 tab

    const tabToDelete = tabs.find(t => t.id === tabId);
    if (!tabToDelete) return;

    const tabCatList = categories[tabId] || [];
    const tabTaskList = tasks.filter(t => t.tabId === tabId);

    // Archive tab
    setArchivedTabs(prev => [...prev, { tab: tabToDelete, categories: tabCatList, tasks: tabTaskList }]);

    // Remove tab
    const remaining = tabs.filter(t => t.id !== tabId);
    setTabs(remaining);
    setTasks(prev => prev.filter(t => t.tabId !== tabId));
    setCategories(prev => {
      const copy = { ...prev };
      delete copy[tabId];
      return copy;
    });

    setActiveTab(remaining[0]?.id || 'personal');
  };

  const handleRestoreTab = (tabId) => {
    const archivedItem = archivedTabs.find(item => item.tab.id === tabId);
    if (!archivedItem) return;

    // Restore tab, categories, and tasks
    setTabs(prev => [...prev, archivedItem.tab]);
    setCategories(prev => ({
      ...prev,
      [tabId]: archivedItem.categories
    }));
    setTasks(prev => [...prev, ...archivedItem.tasks]);

    // Remove from archivedTabs
    setArchivedTabs(prev => prev.filter(item => item.tab.id !== tabId));
    setActiveTab(tabId);
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

  // Complete Task
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
    const taskToRestore = tasks.find(t => t.id === taskId);
    if (!taskToRestore) return;

    // Check if task's category was deleted and exists in archivedCategories
    const archivedCatItem = archivedCategories.find(c => c.category.id === taskToRestore.categoryId);
    if (archivedCatItem) {
      handleRestoreCategory(archivedCatItem.category.id);
    }

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

  // Inline Title Update
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

    const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];
    const icons = ['tag', 'star', 'sparkles', 'bookmark', 'coffee', 'zap', 'target'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      icon: randomIcon,
      color: randomColor
    };

    setCategories(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newCat]
    }));

    setNewCategoryName('');
    setShowNewCatInput(false);
  };

  // Delete Category
  const handleDeleteCategory = (catId) => {
    const catList = categories[activeTab] || [];
    const catToDelete = catList.find(c => c.id === catId);
    if (!catToDelete) return;

    const catTasks = tasks.filter(t => t.categoryId === catId);

    setArchivedCategories(prev => [
      ...prev,
      { category: catToDelete, tabId: activeTab, tasks: catTasks }
    ]);

    setCategories(prev => ({
      ...prev,
      [activeTab]: catList.filter(c => c.id !== catId)
    }));

    setTasks(prev => prev.filter(t => t.categoryId !== catId));
  };

  // Restore Deleted Category & Sub-tasks
  const handleRestoreCategory = (catId) => {
    const archivedItem = archivedCategories.find(item => item.category.id === catId);
    if (!archivedItem) return;

    const targetTabId = archivedItem.tabId;

    if (!tabs.some(t => t.id === targetTabId)) {
      setTabs(prev => [...prev, { id: targetTabId, name: targetTabId.toUpperCase() }]);
    }

    setCategories(prev => ({
      ...prev,
      [targetTabId]: [...(prev[targetTabId] || []), archivedItem.category]
    }));

    setTasks(prev => [...prev, ...archivedItem.tasks]);

    setArchivedCategories(prev => prev.filter(item => item.category.id !== catId));
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

  const handleUpdateCategoryIcon = (catId, { icon, color }) => {
    setCategories(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(c => {
        if (c.id === catId) {
          return { ...c, icon: icon || c.icon, color: color || c.color };
        }
        return c;
      })
    }));
  };

  // Active Tab Object
  const currentTabObj = useMemo(() => {
    return tabs.find(t => t.id === activeTab) || tabs[0];
  }, [tabs, activeTab]);

  // Completed Tasks Sorted
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

        {/* Clean Top-Level Tabs (No X buttons!) */}
        <nav className="header-tabs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.name}</span>
              <span className="tab-count-badge">
                {tasks.filter(t => t.tabId === tab.id && !t.isCompleted).length}
              </span>
            </button>
          ))}

          {/* Add New Tab Plus Button */}
          <button 
            className="action-btn-sm" 
            onClick={() => setIsNewTabModalOpen(true)}
            title="Create New Top-Level Tab"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          >
            <Plus size={14} />
          </button>
        </nav>

        {/* Header Actions */}
        <div className="header-controls">
          {/* Completed Archive Button */}
          <button 
            className="action-btn-sm"
            onClick={() => setIsCompletedModalOpen(true)}
            title="View Completed Tasks & Archive"
          >
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Archive ({completedTasksSorted.length + archivedCategories.length + archivedTabs.length})</span>
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
        />

        {/* ========================================================================= */}
        {/* CATEGORY COLUMNS GRID (TAB SETTINGS GEAR & CATEGORY MANAGEMENT)           */}
        {/* ========================================================================= */}
        <section>
          <div className="categories-grid-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 className="section-title">
                {currentTabObj?.name} Categories
              </h2>

              {/* Tab Settings Gear Icon */}
              <button
                className="task-action-btn"
                onClick={() => setIsTabSettingsOpen(true)}
                title={`Configure Tab "${currentTabObj?.name}"`}
                style={{ padding: '3px 5px' }}
              >
                <Settings size={15} />
              </button>
            </div>

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
                  onUpdateCategoryIcon={handleUpdateCategoryIcon}
                  onDeleteTask={handleDeleteTask}
                  onDropTaskToCategory={handleDropTaskToCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              );
            })}
          </div>
        </section>
      </main>

      {/* New Tab Modal */}
      <NewTabModal
        isOpen={isNewTabModalOpen}
        onClose={() => setIsNewTabModalOpen(false)}
        onCreateTab={handleCreateTab}
      />

      {/* Tab Settings Modal (Rename & Delete Tab) */}
      <TabSettingsModal
        isOpen={isTabSettingsOpen}
        onClose={() => setIsTabSettingsOpen(false)}
        tab={currentTabObj}
        canDelete={tabs.length > 1}
        onRenameTab={handleRenameTab}
        onDeleteTab={handleDeleteTab}
      />

      {/* Completed & Archives Modal */}
      <CompletedModal
        isOpen={isCompletedModalOpen}
        onClose={() => setIsCompletedModalOpen(false)}
        completedTasks={completedTasksSorted}
        categories={categories}
        archivedCategories={archivedCategories}
        archivedTabs={archivedTabs}
        onRestoreTask={handleRestoreTask}
        onRestoreCategory={handleRestoreCategory}
        onRestoreTab={handleRestoreTab}
        onClearCompletedHistory={handleClearCompletedHistory}
      />
    </div>
  );
}
