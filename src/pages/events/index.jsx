import React from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import EventCards from "../../components/EventCards"

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
      backgroundColor: "#f2f3ef",
      height: "calc(100vh - 110px)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <EventCards />
  </div>
)

export default MyCalendar
