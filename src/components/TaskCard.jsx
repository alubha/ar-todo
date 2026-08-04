import React, { useState } from 'react';
import { Flame, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TaskCard({ 
  task, 
  onToggleComplete, 
  onTogglePriority, 
  onUpdateTaskTitle,
  onDragStart
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

      {/* 2 Right Action Options: Fire (🔥) & Checkmark (✓) */}
      <div className="task-actions">
        {/* Option 1: Fire Toggle (High Priority) */}
        <button 
          className={`task-action-btn priority-toggle ${task.isHighPriority ? 'active' : ''}`}
          onClick={handlePriorityToggle}
          title={task.isHighPriority ? "High Priority (Click to remove)" : "Mark High Priority"}
        >
          <Flame size={14} />
        </button>

        {/* Option 2: Checkmark (Complete Task) */}
        <button 
          className="task-action-btn check-action-btn"
          onClick={handleComplete}
          title="Complete task"
        >
          <Check size={14} />
        </button>
      </div>
    </div>
  );
}
