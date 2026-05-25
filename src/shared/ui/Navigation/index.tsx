'use client';

import Link from 'next/link';

import { cn } from '@/shared/lib/classNames/cn';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/shared/ui/navigation-menu';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

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
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);

    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-1">
                {links.map(link => {
                    const isActive = pathname === link.path;

                    return (
                        <NavigationMenuItem
                            key={link.path}
                            className="relative"
                            onMouseOver={() => setHoveredNav(link.id)}
                            onMouseLeave={() => setHoveredNav(null)}
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

                            {isActive && (
                                <motion.span
                                    layoutId="nav-active"
                                    className="bg-accent/15 absolute inset-0 rounded-lg"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}

                            {hoveredNav === link.id && !isActive && (
                                <motion.span
                                    layoutId="nav-hover"
                                    className="bg-secondary absolute inset-0 -z-0 rounded-lg"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
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
