import React from "react";
import Image from "next/image";
import Link from "next/link";

const Event = ({ event }) => {
  return (
    <Link href={event.SourceURL}>
      <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition">
        <div className="flex items-end justify-end h-56 w-full bg-cover relative">
          <img
            src={event.Image}
            alt={event.Title}
            layout="fill"
            // objectFit="cover"
            className="absolute z-0"
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
