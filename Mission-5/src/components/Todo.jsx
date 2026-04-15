import TaskColumn from "./TaskColumn";

function Todo(props) {
  return (
    <TaskColumn
      id="todo"
      title="To Do"
      previousColumn={null}
      nextColumn={{ id: "inprogress", title: "In Progress" }}
      {...props}
    />
  );
}

export default Todo;
