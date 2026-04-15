import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({
  task,
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
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-${task.id}`,
      data: { taskId: task.id, status: task.status, type: "task" },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const isEditing = editingTaskId === task.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border-2 rounded-lg p-3 shadow-sm transition-opacity ${priorityClassByValue[task.priority]} ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          className="bg-gray-700 text-white px-3 py-2 text-xs rounded-lg hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-grab active:cursor-grabbing"
          type="button"
          {...listeners}
          {...attributes}
        >
          Drag
        </button>

        <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
          {task.priority}
        </span>

        <button
          className="bg-red-600 text-white px-2 py-1 rounded-lg hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          X
        </button>
      </div>

      {isEditing ? (
        <div className="my-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            className="col-span-1 sm:col-span-2 border border-gray-300 rounded-lg bg-white text-slate-900 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 focus-visible:border-blue-600"
            type="text"
            value={editingValue}
            onChange={(event) => setEditingValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSaveEditing();
              }

              if (event.key === "Escape") {
                onCancelEditing();
              }
            }}
            autoFocus
          />
          <button
            className="border-0 rounded-lg bg-blue-600 text-white cursor-pointer px-3 py-2 font-semibold hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            type="button"
            onClick={onSaveEditing}
          >
            Save
          </button>
          <button
            className="border-0 rounded-lg bg-gray-600 text-white cursor-pointer px-3 py-2 font-semibold hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 col-span-1 sm:col-span-1"
            type="button"
            onClick={onCancelEditing}
          >
            Cancel
          </button>
        </div>
      ) : (
        <p
          className="my-3 p-2 cursor-text leading-snug rounded transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() => onStartEditing(task)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onStartEditing(task);
            }
          }}
          role="button"
          tabIndex="0"
        >
          {task.text}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {previousColumn ? (
          <button
            className="border-0 rounded-lg bg-gray-600 text-white cursor-pointer px-2 py-1 text-xs font-semibold hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            type="button"
            onClick={() => onMove(task.id, previousColumn.id)}
          >
            Move to {previousColumn.title}
          </button>
        ) : null}

        {nextColumn ? (
          <button
            className="border-0 rounded-lg bg-gray-600 text-white cursor-pointer px-2 py-1 text-xs font-semibold hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            type="button"
            onClick={() => onMove(task.id, nextColumn.id)}
          >
            Move to {nextColumn.title}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default TaskCard;
