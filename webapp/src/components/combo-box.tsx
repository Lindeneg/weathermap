import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
    context: string;
    query: string;
    suggestions: { id: number; name: string; display: string }[];
    selected: number | null;
    onSelect: (value: string) => void;
    onQueryChange: (query: string) => void;
}

const Combobox = ({
    context,
    query,
    suggestions,
    selected,
    onSelect,
    onQueryChange,
}: ComboboxProps) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                style={{ minWidth: "200px", width: "auto" }}
                asChild
            >
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selected !== null
                        ? suggestions.find(
                              (suggestion) => suggestion.id === selected
                          )?.display
                        : `Select a ${context}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent forceMount className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        value={query}
                        placeholder={`Search ${context}...`}
                        onValueChange={onQueryChange}
                    />
                    <CommandList>
                        <CommandEmpty>No {context} found.</CommandEmpty>
                        <CommandGroup>
                            {suggestions.map((suggestion) => (
                                <CommandItem
                                    key={suggestion.id}
                                    value={suggestion.display}
                                    onSelect={(currentValue) => {
                                        onSelect(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected === suggestion.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {suggestion.display}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default Combobox;
