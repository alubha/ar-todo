import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import TaskCard from './TaskCard';
import CategoryIconPicker from './CategoryIconPicker';

export default function CategoryColumn({
  category,
  tasks,
  onAddTask,
  onToggleComplete,
  onTogglePriority,
  onUpdateTaskTitle,
  onUpdateCategoryName,
  onUpdateCategoryIcon,
  onDeleteTask,
  onDropTaskToCategory,
  onDeleteCategory
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingCatName, setIsEditingCatName] = useState(false);
  const [catName, setCatName] = useState(category.name);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (onAddTask) {
      onAddTask(category.id, newTaskTitle.trim());
    }
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
    if (taskId && onDropTaskToCategory) {
      onDropTaskToCategory(taskId, category.id);
    }
  };

  const handleSaveCatName = () => {
    if (category.isAutoUrgent) {
      setIsEditingCatName(false);
      return;
    }
    if (catName.trim() && catName.trim() !== category.name) {
      onUpdateCategoryName(category.id, catName.trim());
    } else {
      setCatName(category.name);
    }
    setIsEditingCatName(false);
  };

  const handleKeyDownCat = (e) => {
    if (e.key === 'Enter') {
      handleSaveCatName();
    } else if (e.key === 'Escape') {
      setCatName(category.name);
      setIsEditingCatName(false);
    }
  };

  return (
    <div className={`category-column ${category.isAutoUrgent ? 'urgent-column' : ''}`}>
      {/* Category Column Header */}
      <div className="category-column-header">
        <div className="category-title-group">
          {/* Interactive Category Icon & Color Picker */}
          <CategoryIconPicker
            currentIcon={category.icon || 'tag'}
            currentColor={category.color || '#4f46e5'}
            onSelectIcon={(data) => !category.isAutoUrgent && onUpdateCategoryIcon && onUpdateCategoryIcon(category.id, data)}
          />

          {!category.isAutoUrgent && isEditingCatName ? (
            <input
              type="text"
              className="category-edit-input"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              onBlur={handleSaveCatName}
              onKeyDown={handleKeyDownCat}
              autoFocus
            />
          ) : (
            <h3 
              className="category-name" 
              title={category.isAutoUrgent ? "Auto-generated Urgent column" : "Click to edit category name"}
              onClick={() => !category.isAutoUrgent && setIsEditingCatName(true)}
            >
              {category.name}
            </h3>
          )}

          <span className="category-task-count">{tasks.length}</span>
        </div>

        {!category.isAutoUrgent && onDeleteCategory && (
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
              key={`category-${category.id}-${task.id}`}
              task={task}
              onToggleComplete={onToggleComplete}
              onTogglePriority={onTogglePriority}
              onUpdateTaskTitle={onUpdateTaskTitle}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>

      {/* Add Task Input Form (hidden for Auto Urgent Column) */}
      {!category.isAutoUrgent && (
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
      )}
    </div>
  );
}
