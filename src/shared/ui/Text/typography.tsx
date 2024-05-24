import { cn } from '@/shared/lib/classNames/cn';
import { ReactNode } from 'react';
import { Label } from '../label';

interface Props {
    children: ReactNode;
}

export const Typography = ({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) => (
    <Label className={cn('sm:text-sm md:text-base lg:text-lg', className)}>
        {children}
    </Label>
);
