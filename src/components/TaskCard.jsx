import React from 'react';
import { Flame, Check, Trash2, Calendar, Move, AlertCircle } from 'lucide-react';
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
    // Fire celebratory confetti on task completion
    confetti({
      particleCount: 40,
      spread: 60,
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
        {/* Completion Checkbox */}
        <button 
          className="task-checkbox"
          onClick={handleComplete}
          title="Mark task as completed"
        >
          <Check size={13} className="text-emerald-500 opacity-0 hover:opacity-100" />
        </button>

        <div className="task-card-content">
          <div className="task-title">{task.title}</div>
          
          <div className="task-meta">
            {/* Priority Indicator */}
            {task.isHighPriority && (
              <span className="priority-badge">
                <Flame size={11} />
                High Priority
              </span>
            )}

            {/* Scheduled Day Indicator */}
            {task.scheduledDay && (
              <span className="day-badge">
                <Calendar size={11} style={{ marginRight: '3px' }} />
                {DAY_SHORT_NAMES[task.scheduledDay] || task.scheduledDay}
              </span>
            )}
          </div>
        </div>

        {/* Task Card Actions */}
        <div className="task-actions">
          {/* High Priority Flame Toggle */}
          <button 
            className={`task-action-btn priority-toggle ${task.isHighPriority ? 'active' : ''}`}
            onClick={handlePriorityToggle}
            title={task.isHighPriority ? "Remove High Priority" : "Mark High Priority"}
          >
            <Flame size={15} />
          </button>

          {/* Delete Task */}
          <button 
            className="task-action-btn"
            onClick={handleDelete}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
