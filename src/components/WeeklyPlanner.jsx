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

// Header banner colors for each tab
const TAB_COLOR_PRESETS = {
  personal: { bg: '#4b5358', name: 'Personal' },
  work: { bg: '#FBBC04', name: 'Work' },
  ap: { bg: '#F8B4C5', name: 'AP' }
};

const FALLBACK_COLORS = [
  { bg: '#8b5cf6' },
  { bg: '#3b82f6' },
  { bg: '#10b981' },
  { bg: '#ec4899' },
  { bg: '#f97316' }
];

const getTabInfo = (tabId, tabsList) => {
  if (TAB_COLOR_PRESETS[tabId]) {
    const preset = TAB_COLOR_PRESETS[tabId];
    const foundTab = (tabsList || []).find(t => t.id === tabId);
    return {
      ...preset,
      name: foundTab ? foundTab.name : preset.name
    };
  }

  const foundTab = (tabsList || []).find(t => t.id === tabId);
  const name = foundTab ? foundTab.name : tabId;
  const idx = (tabsList || []).findIndex(t => t.id === tabId);
  const fallback = FALLBACK_COLORS[Math.max(0, idx) % FALLBACK_COLORS.length];

  return {
    bg: fallback.bg,
    name
  };
};

export default function WeeklyPlanner({
  isExpanded,
  onToggleExpand,
  tasks,
  tabs,
  onToggleComplete,
  onTogglePriority,
  onUpdateTaskTitle,
  onUnscheduleTask,
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
            // Sort tasks within each day: 
            // 1. Grouped by Tab order (e.g. Personal -> Work -> AP)
            // 2. High priority tasks first within each tab
            const dayTasks = tasks
              .filter(t => t.scheduledDay === day.key)
              .sort((a, b) => {
                const tabIdxA = (tabs || []).findIndex(t => t.id === a.tabId);
                const tabIdxB = (tabs || []).findIndex(t => t.id === b.tabId);
                const aTabPos = tabIdxA >= 0 ? tabIdxA : 999;
                const bTabPos = tabIdxB >= 0 ? tabIdxB : 999;

                if (aTabPos !== bTabPos) {
                  return aTabPos - bTabPos;
                }

                return (b.isHighPriority ? 1 : 0) - (a.isHighPriority ? 1 : 0);
              });
            
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
                        tabInfo={getTabInfo(task.tabId, tabs)}
                        onToggleComplete={onToggleComplete}
                        onTogglePriority={onTogglePriority}
                        onUpdateTaskTitle={onUpdateTaskTitle}
                        onUnscheduleTask={onUnscheduleTask}
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
