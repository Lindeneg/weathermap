import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import constants from "@/constants";
import WeatherMap from "@/components/weather-map";
import Combobox from "@/components/combo-box";
import Selector from "@/components/selector";
import Spinner from "@/components/spinner";
import { useStore } from "@/hooks/use-store";
import type { ThemeKind } from "@/hooks/use-theme";
import type { ScaleKind } from "@/hooks/use-scale";
import type { City } from "@/hooks/use-cities.tsx";

const App = () => {
    const { cities, theme, scale, position } = useStore();

    useEffect(() => {
        if (!position) return;
        (async () => {
            cities.setSuggestions([position]);
            await cities.setSelected(position);
        })();
    }, [position]);

    const handleCitySelectValue = async (value: string) => {
        const city = cities.suggestions.find((city) => city.display === value);
        await cities.setSelected(
            city && city.id !== cities.selected?.id ? city : null
        );
    };

    const handleCitySelect = async (city: City) => {
        if (city) {
            cities.setSuggestions([city]);
        }
        await cities.setSelected(city);
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden p-8 border-r bg-muted/40 md:block">
                <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
                    Weather App
                </h1>
                <p className="leading-7 mt-6">
                    This application allows you to see weather data in real-time
                    for over 40.000 cities.
                </p>
                <p className="leading-7 mt-6">
                    The app will ask for your location to show you the weather
                    data for your current location by default.
                </p>
                <p className="leading-7 mt-6">
                    Click on any city on the map to see weather data.
                    Alternatively, use the search field to find a city and the
                    map will fly to the location.
                </p>
                <p className="leading-7 mt-6">
                    There's a theme toggle in the top right corner, which also
                    contains a toggle between celsius and fahrenheit units.
                </p>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 justify-between items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <div className="flex flex-row gap-4 items-center">
                        <Combobox
                            context="city"
                            query={cities.query}
                            suggestions={cities.suggestions}
                            selected={cities.selected?.id ?? null}
                            onSelect={handleCitySelectValue}
                            onQueryChange={cities.setQuery}
                        />
                        {cities.isLoading && <Spinner />}
                    </div>
                    <div className="flex flex-row gap-4">
                        <Selector
                            options={[
                                { name: "Light", value: "light" },
                                { name: "Dark", value: "dark" },
                                { name: "System", value: "system" },
                            ]}
                            onSelect={(t) => theme.set(t as ThemeKind)}
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Selector>
                        <Selector
                            options={[
                                { name: "Celsius", value: "C" },
                                { name: "Fahrenheit", value: "F" },
                            ]}
                            onSelect={(s) => scale.set(s as ScaleKind)}
                        >
                            <span className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100">
                                &deg;{scale.current}
                            </span>
                            <span className="sr-only">Toggle scale</span>
                        </Selector>
                    </div>
                </header>
                <WeatherMap
                    apiKey={constants.MAPBOX_KEY}
                    selectedCity={cities.selected}
                    scale={scale.current}
                    onSelect={handleCitySelect}
                />
            </div>
        </div>
    );
};

export default App;
