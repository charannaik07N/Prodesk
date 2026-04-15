import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

function TaskColumn({
  id,
  title,
  tasks,
  previousColumn,
  nextColumn,
  onDelete,
  onMove,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  editingTaskId,
  editingValue,
  setEditingValue,
  priorityClassByValue,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${id}`,
    data: { status: id, type: "column" },
  });

  return (
    <article
      ref={setNodeRef}
      className={`bg-gray-100 border border-gray-300 rounded-lg min-h-60 p-3 transition-all ${isOver ? "border-blue-600 shadow-lg" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="m-0 text-lg font-bold">{title}</h2>
        <span className="bg-blue-100 text-blue-600 rounded-full min-w-7 h-7 flex items-center justify-center text-xs font-bold">
          {tasks.length}
        </span>
      </div>

      <div className="grid gap-3">
        {tasks.length === 0 ? (
          <p className="text-gray-600 text-sm">Drop a task here</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              previousColumn={previousColumn}
              nextColumn={nextColumn}
              onDelete={onDelete}
              onMove={onMove}
              onStartEditing={onStartEditing}
              onSaveEditing={onSaveEditing}
              onCancelEditing={onCancelEditing}
              editingTaskId={editingTaskId}
              editingValue={editingValue}
              setEditingValue={setEditingValue}
              priorityClassByValue={priorityClassByValue}
            />
          ))
        )}
      </div>
    </article>
  );
}

export default TaskColumn;
