import { useRef, useEffect } from "react";
import mapboxgl, { type Map as MapboxMap, type Popup } from "mapbox-gl";
import { generateWeatherPopupContent } from "@/lib/map";
import {
    citySource,
    clusterLayer,
    clusterCountLayer,
    unclusteredLayer,
} from "@/constants/cluster-config";
import type { City } from "@/hooks/use-cities";
import type { ScaleKind } from "@/hooks/use-scale";
import "mapbox-gl/dist/mapbox-gl.css";

interface WeatherMapProps {
    apiKey: string;
    selectedCity: City | null;
    scale: ScaleKind;
    onSelect: (city: City) => void;
}

const WeatherMap = ({
    apiKey,
    selectedCity,
    scale,
    onSelect,
}: WeatherMapProps) => {
    const mapRef = useRef<MapboxMap | null>(null);
    const popupRef = useRef<Popup | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) {
            return;
        }

        mapboxgl.accessToken = apiKey;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/lindeneg/cm2ceinlf00a201pgbxk8c9pt",
            zoom: 2,
        });

        const map = mapRef.current!;

        map.on("load", () => {
            map.addSource(citySource.id, citySource.opts);
            map.addLayer(clusterLayer);
            map.addLayer(clusterCountLayer);
            map.addLayer(unclusteredLayer);

            map.on("click", clusterLayer.id, (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["clusters"],
                });
                if (!features || !features.length) return;
                const feature = features[0];
                if (feature.geometry.type !== "Point") return;
                const coordinates = feature.geometry.coordinates as [
                    number,
                    number,
                ];
                const clusterId = feature.properties?.cluster_id;
                if (!clusterId) return;
                const source = map.getSource(citySource.id);
                if (!source || source.type !== "geojson") return;
                source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err) return;
                    map.easeTo({
                        center: coordinates,
                        zoom: zoom ?? 1,
                    });
                });
            });

            map.on("click", unclusteredLayer.id, (e) => {
                if (!e.features || !e.features.length) return;
                onSelect(e.features[0].properties as City);
            });

            map.on("mouseenter", clusterLayer.id, () => {
                map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", clusterLayer.id, () => {
                map.getCanvas().style.cursor = "";
            });
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
        }

        if (!selectedCity) return;

        mapRef.current.flyTo({
            center: [selectedCity.lng, selectedCity.lat],
            zoom: 10,
        });

        popupRef.current = new mapboxgl.Popup({ maxWidth: "600px" })
            .setLngLat([selectedCity.lng, selectedCity.lat])
            .setHTML(generateWeatherPopupContent(selectedCity, scale))
            .addTo(mapRef.current);
    }, [selectedCity, scale]);

    return (
        <div
            id="map-container"
            className="w-full h-full"
            ref={mapContainerRef}
        />
    );
};

export default WeatherMap;
