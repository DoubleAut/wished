import { Header } from '@/shared/ui/Text/header';
import { Subheader } from '@/shared/ui/Text/subheader';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';
import { ReactNode } from 'react';

interface Props {
    header: string;
    subheader: string;
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
                <Subheader>{subheader}</Subheader>
                {action}
            </div>
        </div>
    );
};
