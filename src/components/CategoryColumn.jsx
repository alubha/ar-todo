import React, { useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
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
  onDeleteCategory,
  onReorderCategory
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

    // Check if dropping a Category (for reordering)
    const sourceCatId = e.dataTransfer.getData('text/category-id');
    if (sourceCatId) {
      if (onReorderCategory && sourceCatId !== category.id) {
        onReorderCategory(sourceCatId, category.id);
      }
      return;
    }

    // Check if dropping a Task
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
    <div 
      className={`category-column ${category.isAutoUrgent ? 'urgent-column' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Category Column Header (Draggable for reordering columns) */}
      <div 
        className="category-column-header"
        draggable={!category.isAutoUrgent && !isEditingCatName}
        onDragStart={(e) => {
          if (category.isAutoUrgent || isEditingCatName) return;
          e.dataTransfer.setData('text/category-id', category.id);
        }}
        style={{ cursor: category.isAutoUrgent ? 'default' : 'grab' }}
      >
        <div className="category-title-group">
          {!category.isAutoUrgent && (
            <GripVertical size={13} style={{ color: 'var(--text-dim)', opacity: 0.6, cursor: 'grab' }} />
          )}

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
              title={category.isAutoUrgent ? "Auto-generated Urgent column" : "Click to edit category name (drag header to reorder)"}
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
      <div className={`category-dropzone ${isDragOver ? 'drag-over' : ''}`}>
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

      {/* Clean Add Task Input (Press Enter to save - no purple plus button) */}
      {!category.isAutoUrgent && (
        <form onSubmit={handleFormSubmit} className="add-task-form">
          <input
            type="text"
            className="add-task-input"
            placeholder="+ Add task (press Enter)..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
        </form>
      )}
    </div>
  );
}
