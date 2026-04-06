import "../App.css";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "In Progress":
        return "badge-in-progress";
      case "Completed":
        return "badge-completed";
      default:
        return "";
    }
  };

  return (
    <div className="task-card">
      <div className="task-info">
        <div className="task-text">
          <div className="task-header-row">
            <h3 className="task-title">{task.title}</h3>
            {task.status !== "Pending" && (
              <span className={`status-badge ${getStatusClass(task.status)}`}>
                {task.status}
              </span>
            )}
          </div>
          <p className="task-desc">{task.description}</p>
        </div>
      </div>
      <div className="task-actions">
        <button className="btn btn-outline btn-sm" onClick={onEdit}>Edit</button>
        <button className="btn btn-outline btn-sm" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
