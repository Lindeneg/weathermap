import fs from "fs/promises";

class CSVSeedService {
    constructor(dataContext, csvPath, columns, columnMapper, transformValue) {
        this.dataContext = dataContext;
        this.csvPath = csvPath;
        this.columns = columns;
        this.columnMapper = columnMapper;
        this.transformValue = transformValue;
    }

    makeRow(line) {
        const values = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        if (values.length !== this.columns.length) {
            console.error(
                "Seed Error, Invalid line",
                line,
                "Columns",
                values.length,
                "Expected",
                this.columns.length
            );
            return null;
        }
        return this.columns.reduce((acc, column, index) => {
            const mappedColumn = this.columnMapper[column];
            const value = values[index];
            if (!mappedColumn) return acc;
            const transformed = this.transformValue(mappedColumn, value);
            if (transformed === "") return acc;
            acc[mappedColumn] = transformed;
            return acc;
        }, {});
    }

    async seed() {
        try {
            const csv = await fs.readFile(this.csvPath, {
                encoding: "utf-8",
            });
            const lines = csv.split("\n").slice(1);
            const rows = [];
            for (const line of lines) {
                if (!line) continue;
                const row = this.makeRow(line);
                if (!row) continue;
                rows.push(row);
            }
            await this.dataContext.insertBulk(rows);
            console.log("Seeded", rows.length, "entities");
        } catch (error) {
            console.error(error);
        }
    }
}

export default CSVSeedService;
