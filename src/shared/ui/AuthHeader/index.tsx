'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { AUTH_LINKS } from '@/shared/lib/constants/Links';
import { RiProfileLine, RiSettings2Line } from '@remixicon/react';
import Link from 'next/link';
import { Navigation } from '../Navigation';
import { Avatar, AvatarImage } from '../avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../dropdown-menu';

export const AuthHeader = () => {
    const user = useViewerStore(state => state.user);

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
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
