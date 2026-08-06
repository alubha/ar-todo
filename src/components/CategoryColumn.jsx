import React, { useState } from 'react';
import { Trash2, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskCard from './TaskCard';
import CategoryIconPicker from './CategoryIconPicker';

export default function CategoryColumn({
  category,
  tasks,
  canMoveLeft,
  canMoveRight,
  onMoveDirection,
  onAddTask,
  onToggleComplete,
  onTogglePriority,
  onUpdateTaskTitle,
  onUpdateCategoryName,
  onUpdateCategoryIcon,
  onDeleteTask,
  onDropTaskToCategory,
  onDeleteCategory,
  onReorderCategory,
  onCategoryDragStart,
  onCategoryDragEnd,
  tabId
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingCatName, setIsEditingCatName] = useState(false);
  const [catName, setCatName] = useState(category.name);

  const isAPTab = tabId === 'ap' || category.tabId === 'ap';
  const isWorkTab = tabId === 'work' || category.tabId === 'work';

  let tabHeaderClass = '';
  let iconColor = category.color || '#4f46e5';
  let gripColor = '#ffffff';

  if (isAPTab) {
    tabHeaderClass = 'ap-tab-header';
    iconColor = '#F8B4C5';
    gripColor = '#1e293b';
  } else if (isWorkTab) {
    tabHeaderClass = 'work-tab-header';
    iconColor = '#FBBC04';
    gripColor = '#1e293b';
  }

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
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    // 1. Check if dropping a Category (for reordering)
    let rawCatId = e.dataTransfer.getData('text/category-id');
    const plainData = e.dataTransfer.getData('text/plain');

    if (!rawCatId && plainData && plainData.startsWith('category:')) {
      rawCatId = plainData.replace('category:', '');
    }

    if (rawCatId) {
      if (onReorderCategory && rawCatId !== category.id) {
        onReorderCategory(rawCatId, category.id);
      }
      return;
    }

    // 2. Check if dropping a Task
    if (plainData && !plainData.startsWith('category:') && onDropTaskToCategory) {
      onDropTaskToCategory(plainData, category.id);
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
      className={`category-column ${category.isAutoUrgent ? 'urgent-column' : ''} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Category Column Header (Draggable for reordering columns) */}
      <div 
        className={`category-column-header ${tabHeaderClass}`}
        draggable={!category.isAutoUrgent && !isEditingCatName}
        onDragStart={(e) => {
          if (category.isAutoUrgent || isEditingCatName) return;
          e.dataTransfer.setData('text/category-id', category.id);
          e.dataTransfer.setData('text/plain', `category:${category.id}`);
          e.dataTransfer.effectAllowed = 'move';
          if (onCategoryDragStart) onCategoryDragStart();
        }}
        onDragEnd={() => {
          if (onCategoryDragEnd) onCategoryDragEnd();
        }}
        style={{ cursor: category.isAutoUrgent ? 'default' : 'grab' }}
      >
        <div className="category-title-group">
          {!category.isAutoUrgent && (
            <GripVertical size={13} className="grip-icon" style={{ color: gripColor, opacity: 0.8, cursor: 'grab' }} />
          )}

          {/* Interactive Category Icon & Color Picker */}
          <CategoryIconPicker
            currentIcon={category.icon || 'tag'}
            currentColor={iconColor}
            onSelectIcon={(data) => !category.isAutoUrgent && onUpdateCategoryIcon && onUpdateCategoryIcon(category.id, data)}
          />

          {/* Left Arrow Button for Shift Left */}
          {!category.isAutoUrgent && canMoveLeft && (
            <button
              className="category-arrow-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveDirection) onMoveDirection(category.id, 'left');
              }}
              title="Move category left"
            >
              <ChevronLeft size={13} />
            </button>
          )}

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
              title={category.isAutoUrgent ? "Auto-generated Urgent column" : "Click to edit category name (drag header or use arrows to reorder)"}
              onClick={() => !category.isAutoUrgent && setIsEditingCatName(true)}
            >
              {category.name}
            </h3>
          )}

          {/* Right Arrow Button for Shift Right */}
          {!category.isAutoUrgent && canMoveRight && (
            <button
              className="category-arrow-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveDirection) onMoveDirection(category.id, 'right');
              }}
              title="Move category right"
            >
              <ChevronRight size={13} />
            </button>
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
      <div className="category-dropzone">
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
