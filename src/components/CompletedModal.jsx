import React from 'react';
import { CheckCircle2, RotateCcw, ArrowLeft, Trash2 } from 'lucide-react';

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
  onRestoreTask,
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
    const tabName = TAB_LABELS[task.tabId] || 'Personal';
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
              Completed Tasks Archive ({completedTasks.length})
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
            <span>Clear History</span>
          </button>
        )}
      </header>

      {/* Full-Screen Content Area */}
      <main className="main-content" style={{ padding: '1.5rem 1.75rem 3rem 1.75rem' }}>
        {completedTasks.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem', fontSize: '0.95rem' }}>
            No completed tasks yet. Items completed from your lists will be archived here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
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
      </main>
    </div>
  );
}
