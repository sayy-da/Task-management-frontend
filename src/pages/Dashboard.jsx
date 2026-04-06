import { useEffect, useState } from "react";
import { TaskService } from "../services/task.service";
import { useTasks } from "../hooks/useTasks";
import TaskList from "../components/TaskList";
import FilterTabs from "../components/FilterTabs";
import TaskModal from "../components/TaskModal";
import "../App.css";

const Dashboard = () => {
  const taskService = new TaskService();
  const [isOpen, setIsOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("All");

  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  } = useTasks(taskService);

  useEffect(() => {
    fetchTasks(filter);
  }, [filter]);

  const handleEdit = (task) => {
    setEditTask(task);
    setIsOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editTask) {
        await updateTask(editTask._id, data);
      } else {
        await createTask(data);
      }
      setIsOpen(false);
      setEditTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !tasks.length) return (
    <div className="card fade-in">
      <div className="card-header">
        <h1>Loading...</h1>
      </div>
      <div className="dashboard-wrapper">
        <div className="skeleton-list">
          <div className="skeleton"></div>
          <div className="skeleton"></div>
          <div className="skeleton"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card fade-in">
    <div className="card-header dashboard-header">
      <h1 className="dashboard-title">Task Dashboard</h1>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Add Task
      </button>
    </div>

      <div className="dashboard-wrapper">
        <div className="controls-bar">
          <FilterTabs filter={filter} setFilter={setFilter} />
        </div>

        {error ? (
          <div className="state-container">
            <div className="state-icon">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#ef9500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2 className="state-title">Something went wrong</h2>
            <p className="state-desc">Please try again later</p>
          </div>
        ) : !tasks.length ? (
          <div className="state-container">
            <div style={{ marginBottom: '1rem' }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M9 15l2 2 4-4"></path>
              </svg>
            </div>
            <h2 className="state-title">No tasks found</h2>
            <p className="state-desc">Get started by creating a new task!</p>
            <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
              Add Task
            </button>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        )}
      </div>

      <TaskModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditTask(null);
        }}
        onSubmit={handleSubmit}
        initialData={editTask}
      />
    </div>
  );
};

export default Dashboard;