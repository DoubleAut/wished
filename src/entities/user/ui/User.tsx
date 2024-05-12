import { Header } from '@/shared/ui/Text/header';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
    header: string;
    subheader: {
        followings: number;
        wishes: number;
        reserved: number;
    };
    picture?: string;
    action?: ReactNode;
}

export const User = ({ header, subheader, picture, action }: Props) => {
    return (
        <div className="flex gap-5">
            <Avatar className="aspect-square w-28">
                {picture && (
                    <AvatarImage src={picture} className="h-full w-full" />
                )}
            </Avatar>
            <div className="flex flex-col gap-2">
                <Header>{header}</Header>
                <div className="flex space-x-2">
                    <Button variant="link" asChild>
                        <Link href="/friends">
                            {subheader.followings} friends
                        </Link>
                    </Button>
                    <Button variant="link" asChild>
                        <Link href="/wishes">{subheader.wishes} wishes</Link>
                    </Button>
                    <Button variant="link" asChild>
                        {subheader.reserved} reserved
                    </Button>
                </div>
                {action}
            </div>
        </div>
    );
};
