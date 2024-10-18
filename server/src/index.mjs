import path from "path";
import express from "express";
import compression from "compression";
import DataContext from "./services/data-context.mjs";
import CityService from "./services/city-service.mjs";
import CSVSeedService from "./services/csv-seed-service.mjs";
import {
    dataPath,
    publicPath,
    columns,
    columnMapper,
} from "./constants/index.mjs";

const dataContext = await DataContext.createAndConnect(
    path.join(dataPath, "cities.db")
);

const cityService = new CityService(dataContext);

if (!(await cityService.hasAny())) {
    console.log("Seeding cities");
    await cityService.createTable();
    await new CSVSeedService(
        cityService,
        path.join(dataPath, "worldcities.csv"),
        columns,
        columnMapper,
        (column, value) => {
            value = value.replace(/"/g, "");
            if (column === "population") {
                return parseInt(value, 10) || null;
            }
            if (column === "lat" || column === "lng") {
                return parseFloat(value);
            }
            return value;
        }
    ).seed();
}

const app = express();

app.use(compression());

app.use(express.static(publicPath));

app.use(express.json());

app.use((_, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=172800");
    next();
});

app.get("/cities", async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const query = req.query.q || "";
    const cities = await cityService.get(query, limit, offset);
    res.status(200).json(cities);
});

app.get("/closest-city", async (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
        res.status(400).json("please supply lat and lng in query params");
        return;
    }
    const city = await cityService.closestCity(lat, lng);
    res.status(200).json(city);
});

app.get("/geojson", async (_, res) => {
    const featureCollection = await cityService.featureCollection();
    res.status(200).json(featureCollection);
});

app.use((error, _, res, next) => {
    if (res.headersSent) return next(error);
    res.status(500).json({
        message: "Something went wrong. Please try again.",
    });
});

app.listen(5000, () => {
    console.log("server started on http://localhost:5000");
});
