import React, { useState } from 'react';
import { MoreHorizontal, Plus, Edit2, Trash2, X, Check, Settings2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Job, JobStatus, Column } from '../types';
import JobCard from './JobCard';
import ManageColumnsModal from './ManageColumnsModal';

interface KanbanBoardProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
  activeTab: string;
  onDragEnd: (result: any) => void;
  columns: Column[];
  onUpdateColumns: (columns: Column[]) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onEditBoard: () => void;
}

export default function KanbanBoard({ 
  jobs, 
  onJobClick, 
  activeTab, 
  onDragEnd, 
  columns,
  onUpdateColumns,
  onRenameColumn,
  onDeleteColumn,
  onEditBoard
}: KanbanBoardProps) {
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showMenuId, setShowMenuId] = useState<string | null>(null);

  const displayColumns = activeTab === 'Archive' 
    ? [{ id: 'Archived', title: 'Archive' }]
    : columns;

  const startEditing = (column: Column) => {
    setEditingColumnId(column.id);
    setEditTitle(column.title);
    setShowMenuId(null);
  };

  const handleRename = () => {
    if (editTitle.trim() && editingColumnId) {
      onRenameColumn(editingColumnId, editTitle.trim());
      setEditingColumnId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface">
      {activeTab !== 'Archive' && (
        <div className="px-8 py-4 hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <p className="text-xs text-on-surface-variant font-medium">Manage your pipeline stages and workflow.</p>
          </div>
          <button
            onClick={onEditBoard}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface-container-highest border border-white/10 text-on-surface-variant hover:text-on-surface hover:border-primary/50 transition-all group active:scale-95"
          >
            <Settings2 size={16} className="group-hover:rotate-45 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Edit Board</span>
          </button>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto p-8 custom-scrollbar">
          <div className="flex gap-6 min-h-full items-start">
            {displayColumns.map((column) => {
              const columnJobs = jobs.filter((job) => job.status === column.id);
              return (
                <div key={column.id} className="flex-none w-72 flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2 relative">
                    {editingColumnId === column.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input 
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                          className="bg-surface-container-highest border border-primary/30 rounded px-2 py-1 text-xs text-on-surface focus:outline-none w-full"
                          autoFocus
                        />
                        <button onClick={handleRename} className="text-primary hover:text-primary-dim">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingColumnId(null)} className="text-on-surface-variant hover:text-on-surface">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold tracking-tight text-on-surface-variant uppercase flex items-center gap-2">
                          {column.title} <span className="text-on-surface-variant/40 font-normal">({columnJobs.length})</span>
                        </h3>
                        {activeTab !== 'Archive' && (
                          <div className="relative">
                            <button 
                              onClick={() => setShowMenuId(showMenuId === column.id ? null : column.id)}
                              className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-lg hover:bg-white/5"
                            >
                              <MoreHorizontal size={18} />
                            </button>
                            
                            {showMenuId === column.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setShowMenuId(null)}
                                />
                                <div className="absolute right-0 mt-2 w-40 bg-surface-container-highest border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                                  <button 
                                    onClick={() => startEditing(column)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-white/5 transition-colors"
                                  >
                                    <Edit2 size={14} /> Rename
                                  </button>
                                  <button 
                                    onClick={() => {
                                      onDeleteColumn(column.id);
                                      setShowMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-primary hover:bg-primary/10 transition-colors"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex flex-col gap-4 flex-1 min-h-[200px] rounded-xl transition-colors duration-200 ${
                          snapshot.isDraggingOver ? 'bg-white/5' : ''
                        }`}
                      >
                        {columnJobs.map((job, index) => (
                          // @ts-ignore
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${snapshot.isDragging ? 'z-50' : ''}`}
                              >
                                <JobCard job={job} onClick={onJobClick} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
