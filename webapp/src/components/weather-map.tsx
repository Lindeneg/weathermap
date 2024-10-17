import { useRef, useEffect } from "react";
import mapboxgl, { type Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface WeatherMapProps {
    apiKey: string;
}

const WeatherMap = ({ apiKey }: WeatherMapProps) => {
    const mapRef = useRef<MapboxMap | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) {
            return;
        }

        mapboxgl.accessToken = apiKey;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            zoom: 2,
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    return (
        <div
            id="map-container"
            className="w-full h-full"
            ref={mapContainerRef}
        />
    );
};

export default WeatherMap;
