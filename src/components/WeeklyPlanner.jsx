import React from 'react';
import { CalendarDays } from 'lucide-react';
import TaskCard from './TaskCard';

const DAYS_CONFIG = [
  { key: 'mon', name: 'Mon', type: 'weekday' },
  { key: 'tue', name: 'Tue', type: 'weekday' },
  { key: 'wed', name: 'Wed', type: 'weekday' },
  { key: 'thu', name: 'Thu', type: 'weekday' },
  { key: 'fri', name: 'Fri', type: 'weekday' },
  { key: 'sat', name: 'Sat', type: 'weekend' },
  { key: 'sun', name: 'Sun', type: 'weekend' }
];

export default function WeeklyPlanner({
  isExpanded,
  onToggleExpand,
  tasks,
  onToggleComplete,
  onTogglePriority,
  onUpdateTaskTitle,
  onDeleteTask,
  onDropTaskToDay
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
      {/* Click Banner Anywhere to Expand/Collapse */}
      <div className="planner-header" onClick={onToggleExpand}>
        <div className="planner-title">
          <CalendarDays size={16} className="text-indigo-600" />
          <span>Weekly Schedule</span>
        </div>
      </div>

      {/* 7-Day Single Row Grid (Mon - Sun) */}
      {isExpanded && (
        <div className="planner-days-grid">
          {DAYS_CONFIG.map((day) => {
            const dayTasks = tasks
              .filter(t => t.scheduledDay === day.key)
              .sort((a, b) => (b.isHighPriority ? 1 : 0) - (a.isHighPriority ? 1 : 0));
            
            return (
              <div key={day.key} className={`planner-day-column ${day.type}`}>
                <div className="day-header">
                  <span className="day-name">{day.name}</span>
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
