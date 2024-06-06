'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
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
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.picture ?? 'avatar_not_found.png'} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer space-x-2" asChild>
                    <Link href="/profile">
                        <RiProfileLine />
                        <p>Profile</p>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer space-x-2" asChild>
                    <Link href="/settings">
                        <RiSettings2Line />
                        <p>Settings</p>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer space-x-2" asChild>
                    <Link
                        href={`auth/logout?${createQueryString('returnUrl', pathname)}`}
                    >
                        <RiLogoutBoxLine />
                        <p>Logout</p>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
