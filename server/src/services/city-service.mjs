import { handleGetResult } from "../utils/index.mjs";

export default class CityService {
    constructor(dataContext) {
        this.dataContext = dataContext;
        this.queryCache = {};
    }

    static makeDisplayName(city, country, administrative) {
        if (!administrative || administrative === city) {
            return `${city}, ${country}`;
        }
        return `${city}, ${administrative}, ${country}`;
    }

    async hasAny() {
        const [err, ctx] = handleGetResult(
            await this.dataContext.sql("SELECT COUNT(*) FROM cities")
        );
        if (err) return false;
        return ctx["COUNT(*)"] > 0;
    }

    async insertBulk(cities) {
        const q =
            "INSERT INTO cities (city, name, display, lat, lng, country, population) VALUES ";
        const values = cities.map(
            ({ city, name, lat, lng, country, population, administrative }) =>
                `("${city}", "${name}", "${CityService.makeDisplayName(
                    name,
                    country,
                    administrative
                )}", ${lat}, ${lng}, "${country}", ${population})`
        );
        const [err] = await this.dataContext.sql(
            q + values.join(",") + ";",
            "exec"
        );
        if (err) {
            console.error("Error inserting bulk cities", err);
        }
        return err;
    }

    async get(query, limit, offset) {
        const key = `${query}-${limit}-${offset}`;
        if (this.queryCache[key]) {
            return this.queryCache[key];
        }
        const [, rows] = handleGetResult(
            await this.dataContext.sql(
                "SELECT * FROM cities WHERE LOWER(name) LIKE LOWER(?) ORDER BY name LIMIT ? OFFSET ?",
                "all",
                query + "%",
                limit,
                offset
            )
        );
        this.queryCache[key] = rows ?? [];
        return rows;
    }

    // https://en.wikipedia.org/wiki/Haversine_formula
    async closestCity(lat, lng) {
        const [_, row] = handleGetResult(
            await this.dataContext.sql(
                `SELECT *,
    6371 * 2 * ASIN(SQRT(
        POWER(SIN(((lat - ?) * PI() / 180) / 2), 2) +
        COS(? * PI() / 180) * COS(lat * PI() / 180) *
        POWER(SIN(((lng - ?) * PI() / 180) / 2), 2)
    )) AS distance
FROM
    cities
ORDER BY
    distance ASC
LIMIT 1`,
                "get",
                lat,
                lat,
                lng
            )
        );
        return row;
    }

    async featureCollection() {
        if (this.queryCache["featureCollection"]) {
            return this.queryCache["featureCollection"];
        }
        const [err, rows] = handleGetResult(
            await this.dataContext.sql("SELECT * FROM cities", "all")
        );
        if (!rows) {
            console.error("Error getting feature collection", err);
            return { type: "FeatureCollection", features: [] };
        }
        const collection = {
            type: "FeatureCollection",
            crs: {
                type: "name",
                properties: {
                    name: "urn:ogc:def:crs:OGC:1.3:CRS84",
                },
            },
            features: rows.map((city) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [city.lng, city.lat],
                },
                properties: {
                    ...city,
                },
            })),
        };
        this.queryCache["featureCollection"] = collection;
        return collection;
    }

    async createTable() {
        const [err] = await this.dataContext.sql(
            `CREATE TABLE IF NOT EXISTS cities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                city TEXT NOT NULL,
                name TEXT NOT NULL,
                display TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                country TEXT NOT NULL,
                population INTEGER
            );`,
            "exec"
        );
        if (err) {
            console.error("Error creating table", err);
        }
        return err;
    }
}
