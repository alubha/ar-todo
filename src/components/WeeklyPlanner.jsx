import React from 'react';
import { 
  CalendarDays, 
  ChevronDown, 
  ChevronUp, 
  Copy 
} from 'lucide-react';
import TaskCard from './TaskCard';

const DAYS_CONFIG = [
  { key: 'mon', name: 'Mon' },
  { key: 'tue', name: 'Tue' },
  { key: 'wed', name: 'Wed' },
  { key: 'thu', name: 'Thu' },
  { key: 'fri', name: 'Fri' },
  { key: 'sat', name: 'Sat' },
  { key: 'sun', name: 'Sun' }
];

export default function WeeklyPlanner({
  isExpanded,
  onToggleExpand,
  tasks,
  onToggleComplete,
  onTogglePriority,
  onUpdateTaskTitle,
  onDeleteTask,
  onDropTaskToDay,
  onDuplicateWeek
}) {
  const [dragOverDay, setDragOverDay] = React.useState(null);

  const handleDragOver = (e, dayKey) => {
    e.preventDefault();
    setDragOverDay(dayKey);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = (e, dayKey) => {
    e.preventDefault();
    setDragOverDay(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTaskToDay(taskId, dayKey);
    }
  };

  return (
    <div className="weekly-planner-container">
      {/* Planner Collapsible Header */}
      <div className="planner-header" onClick={onToggleExpand}>
        <div className="planner-title">
          <CalendarDays size={16} className="text-indigo-600" />
          <span>Weekly Schedule (Mon – Sun)</span>
        </div>

        <div className="planner-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="action-btn-sm"
            onClick={onDuplicateWeek}
            title="Duplicate scheduled week template"
          >
            <Copy size={12} />
            <span>Duplicate Week</span>
          </button>

          <button 
            className="icon-btn" 
            onClick={onToggleExpand}
            title={isExpanded ? "Collapse View" : "Expand View"}
            style={{ width: '28px', height: '28px' }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* 7-Day Single Row Grid (Mon - Sun) */}
      {isExpanded && (
        <div className="planner-days-grid">
          {DAYS_CONFIG.map((day) => {
            const dayTasks = tasks.filter(t => t.scheduledDay === day.key);
            
            return (
              <div key={day.key} className="planner-day-column">
                <div className="day-header">
                  <span className="day-name">{day.name}</span>
                  <span className="day-count">{dayTasks.length}</span>
                </div>

                <div 
                  className={`day-dropzone ${dragOverDay === day.key ? 'drag-over' : ''}`}
                  onDragOver={(e) => handleDragOver(e, day.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day.key)}
                >
                  {dayTasks.length === 0 ? (
                    <div className="empty-state">
                      Drag here
                    </div>
                  ) : (
                    dayTasks.map(task => (
                      <TaskCard
                        key={`planner-${task.id}`}
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onTogglePriority={onTogglePriority}
                        onUpdateTaskTitle={onUpdateTaskTitle}
                        onDeleteTask={onDeleteTask}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
