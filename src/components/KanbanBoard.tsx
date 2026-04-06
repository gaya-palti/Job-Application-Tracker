import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { COLUMNS } from '../constants';
import { Job, JobStatus } from '../types';
import JobCard from './JobCard';

interface KanbanBoardProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
  activeTab: string;
  onDragEnd: (result: any) => void;
}

export default function KanbanBoard({ jobs, onJobClick, activeTab, onDragEnd }: KanbanBoardProps) {
  const displayColumns = activeTab === 'Archive' 
    ? [{ id: 'Archived' as JobStatus, title: 'Archive', count: jobs.filter(j => j.status === 'Archived').length }]
    : COLUMNS;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 overflow-x-auto p-8 bg-surface custom-scrollbar">
        <div className="flex gap-6 min-h-full">
          {displayColumns.map((column) => {
            const columnJobs = jobs.filter((job) => job.status === column.id);
            return (
              <div key={column.id} className="flex-none w-72 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-semibold tracking-tight text-on-surface-variant uppercase">
                    {column.title} <span className="ml-2 text-on-surface-variant/40">{columnJobs.length}</span>
                  </h3>
                  <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
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
  );
}
