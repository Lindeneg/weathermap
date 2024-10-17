import express from "express";

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

app.get("/ping", (_, res) => {
    res.status(200).json({ message: "pong" });
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
