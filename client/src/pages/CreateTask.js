import { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import "./Landing.css";

const CreateTask = () => {
	const [newTask, setNewTask] = useState({
		taskName: "",
		taskDescription: "",
        category: "",
        location: "",
        helpersReq: "",
		taskDescription: "",
		date: "",
		priority: "",
	});

	const { createTask } = useTaskStore();

	const handleAddTask = async () => {
		
		const { success, message } = await createTask(newTask);
		if (!success) {
			alert(`Error: ${message}`);
		} else {
			alert("Success: Task created successfully!");
		}
		setNewTask({ taskName: "",
			taskDescription: "",
            category: "",
            location: "",
            helpersReq: 1,
			date: "",
			priority: "",});
	};

	return (
		<div className="container">
  		<div className="grid gap-4">
    		<h1 className="hero-title">Create New Task</h1>
		<div className="card">
      	<div className="grid gap-4">
			<label className="label">Task Name</label>
			<input
			placeholder="Enter task name"
			name="taskName"
			value={newTask.taskName}
			onChange={(e) =>
				setNewTask({ ...newTask, taskName: e.target.value })
			}
			className="input glass-input"
			/>

			<label className="label">Task Description</label>
			<input
			placeholder="Describe the task in detail"
			name="taskDescription"
			type="text"
			value={newTask.taskDescription}
			onChange={(e) =>
				setNewTask({ ...newTask, taskDescription: e.target.value })
			}
			className="input glass-input"
			/>

			<label className="label">Category</label>
			<input
			placeholder="Tutor, Gardener, etc."
			name="category"
			value={newTask.category}
			onChange={(e) =>
				setNewTask({ ...newTask, category: e.target.value })
			}
			className="input glass-input"
			/>

			<label className="label">Location</label>
			<input
			placeholder="Road, City/State, etc."
			name="location"
			value={newTask.location}
			onChange={(e) =>
				setNewTask({ ...newTask, location: e.target.value })
			}
			className="input glass-input"
			/>

			<label className="label">No of Helpers Required</label>
			<input
			placeholder="1/2/3 etc."
			name="helpersReq"
			type="number"
			min={1}
			value={newTask.helpersReq}
			onChange={(e) =>
				setNewTask({ ...newTask, helpersReq: Number(e.target.value) })
			}
			className="input glass-input"
			/>

			<label className="label">Due Date</label>
			<input
			placeholder="19th August"
			name="date"
			type="date"
			value={newTask.date}
			onChange={(e) =>
				setNewTask({ ...newTask, date: Date(e.target.value) })
			}
			className="input glass-input"
			/>

			<label className="label">Priority</label>
			<select
			name="priority"
			value={newTask.priority}
			onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
			className="input glass-input"
			>
			<option value="" disabled>
				Select Priority
			</option>
			<option value="Low">Low</option>
			<option value="Medium">Medium</option>
			<option value="High">High</option>
			</select>


        <button className="btn glossy primary" onClick={handleAddTask}>
          Create Task
        </button>
      </div>
    </div>
  </div>
  <style>
  {`
    .card {
      border-radius: 20px;
      padding: 24px;
    }

    .input {
      border-radius: 12px;
      padding: 10px 16px;
      font-size: 16px;
    }
  `}
</style>

</div>

	);
};

export default CreateTask;
