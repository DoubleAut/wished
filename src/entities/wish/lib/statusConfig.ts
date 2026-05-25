import {
    RiArchiveLine,
    RiGiftLine,
    RiHandbagLine,
    RiStarSFill,
} from '@remixicon/react';
import type { Wish } from '../../../../shared/types/Wish';

export interface StatusConfigEntry {
    icon: typeof RiStarSFill;
    label: string;
    className: string;
}

export const statusConfig: Record<Wish['status'], StatusConfigEntry> = {
    active: {
        icon: RiStarSFill,
        label: 'Active',
        className:
            'bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent',
    },
    reserved: {
        icon: RiGiftLine,
        label: 'Reserved',
        className:
            'bg-warning/15 text-warning dark:bg-warning/20 dark:text-warning',
    },
    gifted: {
        icon: RiHandbagLine,
        label: 'Gifted',
        className:
            'bg-success/15 text-success dark:bg-success/20 dark:text-success',
    },
    archived: {
        icon: RiArchiveLine,
        label: 'Archived',
        className:
            'bg-muted text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground',
    },
};
