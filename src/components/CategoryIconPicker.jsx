import React, { useState } from 'react';
import { 
  Laptop, 
  Sparkles, 
  ShoppingBag, 
  HeartPulse, 
  Users, 
  Calendar, 
  FolderKanban, 
  CheckSquare, 
  DollarSign, 
  Home, 
  Compass, 
  Coffee, 
  Zap, 
  Star, 
  Smile, 
  Tag, 
  BookOpen, 
  Target, 
  Flame, 
  Shield 
} from 'lucide-react';

export const ICON_MAP = {
  'laptop': Laptop,
  'sparkles': Sparkles,
  'shopping-bag': ShoppingBag,
  'heart-pulse': HeartPulse,
  'users': Users,
  'calendar': Calendar,
  'folder-kanban': FolderKanban,
  'check-square': CheckSquare,
  'dollar-sign': DollarSign,
  'home': Home,
  'compass': Compass,
  'coffee': Coffee,
  'zap': Zap,
  'star': Star,
  'smile': Smile,
  'tag': Tag,
  'book-open': BookOpen,
  'target': Target,
  'flame': Flame,
  'shield': Shield
};

export const COLOR_PALETTE = [
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#6366f1',
  '#3b82f6',
  '#ef4444',
  '#f97316',
  '#14b8a6'
];

export function CategoryIcon({ iconName = 'tag', color = '#4f46e5', size = 16 }) {
  const IconComponent = ICON_MAP[iconName] || Tag;
  return (
    <div 
      className="category-icon-badge"
      style={{ 
        backgroundColor: `${color}18`, 
        color: color,
        padding: '3px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <IconComponent size={size} />
    </div>
  );
}

export default function CategoryIconPicker({ 
  currentIcon = 'tag', 
  currentColor = '#4f46e5', 
  onSelectIcon 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Clickable Icon Button */}
      <button
        type="button"
        className="icon-picker-trigger"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        title="Click to change icon & color"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <CategoryIcon iconName={currentIcon} color={currentColor} size={15} />
      </button>

      {/* Icon & Color Picker Dropdown Popover */}
      {isOpen && (
        <div 
          className="icon-picker-popover"
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Choose Color
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {COLOR_PALETTE.map(color => (
              <div
                key={color}
                onClick={() => onSelectIcon({ icon: currentIcon, color })}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: currentColor === color ? '2px solid #000' : '1px solid rgba(0,0,0,0.1)'
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Choose Icon
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
            {Object.keys(ICON_MAP).map(iconKey => {
              const IconComp = ICON_MAP[iconKey];
              const isSelected = currentIcon === iconKey;
              return (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => {
                    onSelectIcon({ icon: iconKey, color: currentColor });
                    setIsOpen(false);
                  }}
                  style={{
                    background: isSelected ? `${currentColor}22` : 'var(--bg-primary)',
                    border: isSelected ? `1px solid ${currentColor}` : '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? currentColor : 'var(--text-main)'
                  }}
                >
                  <IconComp size={14} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
