import { cn } from '@/shared/lib/classNames/cn';
import { Wish } from '@/shared/types/Wish';
import { Typography } from '@/shared/ui/Text/typography';
import { AspectRatio } from '@/shared/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import Image from 'next/image';
import { useState } from 'react';

export const Background = ({
    isHover,
    text,
}: {
    text: string;
    isHover: boolean;
}) => {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-accent">
            <Image
                src="/placeholder-light.jpg"
                className={cn(
                    'background-cover brightness-75 transition-all',
                    isHover && 'scale-105',
                )}
                alt="placeholder"
                fill
            />
            <p className="z-10 text-center font-bold text-secondary">
                {text.toUpperCase()}
            </p>
        </div>
    );
};

export const WishCard = ({ wish }: { wish: Wish }) => {
    const [isHover, setHover] = useState(false);
    const date = new Date(wish.created_at);
    const splitted = [date.getDay(), date.getMonth(), date.getFullYear()];

    return (
        <AspectRatio
            ratio={4 / 3}
            className="relative flex flex-col justify-end overflow-hidden rounded"
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {wish.picture ? (
                <Image
                    className={cn(
                        'object-cover brightness-75 transition-transform',
                        isHover && 'scale-105',
                    )}
                    src={wish.picture}
                    alt="Wish picture"
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 200px, (max-width: 1024px) 200px"
                    fill
                />
            ) : (
                <Background isHover={isHover} text={wish.title} />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary"></div>

            <div className="flex flex-col p-4">
                <div className="z-10 flex flex-col justify-end gap-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            className="object-cover"
                            src={wish.owner.picture ?? 'avatar_not_found.png'}
                            alt="@shadcn"
                        />
                        <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                    <div className="flex justify-between font-bold">
                        <Typography className="truncate text-primary">
                            {wish.title}
                        </Typography>
                        <Typography className="text-nowrap text-primary">
                            {wish.price} $
                        </Typography>
                    </div>
                </div>

                <div className="z-10 flex justify-between">
                    <Typography className="truncate text-primary sm:text-xs md:text-sm lg:text-base">
                        {wish.description}
                    </Typography>
                    <Typography className="text-primary">
                        {splitted.join('.')}
                    </Typography>
                </div>
            </div>
        </AspectRatio>
    );
};
