import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTaskStore } from "../store/taskStore";
import TaskTable from "../components/TaskTable";

const ViewTasks = () => {
  const { fetchTask, tasks } = useTaskStore();

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return (

      <div>
        <TaskTable />
        {tasks.length === 0 && (
          <p style={{ marginTop: "16px", textAlign: "center", color: "#6b7280" }}>
            No tasks found 😢{" "}
            <Link to="/createTask" className="admin-link">
              Create a task
            </Link>
          </p>
        )}
      </div>
  );
};


export default ViewTasks;