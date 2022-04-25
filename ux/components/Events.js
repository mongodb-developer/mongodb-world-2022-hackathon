import React from "react";
import Event from "./Event";

const Events = ({ events }) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
      {events.map((event) => (
        <Event key={event._id} event={event} />
      ))}
    </div>
  );
};

export default Events;
