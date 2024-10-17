import { useState, useCallback, useEffect, useRef } from "react";

export function useFetch() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    /* we want to save a reference to all active requests,
       as we could in theory have more than one. We want to
       abort them when the component that uses the hook is unmounted */
    const activeRequests = useRef<AbortController[]>([]);

    // we could add more methods here like POST, PUT, DELETE, etc.
    // but for this app we only need GET for now
    const get = useCallback(async function <TResponse>(
        url: string
    ): Promise<TResponse | null> {
        setIsLoading(true);
        const abortController = new AbortController();
        activeRequests.current.push(abortController);
        let result: TResponse | null = null;
        try {
            const response = await fetch(url, {
                method: "GET",
                signal: abortController.signal,
            });
            activeRequests.current = activeRequests.current.filter(
                (e) => e !== abortController
            );
            if (response.ok) {
                result = (await response.json()) as TResponse;
            } else {
                // we could get a lot more elaborate here handling different errors using `response.status`
                // however, I think it's perfectly fine for this simple application to show a generic error
                setError("An Error Occurred");
            }
        } catch (err) {
            setError(String(err));
        }
        setIsLoading(false);
        return result;
    }, []);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    useEffect(() => {
        return () => {
            activeRequests.current.forEach((controller) => {
                controller.abort();
            });
        };
    }, []);

    return { isLoading, error, get, clearError };
}
