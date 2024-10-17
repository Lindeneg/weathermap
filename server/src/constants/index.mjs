import path from "path";

export const dataPath = path.join(import.meta.dirname, "..", "..", "data");

export const columns = [
    "city",
    "city_ascii",
    "lat",
    "lng",
    "country",
    "iso2",
    "iso3",
    "admin_name",
    "capital",
    "population",
    "id",
];

export const columnMapper = {
    city: "city",
    city_ascii: "name",
    admin_name: "administrative",
    lat: "lat",
    lng: "lng",
    country: "country",
    population: "population",
};
