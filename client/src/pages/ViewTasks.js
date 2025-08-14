import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTaskStore } from "../store/taskStore";
import TaskTable from "../components/TaskTable";
import styles from './ViewTasks.module.css';

const ViewTasks = () => {
	const { fetchTask, tasks } = useTaskStore();

	useEffect(() => {
		fetchTask();
	}, [fetchTask]);
	console.log("Tasks:", tasks);

	return (
		<div className={styles.container}>
			<div className={styles.vstack}>
				<p className={styles.heading}>
					Current Tasks
				</p>

				<TaskTable />

				{tasks.length === 0 && (
					<p className={styles.text}>
						No tasks found 😢{" "}
						<Link to={"/createTask"} className={styles.link}>
								Create a task
						</Link>
					</p>
				)}
			</div>
		</div>
	);
};

export default ViewTasks;
