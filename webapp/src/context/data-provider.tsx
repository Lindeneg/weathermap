import { createContext, type ReactNode } from "react";
import { useCities, type UseCitiesHook } from "@/hooks/use-cities";
import { useTheme, type UseThemeHook } from "@/hooks/use-theme";
import { useScale, type UseScaleHook } from "@/hooks/use-scale";
import {
    useGeoLocation,
    type UseGeoLocationHook,
} from "@/hooks/use-geolocation";

type DataProviderProps = {
    children: ReactNode;
};

type DataProviderState = {
    cities: UseCitiesHook;
    theme: UseThemeHook;
    position: UseGeoLocationHook;
    scale: UseScaleHook;
};

const initialState: DataProviderState = {
    cities: {
        suggestions: [],
        selected: null,
        query: "",
        setQuery: () => null,
        setSelected: async () => {},
        setSuggestions: () => null,
    },
    theme: {
        current: "system",
        set: () => null,
    },
    position: null,
    scale: {
        current: "C",
        set: () => null,
    },
};

export const DataProviderContext =
    createContext<DataProviderState>(initialState);

export const DataProvider = ({ children, ...props }: DataProviderProps) => {
    const cities = useCities();
    const theme = useTheme({
        defaultTheme: "system",
        storageKey: "mapbox-app-theme",
    });
    const scale = useScale({
        defaultKind: "C",
        storageKey: "mapbox-app-scale",
    });
    const position = useGeoLocation();

    const value = {
        cities,
        theme,
        position,
        scale,
    };

    return (
        <DataProviderContext.Provider {...props} value={value}>
            {children}
        </DataProviderContext.Provider>
    );
};
