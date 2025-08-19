import { useState } from "react";
import { useTaskStore } from "../store/taskStore";

const CreateTask = () => {
	const [newTask, setNewTask] = useState({
		taskName: "",
		taskDescription: "",
        category: "",
        location: "",
        helpersReq: 1,
		date: "",
		priority: "Medium",
		credits: 1
	});

  const [notice, setNotice] = useState(null); // { type: 'success' | 'warning' | 'error', message }
  const [loading, setLoading] = useState(false);
  const { createTask } = useTaskStore();

  const show = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3000);
  };

  const onChange = (key, value) => setNewTask((prev) => ({ ...prev, [key]: value }));

  const handleAddTask = async (e) => {
    e?.preventDefault();

    const required = [
      ["taskName", newTask.taskName],
      ["taskDescription", newTask.taskDescription],
      ["category", newTask.category],
      ["location", newTask.location],
      ["date", newTask.date],
      ["priority", newTask.priority],
      ["helpersReq", newTask.helpersReq],
      ["credits", newTask.credits]
    ];

    const missing = required.filter(([, v]) => !String(v || "").trim()).map(([k]) => k);
    if (missing.length) {
      show("warning", `Please fill: ${missing.join(", ")}`);
      return;
    }

    try {
      setLoading(true);
      const { success, message } = await createTask(newTask);
      if (!success) throw new Error(message || "Task creation failed");
      show("success", "Task created successfully!");
      setNewTask({
        taskName: "",
        taskDescription: "",
        category: "",
        location: "",
        helpersReq: 1,
        date: "",
        priority: "",
        credits: 1
      });
    } catch (err) {
      show("error", err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const pillClass =
    notice?.type === "success"
      ? "pill easy"
      : notice?.type === "warning"
      ? "pill medium"
      : notice?.type === "error"
      ? "pill hard"
      : "pill";

  return (
    <>
      <div className="backdrop">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="grid-overlay" />
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Create New Task</h2>
          </div>

          {notice && (
            <div className={pillClass} role="status" aria-live="polite" style={{ marginBottom: 14, display: "inline-block" }}>
              {notice.message}
            </div>
          )}

          <div className="card glass">
            <form onSubmit={handleAddTask} className="offer-form">
              <div className="form-shell">
                <div className="field">
                  <label className="label">Task Name</label>
                  <input
                    className="input glass-input"
                    placeholder="Enter task name"
                    value={newTask.taskName}
                    onChange={(e) => onChange("taskName", e.target.value)}
                  />
                </div>

                <div className="field">
                  <label className="label">Task Description</label>
                  <textarea
                    className="input glass-input textarea"
                    placeholder="Describe the task in detail"
                    value={newTask.taskDescription}
                    onChange={(e) => onChange("taskDescription", e.target.value)}
                  />
                </div>

                <div className="grid cols-2 gap">
                  <div className="field">
                    <label className="label">Category</label>
                    <input
                      className="input glass-input"
                      placeholder="e.g., Gardening, Tutoring"
                      value={newTask.category}
                      onChange={(e) => onChange("category", e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Location</label>
                    <input
                      className="input glass-input"
                      placeholder="Road, Area"
                      value={newTask.location}
                      onChange={(e) => onChange("location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid cols-2 gap">
                  <div className="field">
                    <label className="label">Helpers Required</label>
                    <input
                      type="number"
                      min={1}
                      className="input glass-input"
                      value={newTask.helpersReq}
                      onChange={(e) => onChange("helpersReq", Math.max(1, parseInt(e.target.value || "1", 10)))}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Due Date</label>
                    <input
                      type="date"
                      className="input glass-input"
                      value={newTask.date}
                      onChange={(e) => onChange("date", e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Priority</label>
                  <select
                    className="input glass-input"
                    value={newTask.priority}
                    onChange={(e) => onChange("priority", e.target.value)}
                  >
                    <option value="" disabled>
                      Select Priority
                    </option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="grid cols-2 gap">
                  <div className="field">
                    <label className="label">Credits Awarded (each helper, per hour of work)*</label>
                    <input
                      type="number"
                      min={1}
                      className="input glass-input"
                      value={newTask.credits}
                      onChange={(e) => onChange("credits", Math.max(1, parseInt(e.target.value || "1", 10)))}
                    />
                  </div>
				  <br/>
				  <p>* Choose this field carefuly as it may affect the chances of a potential helper accepting your task!</p>
                </div>

                <div className="actions">
                  <button
                    type="submit"
                    className="btn glossy primary"
                    disabled={loading}
                    style={{ opacity: loading ? 0.8 : 1 }}
                  >
                    {loading ? "Creating..." : "Create Task"}
                  </button>
                  <button
                    type="button"
                    className="btn glossy ghost"
                    onClick={() =>
                      setNewTask({
                        taskName: "",
                        taskDescription: "",
                        category: "",
                        location: "",
                        helpersReq: 1,
                        date: "",
                        priority: "",
                        credits: 1
                      })
                    }
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <style>
        {`
          .offer-form .form-shell {
            padding: 16px;
          }

          .offer-form .field {
            margin-bottom: 14px;
          }

          .offer-form .label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
          }

          .offer-form .input.glass-input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(8px) saturate(120%);
            -webkit-backdrop-filter: blur(8px) saturate(120%);
            transition: box-shadow .2s ease, transform .1s ease, border-color .2s ease;
          }

          .offer-form .input.glass-input:focus {
            outline: none;
            border-color: rgba(16,185,129,0.5);
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
          }

          .offer-form .textarea {
            min-height: 120px;
            resize: vertical;
          }

          .offer-form .grid.cols-2.gap {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .offer-form .actions {
            display: flex;
            gap: 12px;
            margin-top: 18px;
          }

          @media (max-width: 640px) {
            .offer-form .grid.cols-2.gap {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </>
  );
};

export default CreateTask;