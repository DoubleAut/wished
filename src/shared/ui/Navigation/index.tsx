'use client';

import Link from 'next/link';

import { cn } from '@/shared/lib/classNames/cn';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/shared/ui/navigation-menu';
import { usePathname } from 'next/navigation';
import React from 'react';

type Link = {
    id: string;
    label: string;
    path: string;
};

interface Props {
    links: Link[];
}

export const Navigation = ({ links }: Props) => {
    const pathname = usePathname();

    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-1" defaultValue="/">
                {links.map(link => {
                    const isActive = pathname === link.path;

                    return (
                        <NavigationMenuItem
                            key={link.path}
                            className="relative"
                        >
                            <NavigationMenuLink asChild>
                                <Link
                                    href={link.path}
                                    className={cn(
                                        'relative z-10 inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'text-foreground'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                        className,
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
