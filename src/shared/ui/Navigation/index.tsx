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
            <NavigationMenuList className="space-x-0">
                {links.map(link => (
                    <NavigationMenuItem
                        key={link.path}
                        className="relative h-10 px-4 py-2"
                        onMouseOver={() => setHoveredNav(link.id)}
                        onMouseLeave={() => setHoveredNav(null)}
                    >
                        <Link href={link.path} legacyBehavior passHref>
                            <NavigationMenuLink className="z-20">
                                {link.label}
                            </NavigationMenuLink>
                        </Link>

                        {hoveredNav === link.id && (
                            <motion.span
                                layoutId="hover"
                                className="absolute inset-0 -z-10 rounded bg-accent"
                                transition={{
                                    stiffness: 200,
                                    damping: 15,
                                    mass: 0.2,
                                    duration: 0.2,
                                }}
                            />
                        )}

                        {pathname === link.path && (
                            <motion.span
                                layoutId="active"
                                className="absolute -bottom-1 left-0 h-[2px] w-full rounded bg-accent-foreground"
                                transition={{
                                    stiffness: 200,
                                    damping: 15,
                                    mass: 0.1,
                                    duration: 0.2,
                                }}
                            />
                        )}
                    </NavigationMenuItem>
                ))}
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
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className,
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
