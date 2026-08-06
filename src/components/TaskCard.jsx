import React, { useState } from 'react';
import { Flame, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TaskCard({ 
  task, 
  onToggleComplete, 
  onTogglePriority, 
  onUpdateTaskTitle,
  onUnscheduleTask,
  onDragStart,
  tabInfo
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleComplete = (e) => {
    e.stopPropagation();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
    });
    onToggleComplete(task.id);
  };

  const handlePriorityToggle = (e) => {
    e.stopPropagation();
    onTogglePriority(task.id);
  };

  const handleUnschedule = (e) => {
    e.stopPropagation();
    if (onUnscheduleTask) {
      onUnscheduleTask(task.id);
    }
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      onUpdateTaskTitle(task.id, editTitle.trim());
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={`task-card ${task.isHighPriority ? 'high-priority' : ''}`}
      draggable={!isEditing}
      onDragStart={(e) => {
        if (isEditing) return;
        e.dataTransfer.setData('text/plain', task.id);
        onDragStart && onDragStart(task.id);
      }}
    >
      <div className="task-card-main">
        {/* Origin Tab Dot (Matching Tab Header Color) */}
        {tabInfo && (
          <span 
            className="task-origin-dot"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: tabInfo.bg,
              flexShrink: 0,
              marginRight: '2px',
              display: 'inline-block'
            }}
            title={`From '${tabInfo.name}' tab`}
          />
        )}

        {/* Task Title (Click to Edit) */}
        {isEditing ? (
          <input
            type="text"
            className="task-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span 
            className="task-title" 
            title="Click to edit task"
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Task Action Buttons */}
      <div className="task-actions">
        {/* Fire Toggle (High Priority) */}
        <button 
          className={`task-action-btn priority-toggle ${task.isHighPriority ? 'active' : ''}`}
          onClick={handlePriorityToggle}
          title={task.isHighPriority ? "High Priority (Click to remove)" : "Mark High Priority"}
        >
          <Flame size={14} />
        </button>

        {/* Checkmark (Complete Task) */}
        <button 
          className="task-action-btn check-action-btn"
          onClick={handleComplete}
          title="Complete task"
        >
          <Check size={14} />
        </button>

        {/* Remove from Schedule (Only rendered in Weekly Planner) */}
        {onUnscheduleTask && (
          <button 
            className="task-action-btn"
            onClick={handleUnschedule}
            title="Remove from weekly schedule (keeps task in category)"
            style={{ color: 'var(--text-dim)' }}
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
