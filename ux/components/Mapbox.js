import React, { useRef, useEffect } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "!mapbox-gl";
import { useRouter } from "next/router";

const Hero = ({ mapboxAccessToken, heatmapData }) => {

    const router = useRouter();

  mapboxgl.accessToken = mapboxAccessToken;

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if(map.current) return;
    map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v10",
        center: [-20.67, 34.5994],
        zoom: 2
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
    map.current.on("click", (e) => {
        router.push({
            pathname: `/events`,
            query: { lat: e.lngLat.lat, lng: e.lngLat.lng }
        });
    });
  });

  return (
    <div className="h-96 rounded-md overflow-hidden bg-cover bg-center relative">
        <div ref={mapContainer} className="h-full" />
    </div>
  );
};

export default Hero;
