import React from 'react';
import { CheckCircle2, RotateCcw, ArrowLeft, Trash2, FolderArchive, Layers } from 'lucide-react';

const TAB_LABELS = {
  personal: 'Personal',
  work: 'Work',
  ap: 'AP'
};

export default function CompletedModal({ 
  isOpen, 
  onClose, 
  completedTasks, 
  categories,
  archivedCategories = [],
  archivedTabs = [],
  onRestoreTask,
  onRestoreCategory,
  onRestoreTab,
  onClearCompletedHistory 
}) {
  if (!isOpen) return null;

  // Format friendly completion timestamp
  const formatTime = (ts) => {
    if (!ts) return 'Recently';
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
  };

  // Helper to find Category Name
  const getOriginTagLabel = (task) => {
    const tabName = TAB_LABELS[task.tabId] || task.tabId || 'Personal';
    const tabCatList = categories && categories[task.tabId] ? categories[task.tabId] : [];
    const cat = tabCatList.find(c => c.id === task.categoryId);
    const catName = cat ? cat.name : task.categoryId || 'General';
    return `${tabName} • ${catName}`;
  };

  return (
    <div className="completed-page-overlay">
      {/* Full-Screen Page Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="action-btn-sm"
            onClick={onClose}
            title="Back to Dashboard"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
            <CheckCircle2 size={20} className="text-emerald-600" />
            <h1 className="header-title" style={{ fontSize: '1.2rem' }}>
              Archive & Completed History
            </h1>
          </div>
        </div>

        {completedTasks.length > 0 && (
          <button 
            className="action-btn-sm"
            onClick={onClearCompletedHistory}
            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
          >
            <Trash2 size={14} />
            <span>Clear Completed History</span>
          </button>
        )}
      </header>

      {/* Full-Screen Content Area */}
      <main className="main-content" style={{ padding: '1.5rem 1.75rem 3rem 1.75rem', maxWidth: '1050px', margin: '0 auto', width: '100%' }}>
        
        {/* ========================================================================= */}
        {/* SECTION 1: DELETED TOP-LEVEL TABS ARCHIVE                                 */}
        {/* ========================================================================= */}
        {archivedTabs.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Layers size={18} className="text-purple-600" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Deleted Top-Level Tabs ({archivedTabs.length})</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {archivedTabs.map(item => (
                <div 
                  key={item.tab.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.tab.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {item.categories.length} categories, {item.tasks.length} tasks
                    </div>
                  </div>

                  <button 
                    className="action-btn-sm"
                    onClick={() => onRestoreTab(item.tab.id)}
                    title="Restore tab and all its categories & tasks"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                  >
                    <RotateCcw size={13} />
                    <span>Restore Tab</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: DELETED CATEGORIES ARCHIVE                                     */}
        {/* ========================================================================= */}
        {archivedCategories.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <FolderArchive size={18} className="text-indigo-600" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Deleted Categories ({archivedCategories.length})</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {archivedCategories.map(item => (
                <div 
                  key={item.category.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.category.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Tab: {TAB_LABELS[item.tabId] || item.tabId} • {item.tasks.length} tasks
                    </div>
                  </div>

                  <button 
                    className="action-btn-sm"
                    onClick={() => onRestoreCategory(item.category.id)}
                    title="Restore category and all its tasks"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                  >
                    <RotateCcw size={13} />
                    <span>Restore Category</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: COMPLETED TASKS LIST                                           */}
        {/* ========================================================================= */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={18} className="text-emerald-600" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Completed Tasks ({completedTasks.length})</h2>
          </div>

          {completedTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem', fontSize: '0.92rem' }}>
              No completed tasks archived yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {completedTasks.map(task => (
                <div 
                  key={task.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: '0.3rem' }}>
                    {/* Clean Normal Text (NO Strike-Through!) */}
                    <span style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-main)' }}>
                      {task.title}
                    </span>

                    {/* Origin Tag & Friendly Timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span className="day-badge" style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '0.72rem', padding: '2px 8px' }}>
                        {getOriginTagLabel(task)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Completed {formatTime(task.completedAt)}
                      </span>
                    </div>
                  </div>

                  <button 
                    className="action-btn-sm"
                    onClick={() => onRestoreTask(task.id)}
                    title="Restore task back to active list"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', flexShrink: 0 }}
                  >
                    <RotateCcw size={13} />
                    <span>Restore</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
