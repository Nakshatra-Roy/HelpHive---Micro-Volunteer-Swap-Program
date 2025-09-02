import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import toast, { Toaster } from 'react-hot-toast';

const locales = { "en-US": require("date-fns/locale/en-US") }; 

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const navigate = useNavigate();
  const { tasks, fetchTask } = useTaskStore();
  const { user } = useAuth();
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    if (tasks.length === 0) {
      fetchTask();
    }
  }, [fetchTask, tasks.length]);

  // --- THIS IS THE CORRECTED LOGIC ---
  useEffect(() => {
    if (user && tasks.length > 0) {
      const myRelevantTasks = tasks.filter(task => {
        // Robust check for tasks you posted
        const postedTask = (task.postedBy?._id || task.postedBy) === user?._id;

        // Correctly checks for tasks you are helping with by using helper._id
        const helpingTask = task.helpersArray?.some(
          (helper) => helper._id === user?._id
        );
        
        return postedTask || helpingTask;
      });

      const formattedEvents = myRelevantTasks.map(task => {
        const eventDate = new Date(task.date); 
        eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset());
        
        // This check needs to be robust too
        const postedTask = (task.postedBy?._id || task.postedBy) === user?._id;
        
        return {
          title: task.taskName,
          start: eventDate,
          end: eventDate,
          eventType: postedTask ? 'posted' : 'helping',
        };
      });

      setCalendarEvents(formattedEvents);
    }
  }, [tasks, user]);


  const eventStyleGetter = (event) => {
    // ... no change here
  };

  const handleEventClick = (event) => {
    navigate('/myTasks');
  };

  return (
    <div className="card glass">
      <Link to="/mytasks" className="btn glossy primary" style={{ marginBottom: 24 }}>
            ← My Tasks
          </Link>
      <h2 className="text-xl font-bold mb-4">My Task Calendar</h2>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick} 
        defaultDate={new Date()}
        defaultView={Views.MONTH}
         onNavigate={(newDate) => console.log("Navigated to:", newDate)}
      />
      <Toaster
            position="bottom-right"
            reverseOrder={false}
          />
    </div>
  );
}
