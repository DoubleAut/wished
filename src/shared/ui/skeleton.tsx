import { cn } from '@/shared/lib/classNames/cn';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="skeleton"
            className={cn('bg-muted animate-pulse rounded-xl', className)}
            {...props}
        />
    );
}

export { Skeleton };
