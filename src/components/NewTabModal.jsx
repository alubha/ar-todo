import React, { useState } from 'react';
import { FolderPlus, Plus, X } from 'lucide-react';

export default function NewTabModal({ isOpen, onClose, onCreateTab }) {
  const [tabName, setTabName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tabName.trim()) {
      onCreateTab(tabName.trim());
      setTabName('');
      onClose();
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div 
        className="auth-card" 
        style={{ 
          maxWidth: '380px', 
          width: '90%', 
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderPlus size={18} className="text-indigo-600" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Create New Tab</h2>
          </div>
          <button className="task-action-btn" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>

        {/* Create Tab Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Tab Name
            </label>
            <input
              type="text"
              className="add-task-input"
              value={tabName}
              onChange={(e) => setTabName(e.target.value)}
              placeholder="e.g. Side Projects, Household..."
              autoFocus
              style={{ width: '100%', padding: '0.5rem 0.75rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button type="button" className="action-btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="action-btn-sm" style={{ background: 'var(--accent-primary)', color: '#fff' }}>
              <Plus size={14} />
              <span>Create Tab</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
