const constants = {
    SERVER_URL: import.meta.env.VITE_SERVER_URL || "",
    OPENWEATHER_KEY: import.meta.env.VITE_OPEWEATHER_KEY || "",
    MAPBOX_KEY: import.meta.env.VITE_MAPBOX_KEY || "",
} as const;

Object.entries(constants).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`${key} is required`);
    }
});

export default constants;

