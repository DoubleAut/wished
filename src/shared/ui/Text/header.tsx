import { cn } from '@/shared/lib/classNames/cn';
import { ReactNode } from 'react';
import { Label } from '../label';

interface Props {
    children: ReactNode;
    className?: string;
}

export const Header = ({ children, className }: Props) => {
    return (
        <Label
            className={cn(
                'text-2xl font-semibold leading-none tracking-tight',
                className,
            )}
        >
            {children}
        </Label>
    );
};
