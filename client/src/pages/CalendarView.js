import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Import everything for the calendar
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": require("date-fns/locale/en-US") }; 
// mm.dd.yyyy

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
// format: how to format dates for display
// parse: how to read/convert string dates into JS Date objects
// startOfWeek: defines which day a week starts on (Sunday vs Monday)
// getDay: gets the numeric day of the week from a date
// locales: the locale map you defined above
// these are functions, not variables we are setting


export default function CalendarPage() {
  const navigate = useNavigate();
  const { tasks, fetchTask } = useTaskStore();
  const { user } = useAuth();
  const [calendarEvents, setCalendarEvents] = useState([]);
  // empty initial arrays

  useEffect(() => {
    if (tasks.length === 0) {
      fetchTask();
      // runs after the component first renders and whenever fetchTask or tasks.length changes
    }
  }, [fetchTask, tasks.length]);
  // these values are the dependencies of the above

  useEffect(() => {
    if (user && tasks.length > 0) {
      const myRelevantTasks = tasks.filter(task => {
        const postedTask = task.postedBy === user._id;
        const helpingTask = task.helpersArray?.some(
          (helper) => helper.user === user._id || helper.user?._id === user._id
        );
        return postedTask || helpingTask;
      });
      // user?._id so that no error occurs if user is undefined

      const formattedEvents = myRelevantTasks.map(task => {
        const eventDate = new Date(task.date); 
        eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset());
        // convert to local time

        const postedTask = task.postedBy === user._id;
        
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
    let style = {
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      cursor: 'pointer'
    };
    
    if (event.eventType === 'posted') {
      style.backgroundColor = '#3174ad';
    } else if (event.eventType === 'helping') {
      style.backgroundColor = '#4caf50';
    }
    return {
      style: style
    };
  };

  const handleEventClick = (event) => {
    // event is the object(task) that was clicked on
    navigate('/myTasks');
  };

  return (
    <div className="p-4">
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
    </div>
    // events: myTasks
    // eventStyleGetter: for color coding
  );
}