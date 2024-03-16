import React from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

const events = [
  {
    start: new Date("2024-03-20"),
    end: new Date("2024-03-21"),
    eventClasses: "optionalEvent",
    title: "test event",
    description: "This is a test description of an event",
  },
  {
    start: new Date("2015-07-19"),
    end: new Date("2015-07-25"),
    title: "test event",
    description: "This is a test description of an event",
    data: "you can add what ever random data you may want to use later",
  },
]

const MyCalendar = (props) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      padding: "20px",
    }}
  >
    <div style={{ height: 700, width: "100%", maxWidth: 800 }}>
      <Calendar
        localizer={localizer}
        events={events.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  </div>
)

export default MyCalendar
