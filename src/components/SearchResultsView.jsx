import React from 'react';
import { Search, Tag } from 'lucide-react';
import TaskCard from './TaskCard';

export default function SearchResultsView({
  searchQuery,
  results,
  tabs,
  categories,
  onToggleComplete,
  onTogglePriority,
  onUpdateTaskTitle,
  onDeleteTask,
  onSelectTab
}) {
  const getTabAndCategoryName = (tabId, categoryId) => {
    const tabObj = tabs.find(t => t.id === tabId);
    const tabName = tabObj ? tabObj.name : tabId;
    const catList = categories[tabId] || [];
    const catObj = catList.find(c => c.id === categoryId);
    const catName = catObj ? catObj.name : categoryId;

    return { tabName, catName, tabId };
  };

  return (
    <div className="search-results-container" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Search size={18} className="text-indigo-600" />
        <h2 className="section-title" style={{ margin: 0 }}>
          Search Results for "{searchQuery}" ({results.length} found)
        </h2>
      </div>

      {results.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
          No matching tasks found across any tabs.
        </div>
      ) : (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '0.85rem' 
          }}
        >
          {results.map(task => {
            const { tabName, catName, tabId } = getTabAndCategoryName(task.tabId, task.categoryId);

            return (
              <div 
                key={`search-${task.id}`} 
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '10px', 
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                {/* Location Badge (Tab • Category) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <button 
                    onClick={() => onSelectTab(tabId)}
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      background: 'var(--bg-header)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'var(--accent-primary)',
                      cursor: 'pointer'
                    }}
                    title={`Jump to ${tabName} tab`}
                  >
                    <Tag size={10} />
                    <span>{tabName} • {catName}</span>
                  </button>
                </div>

                <TaskCard
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onTogglePriority={onTogglePriority}
                  onUpdateTaskTitle={onUpdateTaskTitle}
                  onDeleteTask={onDeleteTask}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
