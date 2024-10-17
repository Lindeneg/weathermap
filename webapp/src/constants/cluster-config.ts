import constants from "@/constants";
import type { LayerSpecification } from "mapbox-gl";

export const citySource = {
    id: "cities",
    opts: {
        type: "geojson",
        data: `${constants.SERVER_URL}/geojson`,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    },
} as const;

// Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
export const clusterLayer: LayerSpecification = {
    id: "clusters",
    type: "circle",
    source: citySource.id,
    filter: ["has", "point_count"],
    paint: {
        // with three steps to implement three types of circles:
        //   * Blue, 10px circles when point count is less than 100
        //   * Yellow, 15px circles when point count is between 100 and 750
        //   * Pink, 20px circles when point count is greater than or equal to 750
        "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 10, 100, 15, 750, 20],
    },
} as const;

export const clusterCountLayer: LayerSpecification = {
    id: "cluster-count",
    type: "symbol",
    source: citySource.id,
    filter: ["has", "point_count"],
    layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
    },
} as const;

export const unclusteredLayer: LayerSpecification = {
    id: "unclustered-point",
    type: "circle",
    source: citySource.id,
    filter: ["!", ["has", "point_count"]],
    paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
    },
} as const;
