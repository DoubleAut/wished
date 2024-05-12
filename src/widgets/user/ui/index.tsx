import { Avatar } from '@/shared/ui/avatar';
import { ReactNode } from 'react';

interface Props {
    avatar: ReactNode;
    header: ReactNode;
    links: ReactNode;
    action?: ReactNode;
}

export const UserWidget = ({ avatar, header, links, action }: Props) => {
    return (
        <div className="flex items-center gap-5">
            <Avatar className="aspect-square w-28">{avatar}</Avatar>
            <div className="flex flex-col space-y-2">
                {header}
                <div className="flex space-x-2">{links}</div>
                {action}
            </div>
        </div>
    );
};
