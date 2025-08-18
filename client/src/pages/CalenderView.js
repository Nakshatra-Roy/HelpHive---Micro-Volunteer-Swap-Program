import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/tasks") // replace with your API endpoint
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.map((task) => {

          const eventDate = new Date(task.date);
          eventDate.setHours(0, 0, 0, 0);

          return {
            title: task.title,
            start: eventDate,
            end: eventDate,
          };
        });
        setEvents(formattedEvents);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Monthly Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={{ month: true }}
        defaultView={Views.MONTH}
        toolbar={true}
      />
    </div>
  );
}
