import { cn } from '@/shared/lib/classNames/cn';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const baseClasses = {
    h1: 'antialiased font-sans text-5xl font-bold leading-tight text-inherit',
    h2: 'antialiased font-sans text-4xl font-bold leading-[1.3] text-inherit',
    h3: 'antialiased font-sans text-3xl font-bold leading-snug text-inherit',
    h4: 'antialiased font-sans text-2xl font-semibold leading-snug text-inherit',
    h5: 'antialiased font-sans text-xl font-semibold leading-snug text-inherit',
    h6: 'antialiased font-sans text-base font-semibold leading-normal text-inherit',
    lead: 'antialiased font-sans text-lg font-bold leading-normal text-inherit',
    paragraph:
        'antialiased font-sans text-sm font-light leading-normal text-inherit',
    small: 'antialiased font-sans text-xs font-light leading-normal text-inherit',
};

interface Props {
    variant: keyof typeof baseClasses;
    children: ReactNode;
    className?: string;
}

export const Typography = ({ variant, children, className = '' }: Props) => {
    switch (variant) {
        case 'h1':
            return (
                <h1 className={cn(baseClasses.h1, className)}>{children}</h1>
            );
        case 'h2':
            return (
                <h2 className={cn(baseClasses.h2, className)}>{children}</h2>
            );
        case 'h3':
            return (
                <h3 className={cn(baseClasses.h3, className)}>{children}</h3>
            );
        case 'h4':
            return (
                <h4 className={cn(baseClasses.h4, className)}>{children}</h4>
            );
        case 'h5':
            return (
                <h5 className={cn(baseClasses.h5, className)}>{children}</h5>
            );
        case 'h6':
            return (
                <h6 className={cn(baseClasses.h6, className)}>{children}</h6>
            );
        case 'lead':
            return (
                <p className={cn(baseClasses.lead, className)}>{children}</p>
            );
        case 'paragraph':
            return (
                <p className={cn(baseClasses.paragraph, className)}>
                    {children}
                </p>
            );
        case 'small':
            return (
                <p className={cn(baseClasses.small, className)}>{children}</p>
            );
    }
};
