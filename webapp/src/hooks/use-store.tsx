import { useContext } from "react";
import { DataProviderContext } from "@/context/data-provider";

export const useStore = () => {
    const context = useContext(DataProviderContext);

    if (context === undefined)
        throw new Error("useStore must be used within DataProvider");

    return context;
};
