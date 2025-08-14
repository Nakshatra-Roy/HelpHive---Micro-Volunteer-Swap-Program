import { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import styles from './CreateTask.module.css';

const CreateTask = () => {
	const [newTask, setNewTask] = useState({
		taskName: "",
        category: "",
        location: "",
        helpersReq: 1,
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
            category: "",
            location: "",
            helpersReq: 1 });
	};

	return (
		<div className={styles.container}>
			<div className={styles.vstack}>
				<h1 className={styles.heading}>
					Create New Task
				</h1>
				
				<div className={styles.box}>
					<div className={styles.vstack}>
						<input
							placeholder='Task Name'
							name='taskName'
							value={newTask.taskName}
							onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                            className={styles.input}
						/>
						<input
							placeholder='Category'
							name='category'
							value={newTask.category}
							onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                            className={styles.input}
						/>
						<input
							placeholder='Location'
							name='location'
							value={newTask.location}
							onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                            className={styles.input}
						/>
                        <input
							placeholder='No of Helpers Required'
							name='helpersReq'
                            type='number'
							min={1}
							value={newTask.helpersReq}
							onChange={(e) => setNewTask({ ...newTask, helpersReq: Number(e.target.value) })}
                            className={styles.input}
						/>

						<button className={styles.button} onClick={handleAddTask}>
							Create Task
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateTask;
