import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTaskStore } from "../store/taskStore";
import { useAuth } from "../context/AuthContext";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";

const ViewTasks = () => {
  const { tasks, loading, fetchTask, acceptTask } = useTaskStore();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    priority: "",
    sortCredits: "desc", // ✅ default
  });
  const [acceptPending, setAcceptPending] = useState(new Set());

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // Unique dropdown values
  const categories = useMemo(
    () => [...new Set((tasks || []).map((t) => t.category).filter(Boolean))],
    [tasks]
  );
  const locations = useMemo(
    () => [...new Set((tasks || []).map((t) => t.location).filter(Boolean))],
    [tasks]
  );
  const priorities = useMemo(
    () => [...new Set((tasks || []).map((t) => t.priority).filter(Boolean))],
    [tasks]
  );

  // Apply filters (excluding sorting here)
  const filteredTasks = useMemo(() => {
    const s = filters.search.trim().toLowerCase();
    return (tasks || []).filter((t) => {
      const bySearch = s ? (t.taskName || "").toLowerCase().includes(s) : true;
      const byCategory = filters.category ? t.category === filters.category : true;
      const byLocation = filters.location ? t.location === filters.location : true;
      const byPriority = filters.priority ? t.priority === filters.priority : true;
      return bySearch && byCategory && byLocation && byPriority;
    });
  }, [tasks, filters]);

  // Accept handler
  const handleAcceptTask = async (task) => {
    if (!task?._id || !user?._id) return;
    const cur = task.curHelpers || 0;
    const req = task.helpersReq || 0;
    if (cur >= req) {
      alert("This task is already full.");
      return;
    }

    setAcceptPending((prev) => new Set(prev).add(task._id));
    try {
      const { success, message } = await acceptTask(task, user._id);
      if (!success) alert(`Error: ${message}`);
      else alert("Task accepted successfully!");
    } catch {
      alert("Error accepting task");
    } finally {
      setAcceptPending((prev) => {
        const s = new Set(prev);
        s.delete(task._id);
        return s;
      });
    }
  };

  return (
    <section className="section">
      <div className="container">
        {/* Filters */}
        <TaskFilters
          onFilterChange={setFilters}
          categories={categories}
          locations={locations}
          priorities={priorities}
        />

        <h2>All Tasks</h2>

        {/* Table now gets filters.sortCredits passed as sortOrder */}
        <TaskTable
          tasks={filteredTasks}
          loading={loading}
          userId={user?._id}
          busyIds={acceptPending}
          onAccept={handleAcceptTask}
          sortOrder={filters.sortCredits} // ✅ pass sort order
        />

        {!loading && filteredTasks.length === 0 && (
          <p style={{ marginTop: 16, textAlign: "center", color: "#6b7280" }}>
            No tasks found 😢{" "}
            <Link to="/createTask" className="admin-link">
              Create a task
            </Link>
          </p>
        )}
      </div>
    </section>
  );
};

export default ViewTasks;
