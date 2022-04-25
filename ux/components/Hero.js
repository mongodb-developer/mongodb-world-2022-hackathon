import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "!mapbox-gl";

const Hero = ({ mapboxAccessToken, heatmapData }) => {

  mapboxgl.accessToken = mapboxAccessToken;

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if(map.current) return;
    map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v10",
        center: [-70.9, 42.35],
        zoom: 3
    });
    map.current.on("load", () => {
        map.current.addSource("news", {
            "type": "geojson",
            "data": heatmapData
        });
        map.current.addLayer(
            {
                "id": "news-events",
                "type": "heatmap",
                "source": "news"
            },
            "waterway-label"
        )
    });
  });

  return (
    <div className="h-96 rounded-md overflow-hidden bg-cover bg-center relative">
        <div ref={mapContainer} className="map-container h-full" />
      {/* <Image
        src="/images/hero.jpg"
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className="absolute z-0"
      />
      <div className="bg-gray-900 bg-opacity-60 flex items-center h-full absolute w-full z-10">
        <div className="px-10 max-w-xl">
          <h2 className="text-2xl text-white font-semibold">Tech Shirts</h2>
          <p className="mt-2 text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque
            atque recusandae ipsum odio possimus soluta!
          </p>
          <Link href={`/products`}>
            <button className="flex items-center mt-4 px-3 py-2 bg-green-600 text-white text-sm uppercase font-medium rounded hover:bg-green-500 focus:outline-none focus:bg-green-500">
              <span>Shop Now</span>
              <ArrowNarrowRightIcon className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default Hero;
