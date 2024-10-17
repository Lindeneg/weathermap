import { useEffect, useState } from "react";

export type ThemeKind = "dark" | "light" | "system";

type ThemeProps = {
    defaultTheme: ThemeKind;
    storageKey: string;
};

export type UseThemeHook = ReturnType<typeof useTheme>;

export const useTheme = ({ defaultTheme, storageKey }: ThemeProps) => {
    const [theme, setTheme] = useState<ThemeKind>(
        () => (localStorage.getItem(storageKey) as ThemeKind) || defaultTheme
    );

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    return {
        current: theme,
        set: (theme: ThemeKind) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };
};
