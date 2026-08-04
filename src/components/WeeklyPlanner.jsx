import React from 'react';
import { 
  CalendarDays, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Sparkles,
  Plus
} from 'lucide-react';
import TaskCard from './TaskCard';

const DAYS_CONFIG = [
  { key: 'mon', name: 'Monday' },
  { key: 'tue', name: 'Tuesday' },
  { key: 'wed', name: 'Wednesday' },
  { key: 'thu', name: 'Thursday' },
  { key: 'fri', name: 'Friday' },
  { key: 'sat', name: 'Saturday' }
];

export default function WeeklyPlanner({
  isExpanded,
  onToggleExpand,
  tasks,
  onToggleComplete,
  onTogglePriority,
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
        <div className="planner-header-left">
          <CalendarDays size={18} className="text-indigo-400" />
          <div>
            <h2 className="planner-title">Weekly Schedule & Planning</h2>
            <p className="planner-subtitle">Monday – Saturday Timeline • Drag tasks to schedule your week</p>
          </div>
        </div>

        <div className="planner-actions" onClick={(e) => e.stopPropagation()}>
          {/* Duplicate Week Plan Button */}
          <button 
            className="action-btn-sm"
            onClick={onDuplicateWeek}
            title="Duplicate previous week's scheduled task plan into new week"
          >
            <Copy size={13} />
            <span>Duplicate Week</span>
          </button>

          {/* Expand/Collapse Chevron */}
          <button 
            className="icon-btn" 
            onClick={onToggleExpand}
            title={isExpanded ? "Collapse Weekly Planning View" : "Expand Weekly Planning View"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* 6-Day Monday through Saturday Grid */}
      {isExpanded && (
        <div className="planner-days-grid">
          {DAYS_CONFIG.map((day) => {
            const dayTasks = tasks.filter(t => t.scheduledDay === day.key);
            
            return (
              <div key={day.key} className="planner-day-column">
                <div className="day-header">
                  <span className="day-name">{day.name}</span>
                  <span className="day-count">{dayTasks.length} tasks</span>
                </div>

                <div 
                  className={`day-dropzone ${dragOverDay === day.key ? 'drag-over' : ''}`}
                  onDragOver={(e) => handleDragOver(e, day.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day.key)}
                >
                  {dayTasks.length === 0 ? (
                    <div className="empty-state">
                      Drag task here
                    </div>
                  ) : (
                    dayTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onTogglePriority={onTogglePriority}
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
