'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { AUTH_LINKS } from '@/shared/lib/constants/Links';
import {
    RiLogoutBoxLine,
    RiProfileLine,
    RiSettings2Line,
} from '@remixicon/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Navigation } from '../Navigation';
import { Avatar, AvatarImage } from '../avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../dropdown-menu';

export const UserHeaderAvatar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const user = useViewerStore(state => state.user);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    if (!user) {
        return <Navigation links={AUTH_LINKS} />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
                <Avatar className="ring-accent/20 hover:ring-accent/30 h-9 w-9 rounded-lg ring-2 transition-shadow">
                    <AvatarImage src={user.picture ?? 'avatar_not_found.png'} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card w-48">
                <div className="flex items-center gap-3 px-2 py-1.5">
                    <Avatar className="h-8 w-8 rounded-md">
                        <AvatarImage
                            src={user.picture ?? 'avatar_not_found.png'}
                        />
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-foreground text-sm font-medium leading-none">
                            {user.name ?? user.username}
                        </span>
                        <span className="text-muted-foreground mt-0.5 text-xs">
                            {user.email ?? ''}
                        </span>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2" asChild>
                    <Link href="/profile">
                        <RiProfileLine className="h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2" asChild>
                    <Link href="/settings">
                        <RiSettings2Line className="h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2" asChild>
                    <Link
                        href={`auth/logout?${createQueryString('returnUrl', pathname)}`}
                        className="text-destructive"
                    >
                        <RiLogoutBoxLine className="h-4 w-4" />
                        <span>Logout</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
