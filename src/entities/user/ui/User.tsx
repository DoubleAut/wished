import { User } from '@/shared/types/User';
import { Wish } from '@/shared/types/Wish';
import { Header } from '@/shared/ui/Text/header';
import { AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

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

export const UserLinks = ({
    followings,
    followers,
    reservations,
    wishes,
}: UserLinksProps) => {
    return (
        <div className="flex space-x-2">
            <Button variant="ghost">
                <Link href="/followings">{followings.length} followings</Link>
            </Button>
            <Button variant="ghost">
                <Link href="/followers">{followers.length} followers</Link>
            </Button>
            <Button variant="ghost">
                <Link href="/wishes">{wishes.length} wishes</Link>
            </Button>
            <Button variant="ghost">
                <Link href="/reservations">{reservations.length} reserved</Link>
            </Button>
        </div>
    );
};
