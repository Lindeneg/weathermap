import { useEffect, useState } from "react";
import { getGeoLocation } from "@/lib/utils";
import { useFetch } from "@/hooks/use-fetch";
import constants from "@/constants";

// tmp
type City = any;

export type UseGeoLocationHook = ReturnType<typeof useGeoLocation>;

export const useGeoLocation = () => {
    const [position, setPosition] = useState<City | null>(null);
    const { get } = useFetch();

    useEffect(() => {
        (async () => {
            try {
                const pos = await getGeoLocation();
                if (!pos.coords) return;
                const response = await get<City>(
                    `${constants.SERVER_URL}/closest-city/?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
                );
                if (!response) return;
                setPosition(response);
            } catch (err) {
                console.log("Failed to get current location", err);
            }
        })();
    }, []);

    return position;
};
