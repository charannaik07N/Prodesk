import TaskColumn from "./TaskColumn";

function Inprogress(props) {
  return (
    <TaskColumn
      id="inprogress"
      title="In Progress"
      previousColumn={{ id: "todo", title: "To Do" }}
      nextColumn={{ id: "done", title: "Done" }}
      {...props}
    />
  );
}

export default Inprogress;
