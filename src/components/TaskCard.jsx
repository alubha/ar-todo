import React from 'react';
import { Flame, Check, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const DAY_SHORT_NAMES = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat'
};

export default function TaskCard({ 
  task, 
  onToggleComplete, 
  onTogglePriority, 
  onDeleteTask,
  onDragStart
}) {
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

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteTask(task.id);
  };

  return (
    <div 
      className={`task-card ${task.isHighPriority ? 'high-priority' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        onDragStart && onDragStart(task.id);
      }}
    >
      <div className="task-card-main">
        {/* Checkbox */}
        <button 
          className="task-checkbox"
          onClick={handleComplete}
          title="Mark task completed"
        >
          <Check size={11} className="text-emerald-500 opacity-0 hover:opacity-100" />
        </button>

        {/* Task Title */}
        <span className="task-title" title={task.title}>{task.title}</span>

        {/* Day Badge if Scheduled */}
        {task.scheduledDay && (
          <span className="day-badge">
            {DAY_SHORT_NAMES[task.scheduledDay] || task.scheduledDay}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button 
          className={`task-action-btn priority-toggle ${task.isHighPriority ? 'active' : ''}`}
          onClick={handlePriorityToggle}
          title={task.isHighPriority ? "High Priority (Click to remove)" : "Mark High Priority"}
        >
          <Flame size={13} />
        </button>

        <button 
          className="task-action-btn"
          onClick={handleDelete}
          title="Delete task"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
