'use client';

import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/shared/lib/classNames/cn';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/shared/ui/navigation-menu';

export const Navigation = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/wishes" legacyBehavior passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            My wishes
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/ideas" legacyBehavior passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            Ideas
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/friends" legacyBehavior passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            Friends
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/recommendations" legacyBehavior passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            Recommendations
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
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
