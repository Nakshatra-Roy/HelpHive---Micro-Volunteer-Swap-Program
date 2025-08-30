import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTaskStore } from "../store/taskStore";
import { useAuth } from "../context/AuthContext";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import TaskTableAdmin from "../components/TaskTableAdmin";
import toast, { Toaster } from 'react-hot-toast';

const ViewTasks = () => {
  const { tasks, loading, fetchTask, acceptTask } = useTaskStore();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    priority: "",
    sortCredits: "desc",
  });
  const [acceptPending, setAcceptPending] = useState(new Set());
  const [showSuggested, setShowSuggested] = useState(false);
  const [matchSkill, setMatchSkill] = useState(true);  
  const [matchLocation, setMatchLocation] = useState(false); 
  const isLoggedInAdmin = user && user.role === "admin";
  const isLoggedIn = user && (user.role === "user" || user.role === "volunteer");

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

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

  const suggestedTasks = useMemo(() => {
    if (!user) return [];
    const userSkills = (user.skills || []).map((s) => s.toLowerCase());
    const userLocation = (user.location || "").toLowerCase();

    return (tasks || []).filter((t) => {
      const categoryMatch = matchSkill
      ? userSkills.includes((t.category || "").toLowerCase())
      : false;
      const locationMatch = matchLocation
      ? (t.location || "").toLowerCase() === userLocation
      : false;

      if (!matchSkill && !matchLocation) return false;
      if (matchSkill && matchLocation) return categoryMatch && locationMatch;
      return categoryMatch || locationMatch;
    });
    }, [tasks, user, matchSkill, matchLocation]);

	const filteredSuggestedTasks = useMemo(() => {
	const s = filters.search.trim().toLowerCase();
	return (suggestedTasks || []).filter((t) => {
		const bySearch = s ? (t.taskName || "").toLowerCase().includes(s) : true;
		const byCategory = filters.category ? t.category === filters.category : true;
		const byLocation = filters.location ? t.location === filters.location : true;
		const byPriority = filters.priority ? t.priority === filters.priority : true;
		return bySearch && byCategory && byLocation && byPriority;
	});
	}, [suggestedTasks, filters]);

  const handleAcceptTask = async (task) => {
    if (!task?._id || !user?._id) return;
    const cur = task.curHelpers || 0;
    const req = task.helpersReq || 0;
    if (cur >= req) {
      toast.error("This task is already full.");
      return;
    }

    setAcceptPending((prev) => new Set(prev).add(task._id));
    try {
      const { success, message } = await acceptTask(task, user._id);
      if (!success) toast.error(`Error: ${message}`);
      else toast.success("Task accepted successfully!");
    } catch {
      toast.error("Error accepting task");
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
        <TaskFilters
          onFilterChange={setFilters}
          categories={categories}
          locations={locations}
          priorities={priorities}
        />

        <br />
        <h2 className="tasks-header">
          <span>{showSuggested ? "Suggested Tasks" : "All Tasks"}</span>
          {!isLoggedInAdmin && isLoggedIn && (
            <button
              className="btn glossy primary ai"
              onClick={() =>  {
                const next = !showSuggested;
                setShowSuggested(next);
                toast.success(next ? "Showing tasks that match your skills!" : "Showing all tasks.");
              }}
            >
              <span className="ai-icon">✨</span>
              {showSuggested ? "Show All Tasks" : "Suggest Tasks"}
            </button>
          )}
        </h2>

        {showSuggested && !isLoggedInAdmin && (
          <div className="suggest-toggles">
            <label>
              <input
                type="checkbox"
                checked={matchSkill}
                onChange={(e) => setMatchSkill(e.target.checked)}
              />
              Match my Skills
            </label>
            <label>
              <input
                type="checkbox"
                checked={matchLocation}
                onChange={(e) => setMatchLocation(e.target.checked)}
              />
              Show Tasks Nearby
            </label>
          </div>
        )}

        <br />

        {!isLoggedInAdmin && (
          <TaskTable
            tasks={showSuggested ? filteredSuggestedTasks : filteredTasks}
            loading={loading}
            userId={user?._id}
            busyIds={acceptPending}
            onAccept={handleAcceptTask}
            sortOrder={filters.sortCredits}
          />
        )}

        {isLoggedInAdmin && (
          <TaskTableAdmin
            tasks={showSuggested ? filteredSuggestedTasks : filteredTasks}
            loading={loading}
            userId={user?._id}
            busyIds={acceptPending}
            sortOrder={filters.sortCredits}
          />
        )}

        {!loading &&
          (showSuggested ? suggestedTasks.length === 0 : filteredTasks.length === 0) && (
            <p style={{ marginTop: 16, textAlign: "center", color: "#6b7280" }}>
              No tasks found 😢{" "}
              <Link to="/createTask" className="btn tiny under">
                Create a task
              </Link>
            </p>
          )}
      </div>
      <Toaster
            position="bottom-right"
            reverseOrder={false}
          />
    </section>
  );
};

export default ViewTasks;
