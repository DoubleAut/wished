'use client';

import {
    CheckCircleIcon,
    InfoIcon,
    Loader2Icon,
    OctagonIcon,
    TriangleIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            icons={{
                success: <CheckCircleIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleIcon className="size-4" />,
                error: <OctagonIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: 'cn-toast [&[data-type=success]]:border-l-4 [&[data-type=success]]:border-l-success [&[data-type=error]]:border-l-4 [&[data-type=error]]:border-l-destructive [&[data-type=warning]]:border-l-4 [&[data-type=warning]]:border-l-warning [&[data-type=info]]:border-l-4 [&[data-type=info]]:border-l-accent',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
