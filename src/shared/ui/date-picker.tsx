'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '../lib/classNames/cn';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface Props {
    selected: Date | null;
    onSelect: (date: Date | undefined) => void;
}

export const DatePicker = ({ selected, onSelect }: Props) => {
    return (
        <Popover modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'flex w-full justify-start text-left font-normal',
                        !selected && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selected ? (
                        format(selected, 'PPP')
                    ) : (
                        <span>Pick a data</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="z-50 w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selected ?? undefined}
                    onSelect={onSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};
