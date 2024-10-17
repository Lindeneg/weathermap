import { useState } from "react";

export type ScaleKind = "C" | "F";

type ScaleProps = {
    defaultKind: ScaleKind;
    storageKey: string;
};

export type UseScaleHook = ReturnType<typeof useScale>;

export const useScale = ({ defaultKind, storageKey }: ScaleProps) => {
    const [scale, setScale] = useState<ScaleKind>(
        () => (localStorage.getItem(storageKey) as ScaleKind) || defaultKind
    );
    return {
        current: scale,
        set: (scale: ScaleKind) => {
            localStorage.setItem(storageKey, scale);
            setScale(scale);
        },
    };
};
