import React, { useState } from 'react';
import { X, GripVertical, Trash2, Plus, Save, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Column } from '../types';

interface ManageColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  onSave: (columns: Column[]) => void;
}

export default function ManageColumnsModal({ isOpen, onClose, columns, onSave }: ManageColumnsModalProps) {
  const [localColumns, setLocalColumns] = useState<Column[]>(columns);

  React.useEffect(() => {
    if (isOpen) {
      setLocalColumns(columns);
    }
  }, [isOpen, columns]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(localColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLocalColumns(items);
  };

  const handleRename = (id: string, newTitle: string) => {
    setLocalColumns(prev => prev.map(col => col.id === id ? { ...col, title: newTitle } : col));
  };

  const handleDelete = (id: string) => {
    setLocalColumns(prev => prev.filter(col => col.id !== id));
  };

  const handleAdd = () => {
    const newId = `col-${Math.random().toString(36).substr(2, 9)}`;
    setLocalColumns(prev => [...prev, { id: newId, title: 'New Column' }]);
  };

  const handleSave = () => {
    onSave(localColumns);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface-container-low border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container-high/50">
              <div className="flex items-center gap-2">
                <Settings2 className="text-primary" size={20} />
                <h2 className="text-xl font-bold text-on-surface">Manage Board Columns</h2>
              </div>
              <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="columns-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {localColumns.map((column, index) => (
                        // @ts-ignore
                        <Draggable key={column.id} draggableId={column.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-3 bg-surface-container-highest/50 border border-white/5 p-3 rounded-xl group"
                            >
                              <div {...provided.dragHandleProps} className="text-on-surface-variant hover:text-on-surface cursor-grab active:cursor-grabbing">
                                <GripVertical size={18} />
                              </div>
                              <input
                                type="text"
                                value={column.title}
                                onChange={(e) => handleRename(column.id, e.target.value)}
                                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-on-surface font-medium"
                              />
                              <button
                                onClick={() => handleDelete(column.id)}
                                className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <button
                onClick={handleAdd}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 text-on-surface-variant hover:text-on-surface hover:border-primary/50 hover:bg-white/5 transition-all group font-bold text-xs uppercase tracking-widest"
              >
                <Plus size={18} className="group-hover:scale-110 transition-transform" />
                Add New Column
              </button>
            </div>

            <div className="p-6 border-t border-white/5 bg-surface-container-low">
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-3 rounded-xl active:scale-95 duration-200 shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
