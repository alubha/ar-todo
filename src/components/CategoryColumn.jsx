import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import TaskCard from './TaskCard';

export default function CategoryColumn({
  category,
  tasks,
  onAddTask,
  onToggleComplete,
  onTogglePriority,
  onUpdateTaskTitle,
  onDeleteTask,
  onDropTaskToCategory,
  onDeleteCategory
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(category.id, newTaskTitle.trim());
    setNewTaskTitle('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTaskToCategory(taskId, category.id);
    }
  };

  return (
    <div className="category-column">
      {/* Category Column Header */}
      <div className="category-column-header">
        <div className="category-title-group">
          <div 
            className="category-color-dot" 
            style={{ backgroundColor: category.color || '#4f46e5' }}
          />
          <h3 className="category-name">{category.name}</h3>
          <span className="category-task-count">{tasks.length}</span>
        </div>

        {onDeleteCategory && (
          <button 
            className="task-action-btn"
            onClick={() => onDeleteCategory(category.id)}
            title="Remove Category"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Category Task Dropzone & Card List */}
      <div 
        className={`category-dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.length === 0 ? (
          <div className="empty-state">
            No tasks
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={`category-${task.id}`}
              task={task}
              onToggleComplete={onToggleComplete}
              onTogglePriority={onTogglePriority}
              onUpdateTaskTitle={onUpdateTaskTitle}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>

      {/* Add Task Input Form */}
      <form onSubmit={handleFormSubmit} className="add-task-form">
        <input
          type="text"
          className="add-task-input"
          placeholder="+ Add task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit" className="add-task-btn" title="Add Task">
          <Plus size={14} />
        </button>
      </form>
    </div>
  );
}
