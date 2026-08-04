import React from 'react';
import { CheckCircle2, RotateCcw, X, Trash2 } from 'lucide-react';

export default function CompletedModal({ 
  isOpen, 
  onClose, 
  completedTasks, 
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

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div 
        className="auth-card" 
        style={{ 
          maxWidth: '520px', 
          width: '92%', 
          padding: '1.25rem 1.5rem',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} className="text-emerald-600" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Completed Tasks Archive ({completedTasks.length})</h2>
          </div>

          <button 
            className="task-action-btn"
            onClick={onClose}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Completed Task List Sorted by Most Recent */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingRight: '4px' }}>
          {completedTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              No completed tasks yet. Check off items to archive them here!
            </div>
          ) : (
            completedTasks.map(task => (
              <div 
                key={task.id}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.45rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justify-content: 'space-between',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: '0.82rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                    {task.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                    Completed {formatTime(task.completedAt)}
                  </span>
                </div>

                <button 
                  className="action-btn-sm"
                  onClick={() => onRestoreTask(task.id)}
                  title="Restore task to active list"
                  style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                >
                  <RotateCcw size={11} />
                  <span>Restore</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {completedTasks.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button 
              className="action-btn-sm"
              onClick={onClearCompletedHistory}
              style={{ color: '#ef4444', borderColor: '#fca5a5' }}
            >
              <Trash2 size={12} />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
