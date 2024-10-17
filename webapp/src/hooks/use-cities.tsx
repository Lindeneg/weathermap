import { useEffect, useState } from "react";
import constants from "@/constants";
import { useFetch } from "./use-fetch";

type WeatherResponse = {
    weather: { main: string; description: string; icon: string }[];
    main: Record<
        "temp" | "feels_like" | "temp_min" | "temp_max" | "humidity",
        number
    >;
    wind: Record<"speed", number>;
    clouds: Record<"all", number>;
};

export type City = {
    id: number;
    name: string;
    display: string;
    country: string;
    lat: number;
    lng: number;
    population: number | null;
    weather?: WeatherResponse | null;
};

export type UseCitiesHook = ReturnType<typeof useCities>;

export const useCities = () => {
    const [suggestions, setSuggestions] = useState<City[]>([]);
    const [selected, setSelected] = useState<City | null>(null);
    const [query, setQuery] = useState("");
    const { get, isLoading } = useFetch();

    useEffect(() => {
        (async () => {
            const response = await get<City[]>(
                `${constants.SERVER_URL}/cities/?q=${query}&limit=5&offset=0`
            );
            setSuggestions(response ?? []);
        })();
    }, [query, get]);

    return {
        suggestions,
        selected,
        query,
        isLoading,
        setQuery,
        setSuggestions,
        setSelected: async (city: City | null) => {
            // TODO: could cache this result with 3600s TTL
            if (city) {
                const response = await get<WeatherResponse>(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lng}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${constants.OPENWEATHER_KEY}`
                );
                city.weather = response
                    ? {
                          weather: response.weather,
                          main: response.main,
                          wind: response.wind,
                          clouds: response.clouds,
                      }
                    : null;
            }
            setSelected(city);
        },
    };
};
