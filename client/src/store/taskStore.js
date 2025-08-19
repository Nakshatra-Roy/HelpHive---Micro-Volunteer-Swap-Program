import { create } from 'zustand';
import axios from 'axios';



export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,
  
  // Fetch all tasks
  fetchTask: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:5001/api/tasks');
      set({ tasks: response.data.data, loading: false });
      return { success: true, message: 'Tasks fetched successfully' };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch tasks', 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || 'Failed to fetch tasks' };
    }
  },
  
  // Create a new task
  createTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/tasks', taskData);
      set((state) => ({
  tasks: [...state.tasks, response.data.data],
  loading: false
}));

      return { success: true, message: 'Task created successfully' };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create task', 
        loading: false 
      });
      return { success: false, message: error.response?.data?.message || 'Failed to create task' };
    }
  },
  
  // Accept a task
 acceptTask: async (task, userId) => {
  if (!userId) {
    return { success: false, message: 'You have to be logged in to accept tasks' };
  }

  if (userId === task.postedBy) {
    return { success: false, message: 'You cannot accept your own tasks' };
  }

  set({ loading: true, error: null });
  try {
    const response = await axios.put(`/api/tasks/${task._id}/accept`, { userId });
    set((state) => ({
  tasks: state.tasks.map(t => t._id === task._id ? response.data.data : t),
  loading: false
    }));

    return { success: true, message: 'Task accepted successfully' };
  } catch (error) {
    set({ 
      error: error.response?.data?.message || 'Failed to accept task', 
      loading: false 
    });
    return { success: false, message: error.response?.data?.message || 'Failed to accept task' };
  }
},

completeTask: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/tasks/${taskId}/complete`);
      set((state) => ({
        tasks: state.tasks.map(t =>
          t._id === taskId ? { ...t, status: 'completed' } : t
        ),
        loading: false
      }));

      return { success: true, message: response.data.message };

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to complete task';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

}));
