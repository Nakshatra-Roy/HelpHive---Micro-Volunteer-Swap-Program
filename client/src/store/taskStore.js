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
        tasks: [...state.tasks, response.data],
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
  acceptTask: async (taskId, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/tasks/${taskId}/accept`, { userId });
      set((state) => ({
        tasks: state.tasks.map(task => 
          task._id === taskId ? { ...task, acceptedBy: [...(task.acceptedBy || []), userId] } : task
        ),
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
  }
}));