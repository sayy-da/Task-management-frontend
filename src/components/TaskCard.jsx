import "../App.css";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "var(--text-muted)";
      case "In Progress":
        return "var(--in-progress)";
      case "Completed":
        return "var(--completed)";
      default:
        return "var(--text-muted)";
    }
  };

  return (
    <div className="task-card fade-in">
      <div className="task-info">
        <div 
          className="status-dot" 
          style={{ backgroundColor: getStatusColor(task.status) }}
        ></div>
        <div className="task-text">
          <h3 className="task-title">{task.title}</h3>
          <p className="task-desc">{task.description}</p>
        </div>
      </div>
      <div className="task-actions">
        <button 
          className="btn-icon" 
          onClick={onEdit}
          title="Edit Task"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button 
          className="btn-icon btn-icon-danger" 
          onClick={onDelete}
          title="Delete Task"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
