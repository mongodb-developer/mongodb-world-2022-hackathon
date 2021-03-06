import React from "react";
import Link from "next/link";

const Event = ({ event }) => {
  return (
    <Link href={event.SourceURL}>
      <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition">
        <div className="flex items-end justify-end h-56 w-full bg-cover relative">
          <img
            src={event.Image || "https://place-hold.it/310x224" }
            alt={event.Title}
            className="absolute z-0 object-cover w-full h-full"
            onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "https://place-hold.it/310x224";
            }}
          />
        </div>
        <div className="px-5 py-3">
          <h3 className="text-gray-700">{event.Title}</h3>
          <span className="text-gray-500 mt-2">{event.Day}</span>
        </div>
      </div>
    </Link>
  );
};

export default Event;
