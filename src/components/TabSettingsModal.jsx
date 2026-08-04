import React, { useState, useEffect } from 'react';
import { Settings, Trash2, Save, X } from 'lucide-react';

export default function TabSettingsModal({
  isOpen,
  onClose,
  tab,
  canDelete,
  onRenameTab,
  onDeleteTab
}) {
  const [name, setName] = useState(tab?.name || '');

  useEffect(() => {
    if (tab) {
      setName(tab.name);
    }
  }, [tab]);

  if (!isOpen || !tab) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== tab.name) {
      onRenameTab(tab.id, name.trim());
    }
    onClose();
  };

  const handleDelete = () => {
    if (canDelete) {
      onDeleteTab(tab.id);
      onClose();
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div 
        className="auth-card" 
        style={{ 
          maxWidth: '420px', 
          width: '90%', 
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} className="text-indigo-600" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Tab Settings</h2>
          </div>
          <button className="task-action-btn" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>

        {/* Rename Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Tab Name
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="add-task-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tab name..."
              autoFocus
              style={{ flex: 1, padding: '0.45rem 0.65rem' }}
            />
            <button type="submit" className="action-btn-sm" style={{ background: 'var(--accent-primary)', color: '#fff' }}>
              <Save size={13} />
              <span>Save</span>
            </button>
          </div>
        </form>

        {/* Danger Zone: Delete Tab */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ef4444' }}>
            Danger Zone
          </span>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: 0 }}>
            Deleting this tab will archive all categories and tasks inside it. You can restore them anytime from the Archive page.
          </p>
          <button
            className="action-btn-sm"
            onClick={handleDelete}
            disabled={!canDelete}
            style={{ 
              color: '#ef4444', 
              borderColor: '#fca5a5', 
              opacity: canDelete ? 1 : 0.5,
              cursor: canDelete ? 'pointer' : 'not-allowed',
              justifyContent: 'center',
              padding: '0.45rem'
            }}
          >
            <Trash2 size={13} />
            <span>Delete Tab "{tab.name}"</span>
          </button>
          {!canDelete && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textAlign: 'center' }}>
              (At least 1 tab must remain active)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
