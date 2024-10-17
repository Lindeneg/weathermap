import sqlite3 from "sqlite3";

export default class DataContext {
    constructor(connectionString) {
        this.connectionString = connectionString;
        this.db = null;
    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.connectionString, (err) => {
                if (err) reject(err);
            });
            this.db.on("open", () => {
                resolve(this);
            });
        });
    }

    sql(str, method = "get", ...params) {
        return new Promise((resolve) => {
            this.db[method](str, ...params, function (...args) {
                resolve([...args, this]);
            });
        });
    }

    static async createAndConnect(connectionString) {
        const context = new DataContext(connectionString);
        return context.initialize();
    }
}
