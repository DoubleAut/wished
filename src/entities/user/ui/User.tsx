import { User } from '@/shared/types/User';
import { Wish } from '@/shared/types/Wish';
import { Header } from '@/shared/ui/Text/header';
import { AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

interface UserAvatarProps {
    href: string | undefined;
}

export const UserAvatar = ({ href }: UserAvatarProps) => {
    return (
        <AvatarImage
            src={href || '/avatar_not_found.png'}
            className="h-full w-full"
        />
    );
};

interface UserInitialsProps {
    name: string;
    surname: string;
}

export const UserInitials = ({ name, surname }: UserInitialsProps) => {
    return (
        <Header className="self-center">
            {name} {surname}
        </Header>
    );
};

interface UserLinksProps {
    followings: User[];
    followers: User[];
    wishes: Wish[];
    reservations: Wish[];
}

interface CustomLinkProps {
    children: ReactNode;
    href: string;
}

const CustomLink = ({ children, href }: CustomLinkProps) => (
    <Button variant="link">
        <Link href={href}>{children}</Link>
    </Button>
);

export const UserLinks = ({
    followings,
    followers,
    reservations,
    wishes,
}: UserLinksProps) => {
    return (
        <div className="flex space-x-2">
            <CustomLink href="/followings">
                <p>{followings.length}</p>
                <p>followings</p>
            </CustomLink>
            <CustomLink href="/followers">
                <p>{followers.length}</p>
                <p>followers</p>
            </CustomLink>
            <CustomLink href="/wishes">
                <p>{wishes.length}</p>
                <p>wishes</p>
            </CustomLink>
            <CustomLink href="/reservations">
                <p>{reservations.length}</p>
                <p className="cursor-pointer">reserved</p>
            </CustomLink>
        </div>
    );
};
