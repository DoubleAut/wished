'use client';

import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { RiMoreLine, RiNotificationLine } from '@remixicon/react';
import { MoreHorizontal } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface UserProps {
    avatar: ReactNode;
    initials: ReactNode;
    links: ReactNode;
    action?: ReactNode;
    follow?: ReactNode;
    more?: ReactNode;
}

interface MoreProps {
    currentPath: 'followers' | 'followings';
}

export const More = ({ currentPath }: MoreProps) => {
    const [open, setOpen] = useState(false);

    const isFollowers = currentPath === 'followers';

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger onMouseOver={() => setOpen(true)}>
                <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent onMouseLeave={() => setOpen(false)}>
                <DropdownMenuItem>Open friends</DropdownMenuItem>
                <DropdownMenuItem>
                    {isFollowers ? 'Remove from followers' : 'Unsubscribe'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const ProfileMore = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full" size="icon">
                    <RiMoreLine />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Open friends</DropdownMenuItem>
                <DropdownMenuItem>Block user</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const UserWidget = ({
    avatar,
    initials,
    links,
    action,
    follow,
    more,
}: UserProps) => {
    return (
        <div className="flex w-full flex-col space-y-4">
            <div className="flex w-full space-x-2">
                <Avatar className="aspect-square w-28">{avatar}</Avatar>
                <div className="flex w-full justify-end space-x-2">
                    <ProfileMore />
                    <Button
                        variant="outline"
                        className="rounded-full"
                        size="icon"
                    >
                        <RiNotificationLine />
                    </Button>
                    {follow}
                </div>
            </div>
            <div className="flex w-full flex-col space-y-2">
                {initials}
                {links}
                {action}
            </div>
            {more}
        </div>
    );
};

interface UserSmallProps {
    avatar: ReactNode;
    header: ReactNode;
    links: ReactNode;
    more: ReactNode;
}

export const UserSmallWidget = ({
    avatar,
    header,
    links,
    more,
}: UserSmallProps) => {
    return (
        <div className="flex items-center gap-5">
            <Avatar className="aspect-square w-28">{avatar}</Avatar>
            <div className="flex w-full flex-col space-y-2">
                {header}
                {links}
            </div>
            <div>{more}</div>
        </div>
    );
};
