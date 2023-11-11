import { cn } from '@/shared/lib/cn';
import { ReactNode } from 'react';

export const Wrapper = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => <div className={cn('flex flex-col gap-2', className)}>{children}</div>;
