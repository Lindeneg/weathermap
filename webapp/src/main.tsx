import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { DataProvider } from "./context/data-provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <DataProvider>
            <App />
        </DataProvider>
    </StrictMode>
);
