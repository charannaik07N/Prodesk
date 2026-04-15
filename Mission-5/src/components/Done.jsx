import TaskColumn from "./TaskColumn";

function Done(props) {
  return (
    <TaskColumn
      id="done"
      title="Done"
      previousColumn={{ id: "inprogress", title: "In Progress" }}
      nextColumn={null}
      {...props}
    />
  );
}

export default Done;
