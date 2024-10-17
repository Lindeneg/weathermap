import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SelectorProps {
    options: { name: string; value: string }[];
    onSelect: (opt: string) => void;
    children: ReactNode;
}

const Selector = ({ options, onSelect, children }: SelectorProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {children}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {options.map((opt) => (
                    <DropdownMenuItem
                        key={opt.value}
                        onClick={() => onSelect(opt.value)}
                    >
                        {opt.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Selector;
